import mongoose, { Schema } from 'mongoose'

export interface IStudent extends Document {
  activeSchools: []
  pastSchools: []
  level: number
  levelName: string
  classLevel: number
  bioUserDisplayName: string
  bioUserIntro: string
  bioUserId: string
  bioUserMedia: string
  bioUserPicture: string
  bioUserUsername: string
}

const StudentSchema: Schema = new Schema(
  {
    school: { type: String, default: '' },
    schoolId: { type: String, default: '' },
    level: { type: Number, default: '' },
    levelName: { type: String, default: '' },
    arm: { type: String },
    classLevel: { type: Number },
    bioUserDisplayName: { type: String, default: '' },
    bioUserIntro: { type: String, default: '' },
    bioUserId: { type: String, default: '' },
    bioUserMedia: { type: String, default: '' },
    bioUserPicture: { type: String, default: '' },
    bioUserUsername: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: false },
    graduated: { type: Boolean, default: false },
    left: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
)
export const Student = mongoose.model<IStudent>('Student', StudentSchema)
