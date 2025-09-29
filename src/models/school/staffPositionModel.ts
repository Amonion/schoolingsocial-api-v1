import mongoose, { Schema } from 'mongoose'

export interface IStaffPosition extends Document {
  _id: string
  officeUsername: string
  officeName: string
  bioUserUsername: string
  bioUserDisplayName: string
  bioUserPicture: string
  level: number
  levelName: string
  arm: string
}

const StaffPositionSchema: Schema = new Schema(
  {
    officeUsername: { type: String, default: '' },
    bioUserUsername: { type: String, default: '' },
    bioUserPicture: { type: String, default: '' },
    bioUserDisplayName: { type: String, default: '' },
    officeName: { type: String, default: '' },
    level: { type: Number, default: 1 },
    levelName: { type: String, default: '' },
    arm: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
)

export const StaffPosition = mongoose.model<IStaffPosition>(
  'StaffPosition',
  StaffPositionSchema
)
