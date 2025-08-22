import mongoose, { Schema } from 'mongoose'
import { IPayment, ITransaction } from '../../utils/teamInterface'

const PaymentSchema: Schema = new Schema(
  {
    amount: { type: Number, default: 0.0 },
    charge: { type: Number, default: 0.0 },
    logo: { type: String },
    name: { type: String, default: '' },
    title: { type: String, default: '' },
    durationName: { type: String, default: '' },
    duration: { type: Number, default: 0 },
    country: { type: String, default: '' },
    placeId: { type: String, default: '' },
    countryFlag: { type: String, default: '' },
    description: { type: String, default: '' },
    countrySymbol: { type: String, default: '' },
    currency: { type: String, default: '' },
    currencySymbol: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema)

const TransactionSchema: Schema = new Schema(
  {
    amount: { type: Number, default: 0.0 },
    charge: { type: Number, default: 0.0 },
    logo: { type: String },
    username: { type: String, default: '' },
    status: { type: Boolean, default: false },
    received: { type: Boolean, default: false },
    email: { type: String, default: '' },
    picture: { type: String, default: '' },
    name: { type: String, default: '' },
    reference: { type: String, default: '' },
    title: { type: String, default: '' },
    country: { type: String, default: '' },
    countryFlag: { type: String, default: '' },
    description: { type: String, default: '' },
    countrySymbol: { type: String, default: '' },
    currency: { type: String, default: '' },
    currencySymbol: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export const Transaction = mongoose.model<ITransaction>(
  'Transaction',
  TransactionSchema
)
