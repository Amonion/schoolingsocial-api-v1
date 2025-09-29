import mongoose, { Schema } from 'mongoose'
import { IAcademicLevel } from './academicLevelModel'

export interface ISchool extends Document {
  country: string
  userId: string
  bioUserId: string
  state: string
  area: string
  name: string
  levels: IAcademicLevel[]
  institutions: string[]
  grading: object
  levelNames: []
  username: string
  bioUserUsername: string
  type: string
  logo: string
  media: string
  description: string
  address: string
  email: string
  phone: string
  academicSession: object
  picture: string
  continent: string
  landmark: string
  countryFlag: string
  countrySymbol: string
  officeId: string
  placeId: string
  longitude: number
  latitude: number
  isApplied: boolean
  isVerified: boolean
  isNew: boolean
  isRecorded: boolean
}

const SchoolSchema: Schema = new Schema(
  {
    resultPointSystem: { type: Number, default: 0.0 },
    document: { type: String },
    idCard: { type: String },
    logo: { type: String },
    levels: { type: Array },
    institutions: { type: Array, default: [] },
    grading: {
      type: Array,
      default: [
        { name: 'A', min: 70, max: 100, remark: 'Excelent' },
        { name: 'B', min: 60, max: 69.99, remark: 'Very Good' },
      ],
    },
    bioUserUsername: { type: String, default: '' },
    bioUserId: { type: String, default: '' },
    userId: { type: String, default: '' },
    createdLocation: { type: Object, default: {} },
    lng: { type: Number },
    lat: { type: Number },
    academicSession: { type: Object, default: {} },
    name: { type: String, default: '' },
    username: { type: String, default: '' },
    area: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    countrySymbol: { type: String, default: '' },
    reasone: { type: String, default: '' },
    continent: { type: String, default: '' },
    placeId: { type: String, default: '' },
    studentRegistration: { type: Boolean, default: false },
    staffRegistration: { type: Boolean, default: false },
    countryFlag: { type: String, default: '' },
    description: { type: String, default: '' },
    media: { type: String, default: '' },
    address: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    picture: { type: String, default: '' },
    officeId: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    isApplied: { type: Boolean, default: false },
    isRecorded: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const School = mongoose.model<ISchool>('School', SchoolSchema)
