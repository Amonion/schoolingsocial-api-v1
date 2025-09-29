import mongoose, { Schema } from 'mongoose'

export interface IPersonalNotification extends Document {
  _id: string
  content: string
  title: string
  senderUsername: string
  receiverUsername: string
  senderPicture: string
  receiverPicture: string
  senderName: string
  receiverName: string
  unread: boolean
  createdAt: Date
}

const PersonalNotificationSchema: Schema = new Schema(
  {
    content: { type: String, default: '' },
    unread: { type: Boolean, default: true },
    title: { type: String },
    senderUsername: { type: String, default: '' },
    receiverUsername: { type: String, default: '' },
    senderName: { type: String, default: '' },
    receiverName: { type: String, default: '' },
    senderPicture: { type: String, default: '' },
    receiverPicture: { type: String, default: '' },
    greetings: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const PersonalNotification = mongoose.model<IPersonalNotification>(
  'PersonalNotification',
  PersonalNotificationSchema
)
