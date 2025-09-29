import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import { Expo } from 'expo-server-sdk'
import { UserInfo } from '../../models/users/userInfoModel'
import {
  IPersonalNotification,
  PersonalNotification,
} from '../../models/message/personalNotificationModel'
import { NotificationTemplate } from '../../models/message/notificationTemplateModel'
import { queryData } from '../../utils/query'
import {
  ISocialNotification,
  SocialNotification,
} from '../../models/message/socialNotificationModel'
const expo = new Expo()

export const getPersonalNotifications = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IPersonalNotification>(
      PersonalNotification,
      req
    )
    const unread = await PersonalNotification.countDocuments({
      receiverUsername: req.query.receiverUsername,
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

export const getPersonalNotification = async (req: Request, res: Response) => {
  try {
    const result = await PersonalNotification.findById(req.params.id)
    res.status(200).json({ data: result })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const readPersonalNotifications = async (
  req: Request,
  res: Response
) => {
  try {
    const ids = JSON.parse(req.body.ids)
    const username = req.query.username
    await PersonalNotification.updateMany(
      { _id: { $in: ids } },
      { $set: { unread: false } }
    )

    const unread = await PersonalNotification.countDocuments({
      receiverUsername: username,
      unread: true,
    })
    res.status(200).json({
      unread: unread,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getSocialNotifications = async (req: Request, res: Response) => {
  try {
    const result = await queryData<ISocialNotification>(SocialNotification, req)
    const unreadSocials = await SocialNotification.countDocuments({
      receiverUsername: req.query.receiverUsername,
      unread: true,
    })

    res.status(200).json({
      page: result.page,
      results: result.results,
      count: result.count,
      unreadSocials,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getSocialNotification = async (req: Request, res: Response) => {
  try {
    const result = await SocialNotification.findById(req.params.id)
    res.status(200).json({ data: result })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const readSocialNotifications = async (req: Request, res: Response) => {
  try {
    const ids = JSON.parse(req.body.ids)
    const username = req.query.username
    await SocialNotification.updateMany(
      { _id: { $in: ids } },
      { $set: { unread: false } }
    )

    const unread = await SocialNotification.countDocuments({
      receiverUsername: username,
      unread: true,
    })
    res.status(200).json({
      unread: unread,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const setPushNotificationToken = async (req: Request, res: Response) => {
  const { token, id } = req.body
  if (!Expo.isExpoPushToken(token)) {
    return res.status(400).send({ error: 'Invalid Expo push token' })
  }

  try {
    await UserInfo.findByIdAndUpdate(
      id,
      { notificationToken: token },
      { new: true }
    )
    res.send({ success: true })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const sendPushNotification = async (req: Request, res: Response) => {
  const { notificationId, token } = req.body

  // const user = await UserInfo.findById(userId)
  const item = await NotificationTemplate.findById(notificationId)
  const cleanContent = item?.content?.replace(/<[^>]*>?/gm, '').trim()
  const messages = [
    {
      to: token,
      sound: 'default',
      title: item?.title,
      body: cleanContent,
      data: { type: 'notifications', screen: '/home/notifications' },
    },
  ]

  try {
    await expo.sendPushNotificationsAsync(messages)
    res.send({ success: true })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}
