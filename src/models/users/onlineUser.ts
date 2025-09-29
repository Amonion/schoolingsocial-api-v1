import mongoose, { Schema } from 'mongoose'

export interface IOnlineUser extends Document {
  country: string
  ips: []
  username: string
  bioUserId: string
  online: boolean
  leftAt: Date
  visitedAt: Date
  createdAt: Date
}

const OnlineUserSchema: Schema = new Schema(
  {
    country: { type: String },
    ips: { type: Array, default: [] },
    username: { type: String },
    bioUserId: { type: String },
    online: { type: Boolean, default: false },
    leftAt: { type: Date, default: Date.now },
    visitedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const OnlineUser = mongoose.model<IOnlineUser>(
  'OnlineUser',
  OnlineUserSchema
)
