import { Request, Response } from 'express'
import { BioUser, IBioUser } from '../../models/users/bioUser'
import { uploadFilesToS3 } from '../../utils/fileUpload'
import { io } from '../../app'
import { BioUserState, IBioUserState } from '../../models/users/bioUserState'
import { handleError } from '../../utils/errorHandler'
import { School } from '../../models/school/schoolModel'
import { BioUserSchoolInfo } from '../../models/users/bioUserSchoolInfo'
import { AcademicLevel } from '../../models/school/academicLevelModel'
import { BioUserSettings } from '../../models/users/bioUserSettings'
import { BioUserBank } from '../../models/users/bioUserBank'
import { queryData, search } from '../../utils/query'
import { Faculty } from '../../models/school/facultyModel'
import { Department } from '../../models/school/departmentModel'
import { User } from '../../models/users/user'
import { Post } from '../../models/post/postModel'
import { sendPersonalNotification } from '../../utils/sendNotification'
import { Place } from '../../models/team/placeModel'
import { Office } from '../../models/utility/officeModel'

export const updateBioUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  switch (req.body.action) {
    case 'Contact':
      const result = await BioUser.findOne({ phone: req.body.phone })
      if (result) {
        res.status(400).json({
          message: `Sorry a user with this phone number: ${result.phone} already exist`,
        })
      } else {
        updateBio(req, res)
      }
      break
    case 'Public':
      req.body.isPublic = true
      const uploadedProfileFiles = await uploadFilesToS3(req)
      uploadedProfileFiles.forEach((file) => {
        req.body[file.fieldName] = file.s3Url
      })
      req.body.verificationLocation = JSON.parse(req.body.location)
      updateBio(req, res)
      break
    case 'Bio':
      const uploadedProfileFiles1 = await uploadFilesToS3(req)
      uploadedProfileFiles1.forEach((file) => {
        req.body[file.fieldName] = file.s3Url
      })
      const firstName =
        req.body.firstName.charAt(0).toUpperCase() +
        req.body.firstName.slice(1).toLowerCase()
      const bioUserDisplayName = `${req.body.lastName?.[0].toUpperCase()}. ${req.body.middleName?.[0].toUpperCase()}. ${firstName}`
      req.body.bioUserDisplayName = bioUserDisplayName
      updateBio(req, res)
      break
    case 'Document':
      const user = await BioUser.findById(req.params.id)
      const documents = user?.documents
      const id = req.body.id
      if (documents) {
        const uploadedFiles = await uploadFilesToS3(req)
        uploadedFiles.forEach((file) => {
          req.body[file.fieldName] = file.s3Url
        })
        const result = documents.find((item) => item.docId === id)
        if (result) {
          result.doc = uploadedFiles[0].s3Url
          result.name = req.body.name
          documents.map((item) => (item.docId === id ? result : item))
          await BioUser.updateOne(
            { _id: req.params.id },
            { documents: documents },
            {
              new: true,
              upsert: true,
            }
          )
        } else {
          const doc = {
            doc: uploadedFiles[0].s3Url,
            name: req.body.name,
            docId: id,
            tempDoc: '',
          }
          documents.push(doc)
          await BioUser.updateOne(
            { _id: req.params.id },
            { documents: documents },
            {
              new: true,
              upsert: true,
            }
          )
        }
      }
      updateBio(req, res)
      break
    default:
      updateBio(req, res)
      break
  }
}

