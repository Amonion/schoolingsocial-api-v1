import { NotificationTemplate } from '../models/message/notificationTemplateModel'
import { OfficialMessage } from '../models/message/officialMessageModel'
import { PersonalMessage } from '../models/message/personalMessageModel'

interface MessageData {
  senderUsername: string
  receiverUsername: string
  senderPicture: string
  receiverPicture: string
  senderName: string
  receiverName: string
  greetings: string
  unread: boolean
  templateId?: string
  content?: string
  senderAddress?: string
  senderArea?: string
  senderState?: string
  senderCountry?: string
  receiverAddress?: string
  receiverArea?: string
  receiverState?: string
  receiverCountry?: string
  title?: string
  type?: string
}

export const sendOfficialMessage = async (data: MessageData) => {
  const message = await OfficialMessage.create(data)

  const senderCount = await OfficialMessage.countDocuments({
    receiverUsername: data.senderUsername,
    unread: true,
  })

  const receiverCount = await OfficialMessage.countDocuments({
    receiverUsername: data.receiverUsername,
    unread: true,
  })

  return { officialMessage: message, receiverCount, senderCount }
}

export const sendOfficialMessageById = async (data: MessageData) => {
  const notificationTemp = await NotificationTemplate.findById(data.templateId)

  if (!notificationTemp) {
    throw new Error(`Notification template not found.`)
  }

  const message = await OfficialMessage.create({
    greetings: notificationTemp.greetings,
    name: notificationTemp.name,
    title: notificationTemp.title,
    senderUsername: data.senderUsername,
    receiverUsername: data.receiverUsername,
    senderName: data.senderName,
    receiverName: data.receiverName,
    senderPicture: data.senderPicture,
    receiverPicture: data.senderPicture,
    senderAddress: data.senderAddress,
    senderArea: data.senderArea,
    senderState: data.senderState,
    senderCountry: data.senderCountry,
    receiverAddress: data.receiverAddress,
    receiverArea: data.receiverArea,
    receiverState: data.receiverState,
    receiverCountry: data.receiverCountry,
    unread: true,
    content: notificationTemp.content,
  })

  const senderCount = await OfficialMessage.countDocuments({
    senderUsername: data.senderUsername,
    unread: true,
  })

  const receiverCount = await OfficialMessage.countDocuments({
    receiverUsername: data.receiverUsername,
    unread: true,
  })

  return { officialMessage: message, receiverCount, senderCount }
}

export const sendPersonalMessage = async (data: MessageData) => {
  const message = await PersonalMessage.create({
    type: data.type,
    title: data.title,
    senderUsername: data.senderUsername,
    receiverUsername: data.receiverUsername,
    senderName: data.senderName,
    receiverName: data.receiverName,
    senderPicture: data.senderPicture,
    receiverPicture: data.senderPicture,
    senderAddress: data.senderAddress,
    senderArea: data.senderArea,
    senderState: data.senderState,
    senderCountry: data.senderCountry,
    receiverAddress: data.receiverAddress,
    receiverArea: data.receiverArea,
    receiverState: data.receiverState,
    receiverCountry: data.receiverCountry,
    unread: true,
    content: data.content,
  })

  const senderCount = await PersonalMessage.countDocuments({
    senderUsername: data.senderUsername,
    unread: true,
  })

  const receiverCount = await PersonalMessage.countDocuments({
    receiverUsername: data.receiverUsername,
    unread: true,
  })

  return { personalMessage: message, receiverCount, senderCount }
}
