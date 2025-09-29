import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import { queryData, deleteItem, search } from '../../utils/query'
import { io } from '../../app'
import { uploadFilesToS3 } from '../../utils/fileUpload'

import { User } from '../../models/users/user'
import { ISchool, School } from '../../models/school/schoolModel'
import { BioUserState } from '../../models/users/bioUserState'
import {
  IOffice,
  ISchoolPosition,
  Office,
  SchoolPosition,
} from '../../models/utility/officeModel'
import { SchoolStaff } from '../../models/school/schoolStaffModel'
import { BioUser, IBioUser } from '../../models/users/bioUser'
import {
  sendPersonalNotification,
  sendSocialNotification,
} from '../../utils/sendNotification'
import { sendOfficialMessage } from '../../utils/sendMessage'
import { OfficialMessage } from '../../models/message/officialMessageModel'
import { SocialNotification } from '../../models/message/socialNotificationModel'
import { OfficeMessageTemplate } from '../../models/message/officeMessageTemplateModel'

interface SchoolLevels {
  id: string
  institution: string
}

export const createSchool = async (
  req: Request,
  res: Response
): Promise<void> => {
  req.body.levels = JSON.parse(req.body.levels)
  req.body.createdLocation = JSON.parse(req.body.createdLocation)
  req.body.isNew = true

  try {
    const uploadedFiles = await uploadFilesToS3(req)
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url
    })

    const school = await School.create(req.body)
    req.body.officeId = school._id
    const office = await Office.create(req.body)

    const pendingOffice = {
      id: office._id,
      name: office.name,
      officeId: req.body.officeId,
      type: 'School',
      username: school.username,
    }

    const bioUserState = await BioUserState.findOneAndUpdate(
      { bioUserId: school.bioUserId },
      {
        $set: {
          processingOffice: true,
          bioUserUsername: school.bioUserUsername,
          pendingOffice: pendingOffice,
        },
      },
      { upsert: true, new: true }
    )

    io.emit(`notification_${school.bioUserUsername}`, { bioUserState })
    res.status(200).json({
      message: 'School was created successfully',
      data: school,
      office: office,
      bioUserState,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const approveSchool = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const approved = req.body.isApproved

    const school = await School.findOneAndUpdate(
      { username: req.params.username },
      req.body
    )

    const bioUser = await BioUser.findById(school.bioUserId)
    if (approved) {
      /////////////CREATE SOCIAL ACCOUNT////////////
      await User.findOneAndUpdate(
        { username: school.username },
        {
          isVerified: true,
          username: school.username,
          displayName: school.name,
          status: 'School',
          picture: school.logo,
          media: school.media,
          email: school.email,
          intro: school.description,
        },
        { new: true, upsert: true }
      )

      /////////////UPDATE OFFICE APPROVED////////////
      const office = await Office.findOneAndUpdate(
        { officeId: school._id },
        {
          isApproved: approved,
          username: school.username,
          name: school.name,
          type: 'School',
          isUserActive: true,
          bioUserId: bioUser._id,
          bioUserPicture: bioUser.bioUserPicture,
          bioUserUsername: bioUser.bioUserUsername,
          level: 10,
          userType: 'Owner',
        },
        { new: true, upsert: true }
      )

      const offices = await Office.countDocuments({
        bioUserId: school.bioUserId,
        isApproved: approved,
      })

      const activeOffice = {
        id: office._id,
        name: school.name,
        officeId: school._id.toString(),
        type: office.type,
        username: school.username,
        position: 'Owner',
        level: 10,
        isUserActive: true,
      }

      await BioUserState.findOneAndUpdate(
        { bioUserId: school.bioUserId },
        {
          $addToSet: { offices: activeOffice },
          $set: {
            processingOffice: false,
            numberOfOffices: offices,
            bioUserUsername: school.bioUserUsername,
            activeOffice: activeOffice,
          },
        },
        { upsert: true, new: true }
      )
    }

    const bioUserState = await BioUserState.findOne({
      bioUserId: school.bioUserId,
    })

    const newNotification = await sendPersonalNotification(
      approved ? 'school_creation_approval' : 'school_creation_failed',
      {
        senderUsername: 'Schooling',
        receiverUsername: bioUser.bioUserUsername,
        senderName: 'Schooling Social',
        receiverName: bioUser.bioUserDisplayName,
        senderPicture: 'active-icon.png',
        receiverPicture: bioUser.bioUserPicture,
      }
    )

    if (
      school.institutions.includes('Nursery') ||
      school.institutions.includes('Primary') ||
      school.institutions.includes('Secondary') ||
      school.levels.map((item) => item.levelName.includes('Nursery')) ||
      school.levels.map((item) => item.levelName.includes('Primary')) ||
      school.levels.map((item) => item.levelName.includes('Secondary'))
    ) {
      updatePosition(school, [])
    }

    const activeOffice = await Office.findOne({ officeId: school._id })
    const userOffices = await Office.find({ bioUserId: bioUser._id })

    io.emit(`notification_${school.bioUserUsername}`, {
      ...newNotification,
      bioUserState,
      activeOffice,
      userOffices,
    })

    res.status(200).json({
      message: approved
        ? 'School is approved successfully'
        : 'School is declined successfully',
      data: school,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const schoolApplication = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bioUser = await BioUser.findById(req.body.bioUserId)
    const school = await School.findById(req.params.id)

    const staff = await Office.findOneAndUpdate(
      { bioUserId: req.body.bioUserId, officeId: req.params.id },
      {
        $set: {
          bioUserId: bioUser._id,
          bioUserDisplayName: bioUser.bioUserDisplayName,
          bioUserIntro: bioUser.bioUserIntro,
          bioUserMedia: bioUser.bioUserMedia,
          bioUserPicture: bioUser.bioUserPicture,
          bioUserUsername: bioUser.bioUserUsername,
          userType: req.body.userRegistration,
          schoolLevel: req.body.level,
          schoolLevelName: req.body.levelName,
          isUserApplied: true,
          name: school.name,
          username: school.username,
          officeId: school._id,
          logo: school.logo,
          area: school.area,
          state: school.state,
          country: school.country,
          continent: school.continent,
        },
      },
      { new: true, upsert: true }
    )

    if (req.body.userRegistration === 'Staff') {
      const officeMessage = await sendOfficialMessage({
        senderUsername: bioUser.bioUserUsername,
        receiverUsername: school.username,
        senderName: bioUser.bioUserDisplayName,
        receiverName: school.name,
        senderPicture: bioUser.bioUserPicture,
        receiverPicture: school.logo,
        senderAddress: bioUser.residentAddress,
        senderArea: bioUser.residentArea,
        senderState: bioUser.residentState,
        senderCountry: bioUser.residentCountry,
        receiverAddress: school.address,
        receiverArea: school.area,
        receiverState: school.state,
        receiverCountry: school.country,
        title: req.body.title,
        content: req.body.content,
        greetings: req.body.greetings,
        unread: true,
      })

      const unreadStaffs = await Office.countDocuments({
        officeId: school._id,
        isUserApplied: true,
        userType: 'Staff',
      })

      io.emit(`official_message_${school.username}`, {
        ...officeMessage,
        unreadStaffs,
        staff,
      })

      io.emit(`official_message_${bioUser.bioUserUsername}`, {
        ...officeMessage,
      })
    } else {
      const socialNotification = await sendSocialNotification(
        'school_application',
        {
          senderUsername: bioUser.bioUserUsername,
          receiverUsername: school.username,
          senderName: bioUser.bioUserDisplayName,
          receiverName: school.name,
          senderPicture: bioUser.bioUserPicture,
          receiverPicture: school.logo,
        }
      )
      const unreadStudents = await Office.countDocuments({
        officeId: school._id,
        isUserApplied: true,
        userType: 'Student',
      })
      io.emit(`school_social_notification_${school.username}`, {
        ...socialNotification,
        unreadStudents,
        staff,
      })
    }

    school.isApplied = true

    res.status(200).json({
      message: 'Your school application was successful.',
      data: school,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const approveSchoolApplication = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const applicants = req.body.selectedApplicants
    const status = req.body.status
    const office = await Office.findOne({ username: req.params.username })
    const message = await OfficeMessageTemplate.findById(
      req.body.notificationId
    )

    const notifyUserApplication = async (
      status: boolean,
      bioUser: IBioUser
    ) => {
      const officialMessage = await sendOfficialMessage({
        greetings: message.greetings.replace(
          '[Receiver]',
          bioUser.bioUserDisplayName
        ),
        title: message.title,
        senderUsername: office.username,
        receiverUsername: bioUser.bioUserUsername,
        senderName: office.name,
        receiverName: bioUser.bioUserDisplayName,
        senderPicture: office.logo,
        receiverPicture: bioUser.bioUserPicture,
        senderAddress: office.address,
        senderArea: office.area,
        senderState: office.state,
        senderCountry: office.country,
        receiverAddress: bioUser.residentAddress,
        receiverArea: bioUser.residentArea,
        receiverState: bioUser.residentState,
        receiverCountry: bioUser.residentCountry,
        content: message.content,
        unread: true,
      })

      if (status) {
        const bioUserState = await BioUserState.findOne({
          bioUserId: bioUser._id,
        })

        io.emit(`official_message_${bioUser.bioUserUsername}`, {
          ...officialMessage,
          bioUserState,
        })
        io.emit(`school_staff_${req.params.username}`, {
          ...officialMessage,
          accepted: true,
          removeId: bioUser._id,
        })
      } else {
        io.emit(`official_message_${bioUser.bioUserUsername}`, officialMessage)
        io.emit(`school_staff_${req.body.senderUsername}`, {
          ...officialMessage,
          accepted: false,
        })
      }
    }

    for (let i = 0; i < applicants.length; i++) {
      const el = applicants[i]
      const bioUser = await BioUser.findOne({
        bioUserUsername: el.bioUserUsername,
      })

      if (status) {
        const activeOffice = {
          id: office._id,
          name: office.name,
          officeId: office.officeId.toString(),
          type: office.type,
          username: office.username,
          position: 'Unknown',
          level: 1,
          isUserActive: true,
        }

        await BioUserState.findOneAndUpdate(
          { bioUserId: bioUser._id },
          {
            $addToSet: { offices: activeOffice },
            $set: {
              processingOffice: false,
              bioUserUsername: bioUser.bioUserUsername,
              activeOffice: activeOffice,
            },
            $inc: { numberOfOffices: 1 },
          },
          { upsert: true, new: true }
        )

        await Office.findOneAndUpdate(
          { username: office.username, bioUserId: bioUser._id },
          {
            $set: {
              isUserActive: true,
              isUserApplied: false,
              name: office.name,
              officeId: office.officeId.toString(),
              type: office.type,
              position: 'Unknown',
              userType: req.body.userType,
              level: 1,
            },
          }
        )
      }

      notifyUserApplication(status, bioUser)
    }

    const result = await queryData<IOffice>(Office, req)
    res.status(200).json({
      result,
      message: status
        ? 'The user application has been approved successfully.'
        : 'The user application has been declined successfully.',
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const cancelApplication = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bioUser = await BioUser.findById(req.query.bioUserId)
    const office = await Office.findOne({ officeId: req.params.id })

    const removeMsgId = await OfficialMessage.findOne({
      senderUsername: req.query.username,
    }).select('_id')

    const msg = await sendSocialNotification('school_application_removal', {
      senderUsername: bioUser.bioUserUsername,
      receiverUsername: office.username,
      senderName: bioUser.bioUserDisplayName,
      receiverName: office.name,
      senderPicture: bioUser.bioUserPicture,
      receiverPicture: office.logo,
      gender: bioUser.gender === 'Male' ? 'he' : 'she',
    })

    await Office.findOneAndDelete({
      bioUserId: req.query.bioUserId,
      officeId: req.params.id,
    })

    const unreadStaffs = await Office.countDocuments({
      officeId: req.params.id,
      isUserApplied: true,
    })

    io.emit(`school_staff_${office.username}`, {
      ...msg,
      removeId: removeMsgId._id,
      unreadStaffs,
      action: 'cancel_application',
      bioUserId: bioUser._id,
    })

    await OfficialMessage.deleteMany({
      senderUsername: req.query.username,
    })

    const school = await School.findById(req.params.id)
    school.isApplied = false

    res.status(200).json({
      message: 'School application has been cancelled successfully.',
      data: school,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getSchoolById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await School.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'School not found' })
    }
    res.status(200).json({ data: item })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getSchoolByUsername = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await School.findOne({ username: req.params.username })
    if (!item) {
      return res.status(404).json({ message: 'School not found' })
    }
    const isApplied = await Office.findOne({
      bioUserId: req.query.bioUserId,
      officeId: item._id,
    })
    const schoolPositions = await SchoolPosition.find({
      officeUsername: req.params.username,
    })
    item.isApplied = isApplied ? true : false
    res.status(200).json({ data: item, schoolPositions })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getSchools = async (req: Request, res: Response) => {
  try {
    const result = await queryData<ISchool>(School, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getSchoolStaffs = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IOffice>(Office, req)
    res.status(200).json({ count: result.count, results: result.results })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getSchoolNotifications = async (req: Request, res: Response) => {
  try {
    const unreadStaffs = await Office.countDocuments({
      username: req.query.username,
      isUserApplied: true,
      userType: 'Staff',
    })

    const unreadStudents = await Office.countDocuments({
      username: req.query.username,
      isUserApplied: true,
      userType: 'Student',
    })

    const unreadMessages = await OfficialMessage.countDocuments({
      receiverUsername: req.query.username,
      unread: true,
    })

    const unreadNotifications = await SocialNotification.countDocuments({
      receiverUsername: req.query.username,
      unread: true,
    })

    res.status(200).json({
      unreadStudents,
      unreadStaffs,
      unreadMessages,
      unreadNotifications,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getStaff = async (req: Request, res: Response) => {
  try {
    const staff = await SchoolStaff.findOne({
      bioUserId: req.params.id,
      schoolUsername: req.query.schoolUsername,
    })
    res.status(200).json({ staff: staff })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateSchool = async (req: Request, res: Response) => {
  try {
    if (req.body.studentRegistration) {
      req.body.studentRegistration = JSON.parse(req.body.studentRegistration)
    }

    if (req.body.staffRegistration) {
      req.body.staffRegistration = JSON.parse(req.body.staffRegistration)
    }

    if (req.body.isFirstTime) {
      req.body.isFirstTime = JSON.parse(req.body.isFirstTime)
    }

    if (req.body.createdLocation) {
      const createdLocation = JSON.parse(req.body.createdLocation)
      req.body.createdLocation = createdLocation
    }

    if (req.body.levels) {
      const levels: SchoolLevels[] = JSON.parse(req.body.levels)
      const institutions = levels.map((item) => item.institution)
      req.body.institutions = institutions
      req.body.levels = levels
    }

    if (req.body.academicSession) {
      req.body.academicSession = JSON.parse(req.body.academicSession)
    }

    if (req.body.grading) {
      req.body.grading = JSON.parse(req.body.grading)
    }

    if (req.files?.length || req.file) {
      const uploadedFiles = await uploadFilesToS3(req)
      uploadedFiles.forEach((file) => {
        req.body[file.fieldName] = file.s3Url
      })
    }

    if (req.body.officeId) {
      await Office.findOneAndUpdate({ officeId: req.body.officeId }, req.body, {
        upsert: true,
      })
    } else {
      await Office.create(req.body)
    }

    const school = await School.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    const pendingOffice = {
      name: school.name,
      officeId: school._id.toString(),
      type: 'School',
      username: school.username,
    }

    const bioUserState = await BioUserState.findOneAndUpdate(
      {
        bioUserId: req.body.bioUserId,
      },
      { processingOffice: true, pendingOffice: pendingOffice },
      { upsert: true, new: true }
    )

    if (
      school.institutions.includes('Nursery') ||
      school.institutions.includes('Primary') ||
      school.institutions.includes('Secondary') ||
      school.levels.map((item) => item.levelName.includes('Nursery')) ||
      school.levels.map((item) => item.levelName.includes('Primary')) ||
      school.levels.map((item) => item.levelName.includes('Secondary'))
    ) {
      if (req.body.positions) {
        const positions = JSON.parse(req.body.positions)
        updatePosition(school, positions)
      }
    }

    if (req.body.isFirstTime) {
      const bioUser = await BioUser.findById(req.body.bioUserId)
      const newNotification = await sendPersonalNotification(
        'school_creation',
        {
          senderUsername: 'Schooling',
          receiverUsername: bioUser.bioUserUsername,
          senderName: 'Schooling Social',
          receiverName: bioUser.bioUserDisplayName,
          senderPicture: 'active-icon.png',
          receiverPicture: bioUser.bioUserPicture,
        }
      )

      io.emit(`notification_${bioUser?.bioUserUsername}`, {
        ...newNotification,
        bioUserState,
      })
    }

    res.status(200).json({
      data: school,
      bioUserState: req.body.bioUserId ? bioUserState : null,
      message: school.isApplied
        ? `Update on your school ${pendingOffice.name} is on review and you will be notified once approved.`
        : 'The school is updated successfully.',
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const recordAll = async (req: Request, res: Response) => {
  try {
    const response = await School.updateMany(
      {}, // No filter — update all documents
      { $set: { isRecorded: true } }
    )
    res.status(200).json({ response })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const deleteSchool = async (req: Request, res: Response) => {
  await deleteItem(
    req,
    res,
    School,
    ['logo', 'media', 'picture'],
    'School not found'
  )
}

export const searchSchool = (req: Request, res: Response) => {
  search(School, req, res)
}

export const searchSchools = async (req: Request, res: Response) => {
  try {
    const name = req.query.name as string
    const skip = parseInt(req.query.page as string) || 1
    const limit = parseInt(req.query.page_size as string) || 10

    const schools = await School.aggregate([
      {
        $group: {
          _id: name ? `$${name}` : '$name',
          place: { $first: '$$ROOT' },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $replaceRoot: { newRoot: '$place' },
      },
    ])

    res.status(200).json({
      results: schools,
    })
  } catch (error) {
    console.error('Error fetching unique places:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export const updateLevels = async (req: Request, res: Response) => {
  try {
    const items = await School.find()
    for (let i = 0; i < items.length; i++) {
      const el = items[i]
      if (
        el.levelNames.length === 0 ||
        el.levelNames[i] === null ||
        el.levelNames === null ||
        el.levelNames === undefined
      ) {
        // const levels: IAcademicLevel[] = JSON.parse(el.levels)
        // const arr = []
        // for (let x = 0; x < levels.length; x++) {
        //   const elm = levels[x]
        //   arr.push(elm.levelName)
        // }
        // await School.findByIdAndUpdate(el._id, { levelNames: arr })
      }
    }
    return res.status(200).json({ message: 'Schools updated successfully.' })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updatePosition = async (
  school: ISchool,
  positions: ISchoolPosition[]
) => {
  if (positions.length > 0) {
    for (let i = 0; i < positions.length; i++) {
      const el = positions[i]
      await SchoolPosition.findByIdAndUpdate(
        { _id: el._id },
        { positionDivisions: el.positionDivisions }
      )
    }
  } else {
    const oldPositions = await SchoolPosition.find({
      officeUsername: school.username,
    })
    if (oldPositions.length === 0) {
      for (let i = 0; i < school.levels.length; i++) {
        const level = school.levels[i]
        for (let x = 0; x < level.maxLevel; x++) {
          await SchoolPosition.findOneAndUpdate(
            {
              officeUsername: school.username,
              positionName: level.levelName,
              positionsIndex: x,
            },
            {
              officeName: school.name,
              officeUsername: school.username,
              positionName: level.levelName,
              positionsIndex: Number(x),
              positionDivisions: [{ arm: 'A', isChecked: false }],
            },
            { upsert: true }
          )
        }
      }
    }
  }
}
