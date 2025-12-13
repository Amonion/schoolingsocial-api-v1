import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import { queryData, search } from '../../utils/query'
import { uploadFilesToS3 } from '../../utils/fileUpload'
import { sendEmail } from '../../utils/sendEmail'
import { BioUser } from '../../models/users/bioUser'
import { IStaff, Staff } from '../../models/users/staffModel'
import { User } from '../../models/users/user'

export const makeUserStaff = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    for (let i = 0; i < req.body.usersIds.length; i++) {
      const id = req.body.usersIds[i]
      const bioUser = await BioUser.findById(id)
      if (bioUser) {
        await Staff.findOneAndUpdate(
          { bioUserId: id },
          {
            firstName: bioUser.firstName,
            bioUserId: id,
            middleName: bioUser.middleName,
            lastName: bioUser.lastName,
            bioUserUsername: bioUser.bioUserUsername,
            bioUserDisplayName: bioUser.bioUserDisplayName,
            picture: bioUser.bioUserPicture,
          },
          { upsert: true }
        )
        await User.updateMany(
          { bioUserId: id },
          {
            status: 'Staff',
          },
          {
            runValidators: false,
          }
        )
      }
    }

    res.status(200).json({
      message: 'The users have been successfully made staffs.',
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const makeStaffUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    for (let i = 0; i < req.body.usersIds.length; i++) {
      const id = req.body.usersIds[i]
      await Staff.findOneAndUpdate(
        { bioUserId: id },
        {
          isActive: false,
        }
      )
      await User.updateMany(
        { bioUserId: id },
        {
          status: 'User',
        },
        {
          runValidators: false,
        }
      )
    }
    const result = await queryData<IStaff>(Staff, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getAStaff = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = await Staff.findOne({ username: req.params.username })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({ data: user })
  } catch (error) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}

export const updateStaff = async (req: Request, res: Response) => {
  try {
    const uploadedFiles = await uploadFilesToS3(req)
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url
    })

    await Staff.findByIdAndUpdate(req.params.id, req.body)
    const result = await queryData<IStaff>(Staff, req)
    res.status(200).json({
      count: result.count,
      results: result.results,
      message: 'The staff profile was updated successfully',
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const searchStaff = (req: Request, res: Response) => {
  return search(Staff, req, res)
}

export const getStaffs = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IStaff>(Staff, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}
