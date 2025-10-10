import mongoose, { Schema } from 'mongoose'

export interface IBioUserBank extends Document {
  accountName: string
  accountNumber: string
  bankCountry: string
  bankId: string
  bankName: string
  bankLogo: string
  bankUsername: string
  bioUserDisplayName: string
  bioUserId: string
  bioUserIntro: string
  bioUserMedia: string
  bioUserPicture: string
  bioUserUsername: string
  bvn: string
  createdAt: Date
}

const BioUserBankSchema: Schema = new Schema(
  {
    bankAccountName: { type: String, default: '' },
    bankAccountNumber: { type: String, default: '' },
    bankId: { type: String, default: '' },
    bankName: { type: String, default: '' },
    bankLogo: { type: String, default: '' },
    bankUsername: { type: String, default: '' },
    bankCountry: { type: String, default: '' },
    bioUserId: { type: String, default: '' },
    bioUserUsername: { type: String, default: '' },
    isAccountSet: { type: Boolean, default: false },
    isBankApplied: { type: Boolean, default: false },
    isBankOpen: { type: Boolean, default: false },
    bvn: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export const BioUserBank = mongoose.model<IBioUserBank>(
  'BioUserBank',
  BioUserBankSchema
)
