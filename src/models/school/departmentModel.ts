import mongoose, { Schema } from 'mongoose'
import { ISchoolPayment, IDepartment } from '../../utils/teamInterface'

const SchoolPaymentSchema: Schema = new Schema(
  {
    amount: { type: Number, default: 0.0 },
    charge: { type: Number, default: 0.0 },
    schoolLogo: { type: String },
    school: { type: String },
    name: { type: String, default: '' },
    schoolId: { type: String, default: '' },
    currency: { type: String, default: '' },
    currencySymbol: { type: String, default: '' },
    country: { type: String, default: '' },
    countrySymbol: { type: String, default: '' },
    placeId: { type: String, default: '' },
    countryFlag: { type: String, default: '' },
    description: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export const SchoolPayment = mongoose.model<ISchoolPayment>(
  'SchoolPayment',
  SchoolPaymentSchema
)

const DepartmentSchema: Schema = new Schema(
  {
    period: { type: Number },
    schoolId: { type: String },
    school: { type: String },
    facultyId: { type: String },
    faculty: { type: String },
    facultyUsername: { type: String },
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

export const Department = mongoose.model<IDepartment>(
  'Department',
  DepartmentSchema
)
