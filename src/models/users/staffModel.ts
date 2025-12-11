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
    email: { type: String },
    firstName: { type: String },
    middleName: { type: String },
    lastName: { type: String },
    phone: { type: String },
    picture: { type: String },
    role: { type: String },
    positions: { type: Array },
    salary: { type: Number, default: 10000 },
    level: { type: Number, default: 1 },
    bioUserUsername: { type: String },
    bioUserDisplayName: { type: String },
    residentArea: { type: String },
    residentState: { type: String },
    residentCountry: { type: String },
    residentContinent: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export const Staff = mongoose.model<IStaff>('Staff', StaffSchema)
