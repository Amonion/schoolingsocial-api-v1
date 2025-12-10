import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import { queryData, search } from '../../utils/query'
import { uploadFilesToS3 } from '../../utils/fileUpload'
import { sendEmail } from '../../utils/sendEmail'
import { BioUser } from '../../models/users/bioUser'
import { IStaff, Staff } from '../../models/users/staffModel'

export const makeStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await BioUser.findById(req.params.d)
    const userObj = user.toObject()
    const { _id, __v, ...safeData } = userObj
    const staff = await Staff.create(safeData)
    await sendEmail('', req.body.email, 'welcome')
    res.status(200).json({
      staff,
      message: 'User created successfully',
    })
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const removeStaff = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await BioUser.findById(req.params.d)
    const userObj = user.toObject()
    const { _id, __v, ...safeData } = userObj
    const staff = await Staff.create(safeData)
    await sendEmail('', req.body.email, 'welcome')
    res.status(200).json({
      staff,
      message: 'User created successfully',
    })
  } catch (error: any) {
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

    const user = await Staff.findOneAndUpdate(
      { username: req.params.username },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    )
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({
      message: 'The staff profile was updated successfully',
      data: user,
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
