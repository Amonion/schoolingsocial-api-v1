import mongoose, { Schema } from 'mongoose'
import { IWallet } from '../../utils/userInterface'

const WalletSchema: Schema = new Schema(
  {
    username: { type: String },
    userId: { type: String },
    bioId: { type: String, default: '' },
    picture: { type: String, default: '' },
    balance: { type: Number, default: 0 },
    spent: { type: Number, default: 0 },
    received: { type: Number, default: 0 },

    country: { type: String, default: '' },
    countryFlag: { type: String, default: '' },
    countrySymbol: { type: String, default: '' },
    currency: { type: String, default: '' },
    currencySymbol: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Wallet = mongoose.model<IWallet>('Wallet', WalletSchema)
