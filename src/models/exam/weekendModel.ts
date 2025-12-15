import mongoose, { Schema } from 'mongoose'

export interface IWeekend extends Document {
  title: string
  instruction: string
  country: string
  continent: string
  levels: string
  answer: string
  price: number
  video: string
  picture: string
  state: string
  area: string
  publishedAt: Date
  duration: number
  status: string
  category: string
  createdAt: Date
}

const WeekendSchema: Schema = new Schema(
  {
    priority: { type: String },
    continent: { type: String },
    country: { type: String },
    state: { type: String },
    area: { type: String },
    title: { type: String },
    instruction: { type: String },
    question: { type: String },
    authorName: { type: String },
    authorUsername: { type: String },
    bioUserUsername: { type: String },
    answer: { type: String },
    price: { type: Number, default: 0 },
    levels: { type: String },
    status: { type: String, default: 'Draft' },
    video: { type: String },
    picture: { type: String },
    category: { type: String },
    isMain: { type: Boolean },
    isFeatured: { type: Boolean },
    isSubscribed: { type: Boolean },
    isPublished: { type: Boolean },
    duration: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    publishedAt: { type: Date },
    startAt: { type: Date },
    endAt: { type: Date },
  },
  {
    timestamps: true,
  }
)
export const Weekend = mongoose.model<IWeekend>('Weekend', WeekendSchema)
