import mongoose, { Schema } from 'mongoose'

export interface IUserStat extends Document {
  online: boolean
  userId: string
  bioUserId: string
  country: string
  countryCode: string
  ips: string[]
  username: string
  visitedAt: Date
}

const UserStatusSchema: Schema = new Schema(
  {
    country: { type: String },
    countryCode: { type: String },
    ip: { type: String },
    username: { type: String },
    bioUserId: { type: String },
    pathname: { type: String },
    online: { type: Boolean, default: false },
    leftAt: { type: Date },
    visitedAt: { type: Date },
  },
  {
    timestamps: true,
  }
)

export const UserStatus = mongoose.model<IUserStat>(
  'UserStatus',
  UserStatusSchema
)
