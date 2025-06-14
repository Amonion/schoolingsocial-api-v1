import { Request, Response } from 'express'
import { IUserNotification } from '../../utils/userInterface'
import { User } from '../../models/users/userModel'
import { UserInfo } from '../../models/users/userInfoModel'
import { handleError } from '../../utils/errorHandler'
import { queryData } from '../../utils/query'
import bcrypt from 'bcryptjs'
import { UserNotification } from '../../models/team/emailModel'

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, phone, signupIp, password } = req.body

    const userBio = new UserInfo({ email, phone, signupIp })
    await userBio.save()

    const newUser = new User({
      userId: userBio._id,
      email,
      phone,
      signupIp,
      password: await bcrypt.hash(password, 10),
    })
    await newUser.save()

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
    })
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const usernames = String(req.query.usernames || '').split(',')
    const result = await queryData<IUserNotification>(UserNotification, req)
    const unread = await UserNotification.countDocuments({
      username: { $in: usernames },
      unread: true,
    })
    res.status(200).json({
      page: result.page,
      page_size: result.page_size,
      results: result.results,
      count: result.count,
      unread: unread,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateNotification = async (req: Request, res: Response) => {
  try {
    const notifications: IUserNotification[] = JSON.parse(
      req.body.notifications
    )
    const ids = notifications.map((doc) => doc._id)

    await UserNotification.updateMany(
      { _id: { $in: ids } },
      { $set: { unread: false } }
    )

    const updatedNotifications = await UserNotification.find({
      _id: { $in: ids },
    })

    const unread = await UserNotification.countDocuments({
      username: req.params.username,
      unread: true,
    })

    res.status(200).json({
      results: updatedNotifications,
      uread: unread,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const readNotifications = async (req: Request, res: Response) => {
  try {
    const ids = JSON.parse(req.body.ids)
    const usernames = String(req.query.usernames || '').split(',')

    await UserNotification.updateMany(
      { _id: { $in: ids } },
      { $set: { unread: false } }
    )

    const unread = await UserNotification.countDocuments({
      username: { $in: usernames },
      unread: true,
    })

    res.status(200).json({
      results: ids,
      uread: unread,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}
