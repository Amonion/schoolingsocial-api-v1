import mongoose, { Schema } from 'mongoose'

export interface IAcademicLevel extends Document {
  country: string
  countryFlag: string
  placeId: string
  level: number
  maxLevel: number
  levelName: string
  section: string
  subsection: string
  institution: string
  certificate: string
  certificateName: string
  inSchool: boolean
  description: string
  createdAt: Date
}

const AcademicLevelSchema: Schema = new Schema(
  {
    certificate: { type: String, default: '' },
    certificateName: { type: String, default: '' },
    level: { type: Number, default: 0 },
    maxLevel: { type: Number, default: 0 },
    maxLevelName: { type: String, default: '' },
    levelName: { type: String, default: '' },
    institution: { type: String, default: '' },
    section: { type: String, default: '' },
    subsection: { type: String, default: '' },
    country: { type: String, default: '' },
    placeId: { type: String, default: '' },
    countryFlag: { type: String, default: '' },
    description: { type: String, default: '' },
    inSchool: { type: Boolean, default: false },
    isCurriculum: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export const AcademicLevel = mongoose.model<IAcademicLevel>(
  'AcademicLevel',
  AcademicLevelSchema
)

export interface IStaffSubject extends Document {
  officeUsername: string
  subject: string
  level: number
  levelName: string
  bioUserUsername: string
  staffPicture: string
  arm: string
  createdAt: Date
}

const StaffSubjectSchema: Schema = new Schema(
  {
    officeUsername: { type: String, default: '' },
    name: { type: String, default: '' },
    level: { type: Number, default: 0 },
    levelName: { type: String, default: '' },
    bioUserUsername: { type: String, default: '' },
    bioUserDisplayName: { type: String, default: '' },
    staffPicture: { type: String, default: '' },
    description: { type: String, default: '' },
    curriculumTitle: { type: String, default: '' },
    schemeOfWork: { type: String, default: '' },
    subjectCode: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export const StaffSubject = mongoose.model<IStaffSubject>(
  'StaffSubject',
  StaffSubjectSchema
)

export interface IActivity extends Document {
  _id: string
  title: string
  content: string
  country: string
  picture: string
  officeUsername: string
  startingDate: Date
  endingDate: Date
}
const ActivitySchema: Schema = new Schema(
  {
    country: { type: String, default: '' },
    officeUsername: { type: String, default: '' },
    state: { type: String, default: '' },
    levelName: { type: String, default: '' },
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    picture: { type: String, default: '' },
    isHoliday: { type: Boolean, default: false },
    startingDate: { type: Date },
    endingDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export const Activity = mongoose.model<IActivity>('Activity', ActivitySchema)
