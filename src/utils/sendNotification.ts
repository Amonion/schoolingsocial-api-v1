import { PersonalNotification } from '../models/message/personalNotificationModel'
import { NotificationTemplate } from '../models/message/notificationTemplateModel'
import { SocialNotification } from '../models/message/socialNotificationModel'

interface NotificationData {
  senderUsername: string
  receiverUsername: string
  senderPicture: string
  receiverPicture: string
  senderName: string
  receiverName: string
  content?: string
  gender?: string
  from?: string
  str1?: string
}

export const sendSocialNotification = async (
  templateName: string,
  data: NotificationData
) => {
  const notificationTemp = await NotificationTemplate.findOne({
    name: templateName,
  })

  if (!notificationTemp) {
    throw new Error(`Notification template '${templateName}' not found.`)
  }

  const click_here =
    templateName === 'friend_request'
      ? `<a href="/home/chat/${data.from}/${data.senderUsername}" class="text-[var(--custom)]">click here</a>`
      : ''

  const content = notificationTemp.content
    .replace('{{receiver_name}}', data.receiverName)
    .replace('{{receiverer_username}}', data.receiverUsername)
    .replace('{{sender_username}}', data.senderUsername)
    .replace('{{sender_name}}', data.senderName)
    .replace('{{gender}}', data.gender)
    .replace('{{school}}', data.str1)
    .replace('{{click_here}}', click_here)
    .replace('{{content}}', data.content)

  const socialNotification = await SocialNotification.create({
    greetings: notificationTemp.greetings,
    name: notificationTemp.name,
    title: notificationTemp.title,
    senderUsername: data.senderUsername,
    receiverUsername: data.receiverUsername,
    senderName: data.senderName,
    receiverName: data.receiverName,
    senderPicture: data.senderPicture,
    unread: true,
    receiverPicture: data.receiverPicture,
    content,
  })

  const unreadNotifications = await SocialNotification.countDocuments({
    receiverUsername: data.receiverUsername,
    unread: true,
  })

  return { socialNotification, unreadNotifications }
}

export const sendPersonalNotification = async (
  templateName: string,
  data: NotificationData
) => {
  const notificationTemp = await NotificationTemplate.findOne({
    name: templateName,
  })

  if (!notificationTemp) {
    throw new Error(`Notification template '${templateName}' not found.`)
  }

  const click_here =
    templateName === 'friend_request'
      ? `<a href="/home/chat/${data.from}/${data.senderUsername}" class="text-[var(--custom)]">click here</a>`
      : ''

  const content = notificationTemp.content
    .replace('{{sender_username}}', data.senderUsername)
    .replace('{{school}}', data.str1)
    .replace('{{click_here}}', click_here)

  const notification = await PersonalNotification.create({
    greetings: notificationTemp.greetings,
    name: notificationTemp.name,
    title: notificationTemp.title,
    senderUsername: data.senderUsername,
    receiverUsername: data.receiverUsername,
    senderName: data.senderName,
    receiverName: data.receiverName,
    senderPicture: data.senderPicture,
    receiverPicture: data.receiverPicture,
    content,
  })

  const count = await PersonalNotification.countDocuments({
    receiverUsername: data.receiverUsername,
    unread: true,
  })

  return { personalNotification: notification, count }
}
