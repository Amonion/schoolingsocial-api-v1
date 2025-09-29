import mongoose, { Schema } from 'mongoose'
import { IAcademicLevel } from '../school/academicLevelModel'

const BioUserSchoolInfoSchema: Schema = new Schema(
  {
    admittedAt: { type: Date },
    bioUserDisplayName: { type: String },
    bioUserIntro: { type: String },
    bioUserMedia: { type: String },
    bioUserPicture: { type: String },
    bioUserUsername: { type: String },
    bioUserId: { type: String },
    createdAt: { type: Date, default: Date.now },
    graduatedAt: { type: Date },
    inSchool: { type: Boolean },
    hasPastSchool: { type: Boolean },
    isAdvanced: { type: Boolean },
    isSchoolVerified: { type: Boolean },
    isVerified: { type: Boolean },
    schoolAcademicLevel: { type: Object },
    schoolArea: { type: String },
    schoolArm: { type: String },
    schoolCertificate: { type: String },
    schoolClass: { type: String },
    schoolClassLevel: { type: String },
    schoolContinent: { type: String },
    schoolCountry: { type: String },
    schoolCountryFlag: { type: String },
    schoolCountrySymbol: { type: String },
    schoolDepartment: { type: String },
    schoolDepartmentId: { type: String },
    schoolDepartmentUsername: { type: String },
    schoolFaculty: { type: String },
    schoolFacultyId: { type: String },
    schoolFacultyUsername: { type: String },
    schoolId: { type: String },
    schoolLogo: { type: String },
    schoolName: { type: String },
    schoolPicture: { type: String },
    schoolPlaceId: { type: String },
    schoolState: { type: String },
    schoolUsername: { type: String },
    schoolYear: { type: String },
    pastSchools: { type: Array, default: [] },
  },
  {
    timestamps: true,
  }
)

export const BioUserSchoolInfo = mongoose.model<IBioUserSchoolInfo>(
  'BioUserSchoolInfo',
  BioUserSchoolInfoSchema
)

export interface IBioUserSchoolInfo extends Document {
  _id: string
  admittedAt: Date
  bioUserDisplayName: string
  bioUserIntro: string
  bioUserMedia: string
  bioUserPicture: string
  bioUserUsername: string
  bioUserId: string
  createdAt: Date
  graduatedAt: Date
  inSchool: boolean
  isSchoolVerified: boolean
  isVerified: boolean
  schoolAcademicLevel: IAcademicLevel
  schoolArea: string
  schoolArm: string
  schoolClass: string
  schoolClassLevel: string
  schoolContinent: string
  schoolCountry: string
  schoolCountryFlag: string
  schoolCountrySymbol: string
  schoolDepartment: string
  schoolDepartmentId: string
  schoolDepartmentUsername: string
  schoolFaculty: string
  schoolFacultyId: string
  schoolFacultyUsername: string
  schoolId: string
  schoolLogo: string
  schoolName: string
  schoolPicture: string
  schoolPlaceId: string
  schoolState: string
  schoolUsername: string
  schoolYear: string
  pastSchools: IBioUserSchoolInfo[]
}
