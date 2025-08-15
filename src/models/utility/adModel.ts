import mongoose, { Schema } from 'mongoose'
import { IAd } from '../../utils/userInterface'

const AdSchema: Schema = new Schema(
  {
    displayName: { type: String },
    description: { type: String },
    duration: { type: Number, default: 0 },
    media: { type: Array, default: [] },
    tags: { type: Array, default: [] },
    states: { type: Array, default: [] },
    countries: { type: Array, default: [] },
    areas: { type: Array, default: [] },
    price: { type: Number, default: 0 },
    picture: { type: String, default: '' },
    area: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    category: { type: String, default: '' },
    username: { type: String, default: '' },
    status: { type: String, default: 'Draft' },
    user: { type: String, default: '' },
    userId: { type: String, default: '' },
    email: { type: String, default: '' },
    distribution: { type: String, default: '' },
    period: { type: String, default: '' },
    currency: { type: String, default: '' },
    currencyName: { type: String, default: '' },
    currencySymbol: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Ad = mongoose.model<IAd>('Ad', AdSchema)
