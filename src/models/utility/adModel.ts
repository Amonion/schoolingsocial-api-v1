import mongoose, { Schema } from 'mongoose'
import { IAd } from '../../utils/userInterface'

const AdSchema: Schema = new Schema(
  {
    displayName: { type: String },
    description: { type: String },
    durationName: { type: String },
    quantity: { type: Number, default: 1 },
    duration: { type: Number, default: 0 },
    charge: { type: Number, default: 0 },
    media: { type: Array, default: [] },
    tags: { type: Array, default: [] },
    states: { type: Array, default: [] },
    countries: { type: Array, default: [] },
    areas: { type: Array, default: [] },
    amount: { type: Number, default: 0 },
    picture: { type: String, default: '' },
    area: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    category: { type: String, default: '' },
    username: { type: String, default: '' },
    status: { type: Boolean, default: false },
    isEditing: { type: Boolean, default: false },
    onReview: { type: Boolean, default: false },
    online: { type: Boolean, default: false },
    immediately: { type: Boolean, default: true },
    approved: { type: Boolean, default: false },
    user: { type: String, default: '' },
    userId: { type: String, default: '' },
    email: { type: String, default: '' },
    distribution: { type: String, default: '' },
    period: { type: String, default: '' },
    currency: { type: String, default: '' },
    currencyName: { type: String, default: '' },
    currencySymbol: { type: String, default: '' },
    publishedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Ad = mongoose.model<IAd>('Ad', AdSchema)
