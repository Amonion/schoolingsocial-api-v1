import mongoose, { Schema } from 'mongoose'

export interface IUserWallet extends Document {
  balance: number
  bioUserId: string
  country: string
  countryFlag: string
  countrySymbol: string
  currency: string
  currencySymbol: string
  createdAt: Date
  picture: string
  received: number
  spent: number
  username: string
  userId: string
}

const UserWalletSchema: Schema = new Schema(
  {
    balance: { type: Number, default: 0 },
    bioUserId: { type: String, default: '' },
    country: { type: String, default: '' },
    countryFlag: { type: String, default: '' },
    countrySymbol: { type: String, default: '' },
    currency: { type: String, default: '' },
    currencySymbol: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    picture: { type: String, default: '' },
    received: { type: Number, default: 0 },
    spent: { type: Number, default: 0 },
    username: { type: String },
    userId: { type: String },
  },
  {
    timestamps: true,
  }
)
export const UserWallet = mongoose.model<IUserWallet>(
  'UserWallet',
  UserWalletSchema
)