export const updateBio = async (req: Request, res: Response): Promise<void> => {
  try {
    const bioUser = await BioUser.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    await BioUserSchoolInfo.findOneAndUpdate(
      { bioUserId: req.params.id },
      {
        bioUserUsername: bioUser.bioUserUsername,
        bioUserPicture: bioUser.bioUserPicture,
        bioUserMedia: bioUser.bioUserMedia,
        bioUserDisplayName: bioUser.bioUserDisplayName,
        bioUserIntro: bioUser.bioUserIntro,
      },
      {
        new: true,
        runValidators: false,
      }
    )

    await User.updateMany(
      { bioUserId: req.params.id },
      {
        bioUserUsername: bioUser.bioUserUsername,
      },
      {
        new: true,
        runValidators: false,
      }
    )

    const bioUserState = await BioUserState.findOneAndUpdate(
      { bioUserId: req.params.id },
      req.body,
      {
        new: true,
        runValidators: false,
      }
    )

    const isUserReady = await checkIsUserVerified(String(bioUser._id))

    if (
      isUserReady &&
      !bioUserState.isOnVerification &&
      !bioUserState.isVerified
    ) {
      sendVerificationProcessingNotifications(bioUser._id.toString())
      await BioUserState.findOneAndUpdate(
        { bioUserId: req.params.id },
        { isOnVerification: true },
        {
          new: true,
          runValidators: false,
        }
      )
    }

    res.status(200).json({
      bioUserState,
      bioUser,
      results: req.body.pastSchool,
      message: 'your account is updated  successfully',
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateBioUserSchool = async (
  req: Request,
  res: Response
): Promise<void> => {
  switch (req.body.action) {
    case 'Education':
      if (req.body.schoolAcademicLevel) {
        req.body.schoolAcademicLevel = JSON.parse(req.body.schoolAcademicLevel)
      }

      req.body.isEducation = true
      if (req.body.isNew && req.body.inSchool) {
        const academicLevel = JSON.parse(req.body.schoolAcademicLevel)
        const result = await School.findOne({
          isNew: true,
          name: req.body.schoolName,
        })

        const level = await AcademicLevel.findOne({
          country: req.body.schoolCountry,
          levelName: academicLevel.levelName,
        })

        const form = {
          institutions: [level?.institution],
          levels: [level],
          name: req.body.schoolName,
          area: req.body.schoolArea,
          state: req.body.schoolState,
          country: req.body.schoolCountry,
          countrySymbol: req.body.schoolCountrySymbol,
          continent: req.body.schoolContinent,
          isNew: true,
        }

        if (!result) {
          const school = await School.create(form)
          if (
            academicLevel &&
            !academicLevel.levelName.includes('Primary') &&
            !academicLevel.levelName.includes('Secondary') &&
            req.body.inSchool === 'Yes'
          ) {
            const facultyForm = {
              schoolId: school._id,
              school: school.name,
              name: req.body.schoolFaculty,
              isNew: true,
            }
            const faculty = await Faculty.create(facultyForm)

            const departmentForm = {
              facultyId: faculty._id,
              faculty: faculty.name,
              name: req.body.schoolDepartment,
              isNew: true,
            }
            await Department.create(departmentForm)
          }
          const newSchools = await School.countDocuments({ isNew: true })
          io.emit('team', { action: 'new', type: 'school', newSchools })
        } else {
          await School.findByIdAndUpdate(result?._id, form)
        }
      }
      updateBioSchool(req, res)
      break
    case 'EducationHistory':
      if (req.body.hasPastSchool) {
        req.body.pastSchools = JSON.parse(req.body.pastSchools)
        const pasts = req.body.pastSchools
        for (let i = 0; i < pasts.length; i++) {
          const el = pasts[i]
          const level = await AcademicLevel.findOne({
            country: el.schoolCountry,
            level: el.academicLevel,
          })
          if (!el.schoolUsername) {
            const form = {
              institutions: [level?.institution],
              levels: [level],
              name: el.schoolName,
              area: el.schoolArea,
              state: el.schoolState,
              country: el.schoolCountry,
              continent: el.schoolContinent,
              isNew: true,
            }
            await School.create(form)
            const newSchools = await School.countDocuments({ isNew: true })
            io.emit('team', { action: 'new', type: 'school', newSchools })
          }
        }
      }
      updateBioSchool(req, res)
      break
    case 'EducationDocument':
      const pastSchools = JSON.parse(req.body.pastSchools)
      const uploadedFiles = await uploadFilesToS3(req)
      uploadedFiles.forEach((file) => {
        req.body[file.fieldName] = file.s3Url
      })
      pastSchools[req.body.number].schoolCertificate = req.body.certificate
      pastSchools[req.body.number].schoolTempCertificate = undefined
      req.body.pastSchools = pastSchools
      req.body.isEducationDocument = true
      // req.body.pastSchools = JSON.stringify(pastSchools);
      updateBioSchool(req, res)
      break
    default:
      updateBioSchool(req, res)
      break
  }
}

export const updateBioSchool = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bioUserSchoolInfo = await BioUserSchoolInfo.findOneAndUpdate(
      { bioUserId: req.params.id },
      req.body,
      {
        new: true,
      }
    )

    const bioUserState = await BioUserState.findOneAndUpdate(
      {
        bioUserId: bioUserSchoolInfo.bioUserId,
      },
      req.body,
      {
        new: true,
      }
    )

    const isUserReady = await checkIsUserVerified(
      String(bioUserSchoolInfo.bioUserId)
    )

    if (
      isUserReady &&
      !bioUserState.isOnVerification &&
      !bioUserState.isVerified
    ) {
      sendVerificationProcessingNotifications(bioUserSchoolInfo.bioUserId)
    }

    res.status(200).json({
      bioUserState,
      bioUserSchoolInfo,
      results: req.body.pastSchool,
      message: 'your account is updated  successfully',
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateBioUserSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userSettings = JSON.parse(req.body.bioUserSettings)
    const { bioUserId, ...settings } = userSettings
    const bioUserSettings = await BioUserSettings.findOneAndUpdate(
      { bioUserId: req.params.id },
      settings,
      {
        new: true,
      }
    )
    res.status(200).json({
      bioUserSettings,
      message: 'Your settings is updated successfully',
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateBioUserBank = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bioUserBank = await BioUserBank.findOneAndUpdate(
      { bioUserId: req.params.id },
      req.body,
      {
        new: true,
      }
    )
    res.status(200).json({
      data: bioUserBank,
      message: 'Your bank details is updated successfully',
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const approveUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const verificationStatus =
      req.body.verificationStatus === 'Approved' ? true : false
    req.body.isVerified = verificationStatus
    req.body.isOnVerification = !verificationStatus
    const authorityName = req.body.authorityName
    const authorityLevel = req.body.authorityLevel
    await User.updateMany({ bioUserUsername: req.params.username }, req.body)

    const bioUser = await BioUser.findOneAndUpdate(
      { bioUserUsername: req.params.username },
      req.body,
      {
        new: true,
      }
    )

    const user = await User.findOneAndUpdate({
      bioUserId: bioUser._id,
      isVerified: true,
    })

    await Post.updateMany({ bioUserId: bioUser._id }, req.body)

    const bioUserSchoolInfo = await BioUserSchoolInfo.findOneAndUpdate(
      { bioUserUsername: req.params.username },
      req.body,
      {
        new: true,
      }
    )

    const bioUserState = await BioUserState.findOneAndUpdate(
      { bioUserUsername: req.params.username },
      req.body,
      {
        new: true,
      }
    )

    if (authorityName) {
      const country = await Place.findOne({ area: bioUser.homeArea })
      const office = await Office.findOneAndUpdate(
        { bioUserId: req.body.bioUserId, officeId: req.params.id },
        {
          $set: {
            bioUserId: bioUser._id,
            bioUserDisplayName: bioUser.bioUserDisplayName,
            bioUserIntro: bioUser.bioUserIntro,
            bioUserMedia: bioUser.bioUserMedia,
            bioUserPicture: bioUser.bioUserPicture,
            bioUserUsername: bioUser.bioUserUsername,
            userType: authorityName,
            level: authorityLevel,
            isUserApplied: true,
            name: country.country,
            username: authorityName.replace(' ', '_'),
            officeId: country._id,
            logo: country.countryFlag,
            area: country.area,
            state: country.state,
            country: country.country,
            continent: country.continent,
            type: 'Authority',
          },
        },
        { new: true, upsert: true }
      )

      const activeOffice = {
        id: office._id,
        name: office.name,
        officeId: office.officeId.toString(),
        type: office.type,
        username: office.username,
        position: authorityName,
        level: authorityLevel,
        isUserActive: true,
      }

      await BioUserState.findOneAndUpdate(
        { bioUserId: bioUser._id },
        {
          $addToSet: { offices: activeOffice },
          $set: {
            activeOffice: activeOffice,
          },
          $inc: { numberOfOffices: 1 },
        }
      )

      await BioUser.findOneAndUpdate(
        { _id: bioUser._id },
        {
          $set: {
            authorityLevel: authorityLevel,
            authorityName: authorityName,
          },
        }
      )

      io.emit(`update_state_${String(bioUser?.bioUserUsername)}`, {
        bioUserState,
      })
    }

    const newNotification = await sendPersonalNotification(
      verificationStatus ? 'verification_successful' : 'verification_failed',
      {
        senderUsername: 'Schooling',
        receiverUsername: bioUser.bioUserUsername,
        senderPicture: 'active-icon.png',
        receiverPicture: bioUser.bioUserPicture,
        senderName: 'Schooling Social',
        receiverName: bioUser.bioUserDisplayName,
      }
    )

    io.emit(`personal_notification_${String(bioUser?._id)}`, {
      ...newNotification,
      bioUser,
      bioUserSchoolInfo,
      bioUserState,
      user,
    })

    res.status(200).json({
      data: bioUser,
      bioUserSchoolInfo,
      bioUserState,
      message: 'The user has been verified successfully.',
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getBioUserBank = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bioUserBank = await BioUserBank.findOne({ bioUserId: req.params.id })
    res.status(200).json({
      data: bioUserBank,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getBioUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bioUser = await BioUser.findById(req.params.id)
    res.status(200).json({
      data: bioUser,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getBioUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await queryData<IBioUser>(BioUser, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getBioUserByUsername = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bioUser = await BioUser.findOne({
      bioUserUsername: req.params.username,
    })
    res.status(200).json({
      data: bioUser,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getBioUserSchoolByUsername = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const bioUser = await BioUserSchoolInfo.findOne({
      bioUserUsername: req.params.username,
    })
    res.status(200).json({
      data: bioUser,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getBioUsersState = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await queryData<IBioUserState>(BioUserState, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const checkIsUserVerified = async (id: string): Promise<boolean> => {
  try {
    const bioUserState = await BioUserState.findOne({ bioUserId: id })
    if (
      bioUserState &&
      bioUserState.isBio &&
      bioUserState.isContact &&
      bioUserState.isDocument &&
      bioUserState.isOrigin &&
      bioUserState.isEducation &&
      bioUserState.isEducationHistory &&
      bioUserState.isPublic &&
      bioUserState.isEducationDocument &&
      bioUserState.isRelated
    ) {
      return true
    } else {
      return false
    }
  } catch (error) {
    return false
  }
}

const sendVerificationProcessingNotifications = async (id: string) => {
  const bioUser = await BioUser.findById(id)
  await BioUserState.findOneAndUpdate(
    { bioUserId: id },
    { isOnVerification: true },
    {
      new: true,
      runValidators: false,
    }
  )

  const newNotification = await sendPersonalNotification(
    'verification_processing',
    {
      senderUsername: 'Schooling',
      receiverUsername: bioUser.bioUserUsername,
      senderPicture: 'active-icon.png',
      receiverPicture: bioUser.bioUserPicture,
      senderName: 'Schooling Social',
      receiverName: bioUser.bioUserDisplayName,
    }
  )

  const verifyingUsers = await BioUserState.countDocuments({
    isOnVerification: true,
  })
  io.emit(`personal_notification_${bioUser?._id}`, newNotification)
  io.emit('team', { action: 'verifying', type: 'stat', verifyingUsers })
}

export const searchBioUserSchoolInfo = (req: Request, res: Response) => {
  return search(BioUserSchoolInfo, req, res)
}
