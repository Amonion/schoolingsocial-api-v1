import mongoose, { Schema } from 'mongoose'

export interface ISocialNotification extends Document {
  content: string
  greetings: string
  title: string
  type: string
  name: string
  unread: boolean
  senderUsername: string
  receiverUsername: string
  senderName: string
  receiverName: string
  senderPicture: string
  receiverPicture: string
  createdAt: Date
}

const SocialNotificationSchema: Schema = new Schema(
  {
    content: { type: String, default: '' },
    title: { type: String },
    senderUsername: { type: String, default: '' },
    receiverUsername: { type: String, default: '' },
    senderName: { type: String, default: '' },
    receiverName: { type: String, default: '' },
    senderPicture: { type: String, default: '' },
    receiverPicture: { type: String, default: '' },
    greetings: { type: String, default: '' },
    type: { type: String, default: '' },
    unread: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const SocialNotification = mongoose.model<ISocialNotification>(
  'SocialNotification',
  SocialNotificationSchema
)
