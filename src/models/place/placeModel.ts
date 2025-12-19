import mongoose, { Schema } from 'mongoose'
import { IAdCategory, IBank } from '../../utils/teamInterface'

export interface IDocument extends Document {
  picture: string
  name: string
  description: string
  country: string
  countryFlag: string
  placeId: string
  required: boolean
  createdAt: Date
}

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
    landmark: { type: String },
    area: { type: String },
    state: { type: String },
    country: { type: String },
    countryCapital: { type: String },
    stateCapital: { type: String },
    stateLogo: { type: String },
    continent: { type: String },
    countryFlag: { type: String },
    zipCode: { type: String },
    countryCode: { type: String },
    countrySymbol: { type: String },
    currency: { type: String },
    currencySymbol: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Place = mongoose.model<IPlace>('Place', PlaceSchema)

const AdCategorySchema: Schema = new Schema(
  {
    category: { type: String },
    picture: { type: String },
    name: { type: String },
    description: { type: String },
    price: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    postNumber: { type: Number, default: 0 },
    continent: { type: String },
    country: { type: String },
    currency: { type: String },
    currencySymbol: { type: String },
    countrySymbol: { type: String },
    placeId: { type: String },
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
    category: { type: String },
    picture: { type: String },
    name: { type: String },
    description: { type: String },
    username: { type: String },
    continent: { type: String },
    country: { type: String },
    countryFlag: { type: String },
    placeId: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Bank = mongoose.model<IBank>('Bank', BankSchema)

const DocumentSchema: Schema = new Schema(
  {
    name: { type: String },
    picture: { type: String },
    required: { type: Boolean, default: false },
    country: { type: String },
    placeId: { type: String },
    countryFlag: { type: String },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export const Document = mongoose.model<IDocument>('Document', DocumentSchema)
