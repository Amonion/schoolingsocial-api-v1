import mongoose, { Schema } from 'mongoose'

export interface IEmail extends Document {
  content: string
  picture: string
  title: string
  greetings: string
  name: string
  note: string
  createdAt: Date
}

const EmailSchema: Schema = new Schema(
  {
    content: { type: String, default: '' },
    title: { type: String },
    name: { type: String, default: '' },
    picture: { type: String, default: '' },
    greetings: { type: String, default: '' },
    note: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Email = mongoose.model<IEmail>('Email', EmailSchema)
