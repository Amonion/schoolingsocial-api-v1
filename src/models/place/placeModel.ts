import mongoose, { Schema } from 'mongoose'
import { IAdCategory, IBank, IDocument } from '../../utils/teamInterface'

export interface IPlace extends Document {
  continent: string
  country: string
  countryCapital: string
  state: string
  area: string
  landmark: string
  zipCode: string
  countryCode: string
  countryFlag: string
  stateCapital: string
  stateLogo: string
  countrySymbol: string
  currency: string
  currencySymbol: string
  createdAt: Date
}

const PlaceSchema: Schema = new Schema(
  {
    landmark: { type: String, default: '' },
    area: { type: String },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    countryCapital: { type: String, default: '' },
    stateCapital: { type: String, default: '' },
    stateLogo: { type: String, default: '' },
    continent: { type: String, default: '' },
    countryFlag: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    countryCode: { type: String, default: '' },
    countrySymbol: { type: String, default: '' },
    currency: { type: String, default: '' },
    currencySymbol: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Place = mongoose.model<IPlace>('Place', PlaceSchema)

const AdCategorySchema: Schema = new Schema(
  {
    category: { type: String, default: '' },
    picture: { type: String, default: '' },
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    price: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    postNumber: { type: Number, default: 0 },
    continent: { type: String, default: '' },
    country: { type: String, default: '' },
    currency: { type: String, default: '' },
    currencySymbol: { type: String, default: '' },
    countrySymbol: { type: String, default: '' },
    placeId: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const AdCategory = mongoose.model<IAdCategory>(
  'AdCategory',
  AdCategorySchema
)

const BankSchema: Schema = new Schema(
  {
    category: { type: String, default: '' },
    picture: { type: String, default: '' },
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    username: { type: String, default: '' },
    continent: { type: String, default: '' },
    country: { type: String, default: '' },
    countryFlag: { type: String, default: '' },
    placeId: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Bank = mongoose.model<IBank>('Bank', BankSchema)

const DocumentSchema: Schema = new Schema(
  {
    name: { type: String, default: '' },
    picture: { type: String, default: '' },
    required: { type: Boolean, default: false },
    country: { type: String, default: '' },
    placeId: { type: String, default: '' },
    countryFlag: { type: String, default: '' },
    description: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export const Document = mongoose.model<IDocument>('Document', DocumentSchema)
