import mongoose, { Schema } from 'mongoose'

export interface IBioUserState extends Document {
  activeOffice: { name: string; officeId: string; officeType: string }
  pendingOffice: { name: string; officeId: string; officeType: string }
  bioUserUsername: string
  bioUserId: string
  createdAt: Date
  examAttempts: number
  isAccountOpen: boolean
  isAccountSet: boolean
  isBio: boolean
  isContact: boolean
  isDocument: boolean
  isEducation: boolean
  isEducationDocument: boolean
  isEducationHistory: boolean
  isOnVerification: boolean
  isOrigin: boolean
  isPublic: boolean
  isRelated: boolean
  isVerified: boolean
  numberOfOffices: number
  offices: [{ name: string; officeId: string; officeType: string }]
  processingOffice: boolean
  verifyingAt: Date
  verifiedAt: Date
}

const BioUserStateSchema: Schema = new Schema(
  {
    activeOffice: { type: Object, default: {} },
    pendingOffice: { type: Object, default: {} },
    bioUserUsername: { type: String, default: '' },
    bioUserId: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    examAttempts: { type: Number, default: 0 },
    isAccountOpen: { type: Boolean, default: false },
    isAccountSet: { type: Boolean, default: false },
    isBio: { type: Boolean, default: false },
    isContact: { type: Boolean, default: false },
    isDocument: { type: Boolean, default: false },
    isEducation: { type: Boolean, default: false },
    isEducationDocument: { type: Boolean, default: false },
    isEducationHistory: { type: Boolean, default: false },
    hasPastSchool: { type: Boolean, default: false },
    processingOffice: { type: Boolean, default: false },
    isOnVerification: { type: Boolean, default: false },
    isOrigin: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false },
    isRelated: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    numberOfOffices: { type: Number, default: 0 },
    offices: { type: Array, default: [] },
    verifyingAt: { type: Date, default: null },
    verifiedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export const BioUserState = mongoose.model<IBioUserState>(
  'BioUserState',
  BioUserStateSchema
)
