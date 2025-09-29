import mongoose, { Schema } from 'mongoose'
import { IFaculty } from '../../utils/teamInterface'

const FacultySchema: Schema = new Schema(
  {
    schoolId: { type: String },
    school: { type: String },
    schoolUsername: { type: String },
    name: { type: String, default: '' },
    username: { type: String, default: '' },
    picture: { type: String, default: '' },
    media: { type: String, default: '' },
    description: { type: String, default: '' },
    isNew: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Faculty = mongoose.model<IFaculty>('Faculty', FacultySchema)
