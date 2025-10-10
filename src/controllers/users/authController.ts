import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import dotenv from 'dotenv'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../../models/users/user'
import { BioUser } from '../../models/users/bioUser'
import { BioUserState } from '../../models/users/bioUserState'
import { BioUserSettings } from '../../models/users/bioUserSettings'
import { Office } from '../../models/utility/officeModel'
import { BioUserSchoolInfo } from '../../models/users/bioUserSchoolInfo'
import { Interest } from '../../models/post/interestModel'
import { getFilteredPosts } from '../post/postController'
dotenv.config()

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email }).select('+password')
    if (!user || !user.password) {
      res
        .status(404)
        .json({ message: 'Sorry incorrect email or password, try again.' })
      return
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      res
        .status(401)
        .json({ message: 'Sorry incorrect email or password, try again.' })
      return
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || '',
      { expiresIn: '30d' }
    )

    const [
      bioUser,
      bioUserSettings,
      bioUserSchoolInfo,
      bioUserState,
      activeOffice,
      userOffices,
    ] = await Promise.all([
      BioUser.findById(user.bioUserId),
      BioUserSettings.findOne({ bioUserId: user.bioUserId }),
      BioUserSchoolInfo.findOne({ bioUserId: user.bioUserId }),
      BioUserState.findOne({ bioUserId: user.bioUserId }),
      Office.findOne({ bioUserId: user.bioUserId, isActiveOffice: true }),
      Office.find({ bioUserId: user.bioUserId, isUserActive: true }),
    ])

    const interest = await Interest.findById(user._id)
    const postResult = await getFilteredPosts({
      topics: interest ? interest.topics : [],
      countries: interest ? interest.countries : [],
      page: 1,
      limit: 20,
      followerId: user._id,
      source: 'post',
    })

    user.password = undefined

    res.status(200).json({
      message: 'Login successful',
      user,
      bioUserSettings,
      bioUser,
      bioUserState,
      bioUserSchoolInfo,
      activeOffice,
      userOffices,
      token,
      posts: postResult.results,
    })
  } catch (error: unknown) {
    handleError(res, undefined, undefined, error)
  }
}

export const getCurrentUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as {
      userId: string
      email: string
    }

    const user = await User.findById(decoded.userId).select('-password')
    if (!user) {
      res.status(404).json({ message: 'User not found' })
      return
    }

    const [
      bioUser,
      bioUserSettings,
      bioUserSchoolInfo,
      bioUserState,
      activeOffice,
      userOffices,
    ] = await Promise.all([
      BioUser.findById(user.bioUserId),
      BioUserSettings.findOne({ bioUserId: user.bioUserId }),
      BioUserSchoolInfo.findOne({ bioUserId: user.bioUserId }),
      BioUserState.findOne({ bioUserId: user.bioUserId }),
      Office.findOne({ bioUserId: user.bioUserId, isActiveOffice: true }),
      Office.find({ bioUserId: user.bioUserId, isUserActive: true }),
    ])

    res.status(200).json({
      message: 'User fetched successfully',
      user,
      bioUserSettings,
      bioUser,
      bioUserState,
      bioUserSchoolInfo,
      activeOffice,
      userOffices,
    })
  } catch (error: unknown) {
    res.status(401).json({ message: 'Unauthorized', error })
  }
}

export const getAuthUser = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || '',
      { expiresIn: '30d' }
    )
    res.status(200).json({
      message: 'Login successful',
      user: user,
      token,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const fogottenPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      res
        .status(404)
        .json({ message: 'Sorry incorrect email or password, try again.' })
      return
    }

    if (!user.password) {
      res.status(400).json({ message: 'Password not set for user' })
      return
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      res
        .status(401)
        .json({ message: 'Sorry incorrect email or password, try again.' })
      return
    }

    // const token = jwt.sign(
    //   { userId: user._id, email: user.email },
    //   JWT_SECRET,
    //   { expiresIn: "30d" }
    // );

    // res.status(200).json({
    //   message: "Login successful",
    //   user: {
    //     email: user.email,
    //     username: user.username,
    //     phone: user.phone,
    //   },
    //   token,
    // });
  } catch (error: unknown) {
    handleError(res, undefined, undefined, error)
  }
}
