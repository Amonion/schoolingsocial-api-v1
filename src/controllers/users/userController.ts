import { Request, Response } from 'express'
import { IUserInfo } from '../../utils/userInterface'
import {
  UserInfo,
  UserSchoolInfo,
  UserFinanceInfo,
} from '../../models/users/userInfoModel'
import { handleError } from '../../utils/errorHandler'
import { queryData, search, followAccount } from '../../utils/query'
import { uploadFilesToS3 } from '../../utils/fileUpload'
import bcrypt from 'bcryptjs'
import { Poll, Post } from '../../models/post/postModel'
import { sendEmail } from '../../utils/sendEmail'
import { UserStatus } from '../../models/users/usersStatMode'
import { Bookmark, Like, Repost, View } from '../../models/users/statModel'
import { Place } from '../../models/place/placeModel'
import { Wallet } from '../../models/users/walletModel'
import { BioUser } from '../../models/users/bioUser'
import { BioUserSchoolInfo } from '../../models/users/bioUserSchoolInfo'
import { BioUserSettings } from '../../models/users/bioUserSettings'
import { BioUserState } from '../../models/users/bioUserState'
import { DeletedUser, IUser, User } from '../../models/users/user'
import { UserSettings } from '../../models/users/userSettings'
import { Chat } from '../../models/message/chatModel'
import { BioUserBank } from '../../models/users/bioUserBank'
import { SocialNotification } from '../../models/message/socialNotificationModel'
import { Interest } from '../../models/post/interestModel'
import { Follower, Mute, Pin } from '../../models/post/postStateModel'
import { getFilteredPosts } from '../post/postController'
import { getFeaturedNews } from '../news/newsController'

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Run once to remove trailing/leading spaces in all documents
    // await Place.updateMany({}, [
    //   { $set: { country: { $trim: { input: '$country' } } } },
    // ])
    const signupCountry = (req as any).country
    const signupIp = (req as any).ipAddress
    const bioUser = new BioUser({ ...req.body, signupCountry, signupIp })
    await bioUser.save()

    await BioUserSchoolInfo.create({ bioUserId: bioUser._id })
    await BioUserSettings.create({ bioUserId: bioUser._id })
    await BioUserState.create({ bioUserId: bioUser._id })
    await BioUserBank.create({
      bioUserId: bioUser._id,
      bankCountry: signupCountry,
    })

    const place = await Place.findOne({
      country: new RegExp(`^${signupCountry.trim()}\\s*$`, 'i'),
    })

    const newUser = new User({
      bioUserId: bioUser._id,
      email: req.body.email,
      signupIp,
      lat: req.body.lat,
      lng: req.body.lng,
      signupCountry: place?.country.trim(),
      signupCountryFlag: place?.countryFlag.trim(),
      signupCountrySymbol: place?.countrySymbol.trim(),
      password: await bcrypt.hash(req.body.password, 10),
    })
    await newUser.save()
    await Interest.create({ userId: newUser._id, countries: [signupCountry] })

    // await Wallet.create({
    //   userId: newUser._id,
    //   bioUserId: bioUser._id,
    //   country: place?.country.trim(),
    //   countryFlag: place?.countryFlag,
    //   countrySymbol: place?.countrySymbol.trim(),
    //   currency: place?.currency.trim(),
    //   currencySymbol: place?.currencySymbol.trim(),
    // })

    await sendEmail('', req.body.email, 'welcome')
    res.status(200).json({
      message: 'User created successfully',
    })
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const createUserAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const uploadedFiles = await uploadFilesToS3(req)
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url
    })
    const { username, displayName, picture, userId, country, state } = req.body

    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        picture: picture,
        displayName: displayName,
        isFirstTime: false,
        username: username,
        country: country,
        state: state,
      },
      { new: true }
    )

    if (!user) {
      throw new Error('User not found')
    }

    const news = await getFeaturedNews(user.country, user.state)

    const postResult = await getFilteredPosts({
      topics: [],
      countries: [country],
      page: 1,
      limit: 20,
      followerId: user._id,
      source: 'post',
    })

    res.status(200).json({
      message: 'Account created successfully',
      user,
      posts: postResult.results,
      featuredNews: news,
    })
  } catch (error: any) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}

export const getAUser = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = await User.findOne({ username: req.params.username })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    const followerId = req.query.userId
    const follow = await Follower.findOne({
      userId: user?._id,
      followerId: followerId,
    })
    const followedUser = {
      ...user.toObject(),
      isFollowed: !!follow,
    }
    res.status(200).json({ data: followedUser })
  } catch (error) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const uploadedFiles = await uploadFilesToS3(req)
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url
    })

    const user = await User.findOneAndUpdate(
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

    if (req.body.picture) {
      await Post.updateMany({ userId: user._id }, { picture: req.body.picture })
      await Chat.updateMany({ userId: user._id }, { picture: req.body.picture })
    }

    res.status(200).json({
      message: 'Your profile was updated successfully',
      data: user,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateUserSettings = async (req: Request, res: Response) => {
  try {
    const userSettings = JSON.parse(req.body.userSettingsForm)
    const user = await UserSettings.findOneAndUpdate(
      { userId: req.params.id },
      userSettings,
      {
        new: true,
        runValidators: true,
        upsert: true,
      }
    )

    res.status(200).json({
      message: 'Your settings was updated successfully',
      data: user,
    })
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

    return res.status(200).json({ data: user })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const searchAccounts = (req: Request, res: Response) => {
  return search(User, req, res)
}

///////////// NEW CONTROLLERS //////////////

export const deleteMyData = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = await User.findById(req.params.id)
    await DeletedUser.create({
      email: user?.email,
      username: user?.username,
      displayName: user?.displayName,
      picture: user?.picture,
      bioUserId: user?.bioUserId,
    })
    await Bookmark.deleteMany({ userId: req.params.id })
    await Follower.deleteMany({ userId: req.params.id })
    await Like.deleteMany({ userId: req.params.id })
    await Mute.deleteMany({ userId: req.params.id })
    await Pin.deleteMany({ userId: req.params.id })
    await Poll.deleteMany({ userId: req.params.id })
    await Post.deleteMany({ userId: req.params.id })
    await Repost.deleteMany({ userId: req.params.id })
    await SocialNotification.deleteMany({ userId: req.params.id })
    await UserStatus.deleteMany({ bioId: user?.bioUserId })
    await View.deleteMany({ userId: req.params.id })
    await User.findByIdAndDelete(req.params.id)
    return res
      .status(200)
      .json({ message: 'Your account has been deleted successfully.' })
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
