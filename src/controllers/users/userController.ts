import { Request, Response } from 'express'
import { IUser, IUserInfo } from '../../utils/userInterface'
import { User, UserSettings } from '../../models/users/userModel'
import {
  UserInfo,
  UserSchoolInfo,
  UserFinanceInfo,
} from '../../models/users/userInfoModel'
import { Staff } from '../../models/team/staffModel'
import { handleError } from '../../utils/errorHandler'
import { queryData, search, followAccount } from '../../utils/query'
import { uploadFilesToS3 } from '../../utils/fileUpload'
import bcrypt from 'bcryptjs'
import { Follower, Post } from '../../models/users/postModel'
import { io } from '../../app'
import { sendEmail, sendNotification } from '../../utils/sendEmail'
import { AcademicLevel } from '../../models/team/academicLevelModel'
import { Department, Faculty, School } from '../../models/team/schoolModel'
import { console } from 'inspector'
import { UserTestExam } from '../../models/users/competitionModel'

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, signupIp, password, operatingSystem } = req.body

    const userBio = new UserInfo({ email, signupIp, operatingSystem })
    await userBio.save()
    await UserSchoolInfo.create({ userId: userBio._id })
    await UserFinanceInfo.create({ userId: userBio._id })

    const newUser = new User({
      userId: userBio._id,
      email,
      signupIp,
      password: await bcrypt.hash(password, 10),
    })

    await newUser.save()
    await UserInfo.updateOne(
      { _id: userBio._id },
      {
        $push: {
          userAccounts: {
            _id: newUser._id,
            email: newUser.email,
            username: newUser.username,
            displayName: newUser.displayName,
            phone: newUser.phone,
            picture: newUser.picture,
            following: 0,
            followers: 0,
            posts: 0,
          },
        },
      }
    )
    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    })
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const getAUser = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = await User.findOne({ username: req.params.username })
    const followerId = req.query.userId
    const follow = await Follower.findOne({
      userId: user?._id,
      followerId: followerId,
    })

    if (user) {
      const followedUser = {
        ...user.toObject(),
        isFollowed: !!follow,
      }
      res.status(200).json(followedUser)
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getUserSettings = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    let user = await UserSettings.findOne({ userId: req.params.id })

    if (!user) {
      user = await UserSettings.create({ userId: req.params.id })
    }

    return res.status(200).json(user)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IUser>(User, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const uploadedFiles = await uploadFilesToS3(req)
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url
    })

    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    await UserInfo.findByIdAndUpdate(user.userId, req.body, {
      new: true,
      runValidators: true,
    })

    if (req.body.picture) {
      await Post.updateMany(
        { userId: req.params.id },
        { picture: req.body.picture }
      )
    }

    if (req.body.isStaff) {
      const staff = await Staff.findOne({ userId: req.params.id })
      if (staff) {
        await Staff.findOneAndUpdate({ userId: req.body.id }, req.body)
      } else {
        await Staff.create(req.body)
      }
      const result = await queryData<IUser>(User, req)
      const { page, page_size, count, results } = result
      res.status(200).json({
        message: 'User was updated successfully',
        results,
        count,
        page,
        page_size,
      })
    } else if (req.body.media || req.body.picture || req.body.intro) {
      res.status(200).json({
        message: 'Your profile was updated successfully',
        data: user,
      })
    }
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateUserSettings = async (req: Request, res: Response) => {
  try {
    const user = await UserSettings.findOneAndUpdate(
      { userId: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
        upsert: true,
      }
    )

    res.status(200).json({
      message: 'Your profile settings was updated successfully',
      data: user,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateInfo = async (req: Request, res: Response) => {
  try {
    const uploadedFiles = await uploadFilesToS3(req)
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url
    })

    const userInfo = await UserInfo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    const user = await User.findOneAndUpdate(
      { userId: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )

    res.status(200).json({
      message: 'Your profile was updated successfully',
      data: user,
      userInfo: userInfo,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({ message: 'User deleted successfully' })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

//-----------------INFO--------------------//
export const updateUserInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  switch (req.body.action) {
    case 'Contact':
      const result = await UserInfo.findOne({ phone: req.body.phone })
      if (result) {
        res.status(400).json({
          message: `Sorry a user with this phone number: ${result.phone} already exist`,
        })
      } else {
        update(req, res)
      }
      break
    case 'Public':
      req.body.isPublic = true
      const uploadedProfileFiles = await uploadFilesToS3(req)
      uploadedProfileFiles.forEach((file) => {
        req.body[file.fieldName] = file.s3Url
      })
      update(req, res)
      break
    case 'Education':
      if (req.body.isNew) {
        const result = await School.findOne({
          isNew: true,
          name: req.body.currentSchoolName,
        })
        const level = await AcademicLevel.findOne({
          country: req.body.currentSchoolCountry,
          levelName: req.body.currentAcademicLevelName,
        })
        const form = {
          institutions: [level?.institution],
          levels: [level],
          name: req.body.currentSchoolName,
          area: req.body.currentSchoolArea,
          state: req.body.currentSchoolState,
          country: req.body.currentSchoolCountry,
          countrySymbol: req.body.currentSchoolCountrySymbol,
          continent: req.body.currentSchoolContinent,
          isNew: true,
        }

        if (!result) {
          const school = await School.create(form)
          if (
            !req.body.currentAcademicLevelName.includes('Primary') &&
            !req.body.currentAcademicLevelName.includes('Secondary') &&
            req.body.inSchool === 'Yes'
          ) {
            const facultyForm = {
              schoolId: school._id,
              school: school.name,
              name: req.body.currentFaculty,
              isNew: true,
            }
            const faculty = await Faculty.create(facultyForm)

            const departmentForm = {
              facultyId: faculty._id,
              faculty: faculty.name,
              name: req.body.currentDepartment,
              isNew: true,
            }
            await Department.create(departmentForm)
          }
          const newSchools = await School.countDocuments({ isNew: true })
          io.emit('team', { action: 'new', type: 'school', newSchools })
        } else {
          await School.findByIdAndUpdate(level?._id, form)
        }
      }
      req.body.currentAcademicLevel = JSON.parse(req.body.currentAcademicLevel)
      req.body.inSchool = req.body.inSchool === 'Yes' ? true : false
      update(req, res)
      break
    case 'EducationHistory':
      req.body.pastSchools = JSON.parse(req.body.pastSchools)
      const pasts = req.body.pastSchools
      for (let i = 0; i < pasts.length; i++) {
        const el = pasts[i]
        const result = await School.findOne({
          isNew: true,
          name: el.schoolName,
        })
        const level = await AcademicLevel.findOne({
          country: el.schoolCountry,
          level: el.academicLevel,
        })
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

        if (el.isNew && !result) {
          await School.create(form)
          const newSchools = await School.countDocuments({ isNew: true })
          io.emit('team', { action: 'new', type: 'school', newSchools })
        } else if (el.isNew && result) {
          await School.findByIdAndUpdate(level?._id, form)
        }
      }
      update(req, res)
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
      // req.body.pastSchools = JSON.stringify(pastSchools);
      update(req, res)
      break
    case 'Profile':
      const uploadedProfileFiles1 = await uploadFilesToS3(req)
      uploadedProfileFiles1.forEach((file) => {
        req.body[file.fieldName] = file.s3Url
      })
      update(req, res)
      break
    case 'Document':
      const user = await UserInfo.findById(req.params.id)
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
          await UserInfo.updateOne(
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
          await UserInfo.updateOne(
            { _id: req.params.id },
            { documents: documents },
            {
              new: true,
              upsert: true,
            }
          )
        }
      }
      update(req, res)
      break
    default:
      update(req, res)
      break
  }
}

export const updateUserSchoolInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (req.body.action === 'Education') {
      if (req.body.isNew) {
        const result = await School.findOne({
          isNew: true,
          name: req.body.currentSchoolName,
        })
        const level = await AcademicLevel.findOne({
          country: req.body.currentSchoolCountry,
          levelName: req.body.currentAcademicLevelName,
        })
        const form = {
          institutions: [level?.institution],
          levels: [level],
          name: req.body.currentSchoolName,
          area: req.body.currentSchoolArea,
          state: req.body.currentSchoolState,
          country: req.body.currentSchoolCountry,
          countrySymbol: req.body.currentSchoolCountrySymbol,
          continent: req.body.currentSchoolContinent,
          isNew: true,
        }

        if (!result) {
          const school = await School.create(form)
          if (
            !req.body.currentAcademicLevelName.includes('Primary') &&
            !req.body.currentAcademicLevelName.includes('Secondary') &&
            req.body.inSchool === 'Yes'
          ) {
            const facultyForm = {
              schoolId: school._id,
              school: school.name,
              name: req.body.currentFaculty,
              isNew: true,
            }
            const faculty = await Faculty.create(facultyForm)

            const departmentForm = {
              facultyId: faculty._id,
              faculty: faculty.name,
              name: req.body.currentDepartment,
              isNew: true,
            }
            await Department.create(departmentForm)
          }
          const newSchools = await School.countDocuments({ isNew: true })
          io.emit('team', { action: 'new', type: 'school', newSchools })
        } else {
          await School.findByIdAndUpdate(level?._id, form)
        }
      }
      req.body.currentAcademicLevel = JSON.parse(req.body.currentAcademicLevel)
      req.body.inSchool = req.body.inSchool === 'Yes' ? true : false
    } else if (req.body.action === 'EducationHistory') {
      req.body.pastSchools = JSON.parse(req.body.pastSchools)
      const pasts = req.body.pastSchools
      for (let i = 0; i < pasts.length; i++) {
        const el = pasts[i]
        const result = await School.findOne({
          isNew: true,
          name: el.schoolName,
        })
        const level = await AcademicLevel.findOne({
          country: el.schoolCountry,
          level: el.academicLevel,
        })
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

        if (el.isNew && !result) {
          await School.create(form)
          const newSchools = await School.countDocuments({ isNew: true })
          io.emit('team', { action: 'new', type: 'school', newSchools })
        } else if (el.isNew && result) {
          await School.findByIdAndUpdate(level?._id, form)
        }
      }
    } else if (req.body.action === 'EducationDocument') {
      const pastSchools = JSON.parse(req.body.pastSchools)
      const uploadedFiles = await uploadFilesToS3(req)
      uploadedFiles.forEach((file) => {
        req.body[file.fieldName] = file.s3Url
      })
      pastSchools[req.body.number].schoolCertificate = req.body.certificate
      pastSchools[req.body.number].schoolTempCertificate = undefined
      req.body.pastSchools = pastSchools
    }

    const userInfo = await UserSchoolInfo.findOneAndUpdate(
      { userId: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )

    const user = await User.findOneAndUpdate(
      { userId: req.params.id },
      req.body.isPublic ? { isPublic: true } : req.body,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!user) {
      res.status(400).json({
        message: 'Sorry, user not found to update',
      })
      return
    }

    const newUser = await getUser(user, req.params.id)

    res.status(200).json({
      message: 'Your education profile was updated successfully',
      user: newUser,
      userInfo: userInfo,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateUserInfoApp = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (req.body.isDocument) {
      const user = await UserInfo.findById(req.params.id)
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
          await UserInfo.updateOne(
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
          await UserInfo.updateOne(
            { _id: req.params.id },
            { documents: documents },
            {
              new: true,
              upsert: true,
            }
          )
        }
      }
    } else if (req.body.isBio || req.body.isPublic) {
      const uploadedFiles = await uploadFilesToS3(req)
      uploadedFiles.forEach((file) => {
        req.body[file.fieldName] = file.s3Url
      })
    }

    if (req.body.isPublic) {
      const userInfo = await UserSchoolInfo.findOneAndUpdate(
        { userId: req.params.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      )
    }

    const userInfo = await UserInfo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    const user = await User.findOneAndUpdate(
      { userId: req.params.id },
      req.body.isPublic ? { isPublic: true } : req.body,
      {
        new: true,
        runValidators: true,
      }
    )

    if (!user) {
      res.status(400).json({
        message: 'Sorry, user not found to update',
      })
      return
    }

    const newUser = await getUser(user, req.params.id)

    res.status(200).json({
      message: 'Your profile was updated successfully',
      user: newUser,
      userInfo: userInfo,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const userInfo = await UserInfo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })

    const updateData = req.body.isPublic ? { isPublic: true } : req.body

    const user = await User.findByIdAndUpdate(req.body.ID, updateData, {
      new: true,
      runValidators: false,
    })

    const schoolInfo = await UserSchoolInfo.findOneAndUpdate(
      { userId: req.params.id },
      req.body,
      {
        new: true,
      }
    )

    await UserFinanceInfo.findOneAndUpdate(
      { userId: req.params.id },
      req.body,
      {
        new: true,
      }
    )

    if (
      user &&
      user.isBio &&
      user.isContact &&
      user.isDocument &&
      user.isOrigin &&
      user.isEducation &&
      user.isEducationHistory &&
      user.isPublic &&
      user.isEducationDocument &&
      !user.isOnVerification &&
      user.isRelated &&
      !user.isVerified
    ) {
      await User.findByIdAndUpdate(req.body.ID, {
        isOnVerification: true,
        verifyingAt: new Date(),
      })
      await UserInfo.findByIdAndUpdate(req.params.id, {
        isOnVerification: true,
        verifyingAt: new Date(),
      })
      const newNotification = await sendNotification(
        'verification_processing',
        {
          username: String(user?.username),
          receiverUsername: String(user.username),
          userId: user._id,
          from: user._id,
        }
      )
      const verifyingUsers = await User.countDocuments({
        isOnVerification: true,
      })
      io.emit(String(user?.username), newNotification)
      io.emit('team', { action: 'verifying', type: 'stat', verifyingUsers })
    }

    res.status(200).json({
      schoolInfo,
      userInfo,
      user,
      results: req.body.pastSchool,
      message: 'your account is updated  successfully',
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateUserAccountInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await UserFinanceInfo.findOneAndUpdate(
      { userId: req.params.id },
      req.body,
      {
        new: true,
      }
    )
    await User.findOneAndUpdate(
      { userId: req.params.id },
      { isAccountSet: true },
      {
        new: true,
      }
    )
    res.status(200).json(user)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getUserAccountInfo = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = await UserFinanceInfo.findOne({ userId: req.params.id })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(user)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getUserSchoolInfo = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = await UserSchoolInfo.findOne({ userId: req.params.id })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json(user)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getUserInfo = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    if (req.query.school) {
      const user = await UserSchoolInfo.findOne({ userId: req.params.id })
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.status(200).json(user)
    } else {
      const user = await UserInfo.findById(req.params.id)
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
      res.status(200).json(user)
    }
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getUserDetails = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = await UserInfo.findOne({ username: req.params.username })
    res.status(200).json(user)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getManyUserDetails = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const results = await queryData<IUserInfo>(UserInfo, req)
    res.status(200).json(results)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getExistingUsername = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user =
      (await UserInfo.findOne({ username: req.params.username })) ||
      (await User.findOne({ username: req.params.username }))

    res.status(200).json(user)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const searchUserInfo = (req: Request, res: Response) => {
  return search(UserSchoolInfo, req, res)
}

export const searchAccounts = (req: Request, res: Response) => {
  return search(User, req, res)
}

export const updateUserVerification = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (req.body.action === 'bio') {
      req.body.isBio = false
    } else if (req.body.action === 'ori') {
      req.body.isOrigin = false
    } else if (req.body.action === 'cont') {
      req.body.isContact = false
    } else if (req.body.action === 'rel') {
      req.body.isRelated = false
    } else if (req.body.action === 'doc') {
      req.body.isDocument = false
    } else if (req.body.action === 'edu') {
      req.body.isEducation = false
    } else if (req.body.action === 'pas') {
      req.body.isEducationHistory = false
    }

    if (req.body.status === 'Approved') {
      req.body.isOnVerification = false
      req.body.isVerified = true
      req.body.displayName = `${req.body.lastName?.[0]?.toUpperCase()}. ${req.body.middleName?.[0]?.toUpperCase()}. ${
        req.body.firstName
      }`
    }

    const oldUser = await User.findOne({ email: req.body.email })

    const userInfo = await UserInfo.findOneAndUpdate(
      { username: req.params.username },
      req.body,
      {
        new: true,
      }
    )
    await UserSchoolInfo.findOneAndUpdate(
      { username: req.params.username },
      req.body,
      {
        new: true,
      }
    )

    await Post.updateMany(
      { userId: oldUser?._id },
      { isVerified: req.body.isVerified }
    )

    delete req.body.displayName

    const user = await User.findByIdAndUpdate(oldUser?._id, req.body, {
      new: true,
      runValidators: false,
    })

    if (req.body.status === 'Rejected') {
      const newNotification = await sendNotification('verification_fail', {
        username: String(user?.username),
        receiverUsername: String(user?.username),
        userId: String(user?._id),
        from: String(user?._id),
      })

      io.emit(req.body.id, newNotification)
    } else {
      const newNotification = await sendNotification(
        'verification_successful',
        {
          username: String(user?.username),
          receiverUsername: String(user?.username),
          userId: String(user?._id),
          from: String(user?._id),
        }
      )

      const notificationData = { ...newNotification, user }
      io.emit(String(userInfo?.username), notificationData)
    }

    await UserTestExam.findOneAndUpdate(
      { userId: userInfo?._id },
      {
        username: userInfo?.username,
        picture: userInfo?.picture,
        displayName: userInfo?.displayName,
      }
    )

    res.status(200).json({
      userInfo,
      user,
      results: req.body.pastSchool,
      message:
        'The verification status has been sent to the user successfully.',
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}
//-----------------FOLLOW USER--------------------//
export const followUserAccount = async (req: Request, res: Response) => {
  try {
    const { follow } = await followAccount(req, res)
    let isFollowed = req.body.isFollowed
    let followers = await Follower.countDocuments({ userId: req.params.id })

    isFollowed = follow ? false : true

    res.status(200).json({
      isFollowed: isFollowed,
      followers: followers,
      id: req.params.id,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

const getUser = async (user: IUser, id: string) => {
  if (
    user &&
    user.isBio &&
    user.isContact &&
    user.isDocument &&
    user.isOrigin &&
    user.isEducation &&
    user.isEducationHistory &&
    user.isPublic &&
    user.isEducationDocument &&
    !user.isOnVerification &&
    user.isRelated &&
    !user.isVerified
  ) {
    await User.findByIdAndUpdate(user._id, {
      isOnVerification: true,
      verifyingAt: new Date(),
    })
    await UserInfo.findByIdAndUpdate(id, {
      isOnVerification: true,
      verifyingAt: new Date(),
    })
    const newNotification = await sendNotification('verification_processing', {
      username: String(user?.username),
      receiverUsername: String(user.username),
      userId: user._id,
      from: user._id,
    })
    const verifyingUsers = await User.countDocuments({
      isOnVerification: true,
    })
    io.emit(String(user?._id), newNotification)
    io.emit('team', { action: 'verifying', type: 'stat', verifyingUsers })
  }

  const newUser = await User.findById(user._id)
  console.log(newUser)
  return newUser
}
