import mongoose, { Schema } from 'mongoose'

export interface IOffice extends Document {
  admittedAt: Date
  country: string
  bioUserId: string
  bioUserPicture: string
  state: string
  address: string
  area: string
  name: string
  graduatedAt: Date
  username: string
  positions: []
  schoolLevel: number
  schoolLevelName: string
  classLevel: string
  bioUserIntro: string
  bioUserUsername: string
  type: string
  userType: string
  officeId: string
  logo: string
  media: string
  arm: string
  continent: string
  createdLocation: object
  isUserApplied: boolean
  isApplied: boolean
  isApproved: boolean
  isActiveOffice: boolean
  isUserActive: boolean
}

const OfficeSchema: Schema = new Schema(
  {
    admittedAt: { type: Date },
    graduatedAt: { type: Date },
    logo: { type: String },
    bioUserUsername: { type: String },
    bioUserDisplayName: { type: String },
    bioUserId: { type: String },
    createdLocation: { type: Object, default: {} },
    name: { type: String },
    type: { type: String },
    userType: { type: String },
    officeId: { type: String },
    username: { type: String },
    position: { type: String },
    positions: { type: Array, default: [] },
    level: { type: Number, default: 0 },
    schoolLevel: { type: Number, default: 0 },
    schoolLevelName: { type: String },
    classLevel: { type: Number, default: 0 },
    email: { type: String },
    address: { type: String },
    area: { type: String },
    arm: { type: String },
    state: { type: String },
    country: { type: String },
    continent: { type: String },
    media: { type: String },
    bioUserIntro: { type: String },
    bioUserPicture: { type: String },
    isApplied: { type: Boolean },
    isApproved: { type: Boolean },
    isActiveOffice: { type: Boolean },
    isUserActive: { type: Boolean },
    isUserApplied: { type: Boolean },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Office = mongoose.model<IOffice>('Office', OfficeSchema)

export interface ISchoolPosition extends Document {
  _id: string
  officeUsername: string
  officeName: string
  positionsIndex: number
  positionName: string
  positionDivisions: string[]
}

const SchoolPositionSchema: Schema = new Schema(
  {
    officeUsername: { type: String, default: '' },
    officeName: { type: String, default: '' },
    positionsIndex: { type: Number, default: 1 },
    positionName: { type: String, default: '' },
    positionDivisions: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
)

export const SchoolPosition = mongoose.model<ISchoolPosition>(
  'SchoolPosition',
  SchoolPositionSchema
)
