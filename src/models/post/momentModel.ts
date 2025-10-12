import mongoose, { Schema } from 'mongoose'

export interface MomentMedia {
  type: string
  src: string
  preview: string
  content: string
  backgroundColor: string
  isViewed: boolean
}

export interface IMoment extends Document {
  _id: string
  username: string
  media: MomentMedia[]
  picture: string
  displayName: string
}

const MomentSchema: Schema = new Schema(
  {
    media: { type: Array },
    username: { type: String },
    picture: { type: String },
    displayName: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Moment = mongoose.model<IMoment>('Moment', MomentSchema)
