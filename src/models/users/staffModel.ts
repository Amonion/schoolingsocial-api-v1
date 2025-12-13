import mongoose, { Schema } from 'mongoose'

export interface IStaff extends Document {
  bioUserId: string
  salary: number
  level: number
  bioUserUsername: string
  firstName: string
  lastName: string
  middleName: string
  picture: string
  email: string
  phone: string
  position: string
  role: string
  area: string
  state: string
  country: string
  continent: string
  isActive: boolean
  createdAt: Date
}

const StaffSchema: Schema = new Schema(
  {
    bioUserId: { type: String },
    email: { type: String },
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    picture: { type: String },
    role: { type: String },
    position: { type: String },
    duties: { type: String },
    salary: { type: Number, default: 10000 },
    level: { type: Number, default: 1 },
    bioUserUsername: { type: String },
    bioUserDisplayName: { type: String },
    area: { type: String },
    state: { type: String },
    country: { type: String },
    continent: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export const Staff = mongoose.model<IStaff>('Staff', StaffSchema)
