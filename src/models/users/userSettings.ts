import mongoose, { Schema } from 'mongoose'

export interface IUserSettings extends Document {
  username: string
  userId: string
  friendRequest: boolean
  newMessage: boolean
  newFollower: boolean
  postReply: boolean
  sound: boolean
  createdAt: Date
}

const UserSettingsSchema: Schema = new Schema(
  {
    username: { type: String },
    userId: { type: String, default: '' },
    jobPosting: { type: Boolean, default: true },
    friendRequest: { type: Boolean, default: true },
    newMessage: { type: Boolean, default: false },
    newFollower: { type: Boolean, default: false },
    postReply: { type: Boolean, default: false },
    sound: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export const UserSettings = mongoose.model<IUserSettings>(
  'UserSettings',
  UserSettingsSchema
)
