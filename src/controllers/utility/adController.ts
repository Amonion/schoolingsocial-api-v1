import { Request, Response } from 'express'
import sizeOf from 'image-size'
import { handleError } from '../../utils/errorHandler'
import { uploadFilesToS3 } from '../../utils/fileUpload'
import { Ad } from '../../models/utility/adModel'
import { User } from '../../models/users/userModel'
import bcrypt from 'bcryptjs'

export const updateAd = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.body.target) {
      req.body.tags = JSON.parse(req.body.tags)
      req.body.states = JSON.parse(req.body.states)
      req.body.areas = JSON.parse(req.body.areas)
      req.body.countries = JSON.parse(req.body.countries)
    }
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      message: 'Ad was updated successfully',
      data: ad,
    })
  } catch (error: any) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}

export const createAd = async (req: Request, res: Response): Promise<void> => {
  try {
    const uploadedFiles = await uploadFilesToS3(req)
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url
    })

    // req.body.userStatus = 'ad'
    // req.body.password = await bcrypt.hash('ad', 10)
    // await User.create(req.body, {
    //   new: true,
    //   runValidators: true,
    // })
    const newUser = new User({
      userStatus: 'ad',
      email: `${req.body.username}@smail.com`,
      username: req.body.username,
      password: await bcrypt.hash('password', 10),
    })

    await newUser.save()

    req.body.media = JSON.parse(req.body.media)
    const ad = await Ad.create(req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      message: 'Ad is created successfully',
      data: ad,
    })
  } catch (error: any) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}

export const getAd = async (req: Request, res: Response): Promise<void> => {
  try {
    const ad = await Ad.findById(req.params.id)

    res.status(200).json({
      message: 'Post stats retrieved successfully',
      data: ad,
    })
  } catch (error: any) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}

export const getDraftAd = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ad = await Ad.findOne({ user: req.query.username, status: 'Draft' })
    res.status(200).json({
      data: ad,
    })
  } catch (error: any) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}
