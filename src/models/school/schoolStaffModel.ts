import mongoose, { Schema } from 'mongoose'

export interface ISchoolStaff extends Document {
  level: number
  bioUserId: string
  bioUserPicture: string
  bioUserUsername: string
  position: string
  school: string
  schoolId: string
  schoolUsername: string
}

const SchoolStaffSchema: Schema = new Schema(
  {
    level: { type: Number },
    bioUserId: { type: String, default: '' },
    bioUserPicture: { type: String, default: '' },
    bioUserUsername: { type: String, default: '' },
    position: { type: String, default: '' },
    school: { type: String, default: '' },
    schoolId: { type: String, default: '' },
    schoolUsername: { type: String, default: '' },
    type: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const SchoolStaff = mongoose.model<ISchoolStaff>(
  'SchoolStaff',
  SchoolStaffSchema
)
