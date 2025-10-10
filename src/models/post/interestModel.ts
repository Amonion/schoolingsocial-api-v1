import mongoose, { Schema } from 'mongoose'

export interface IInterest extends Document {
  userId: string
  username: string
  topics: string[]
  countries: string[]
  page: number
  limit: number
}

const InterestSchema: Schema = new Schema({
  userId: { type: String },
  username: { type: String },
  topics: { type: Array },
  countries: { type: Array },
})
export const Interest = mongoose.model<IInterest>('Interest', InterestSchema)
