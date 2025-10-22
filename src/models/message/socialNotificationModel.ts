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
    content: { type: String },
    title: { type: String },
    name: { type: String },
    senderUsername: { type: String },
    receiverUsername: { type: String },
    senderName: { type: String },
    receiverName: { type: String },
    senderPicture: { type: String },
    receiverPicture: { type: String },
    greetings: { type: String },
    type: { type: String },
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
