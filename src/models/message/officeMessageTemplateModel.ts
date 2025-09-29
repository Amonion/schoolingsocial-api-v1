import mongoose, { Schema } from 'mongoose'

export interface IOfficeMessageTemplate extends Document {
  content: string
  greetings: string
  title: string
  officeUsername: string
  createdAt: Date
}

const OfficeMessageTemplateSchema: Schema = new Schema(
  {
    content: { type: String, default: '' },
    title: { type: String },
    officeUsername: { type: String, default: '' },
    greetings: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const OfficeMessageTemplate = mongoose.model<IOfficeMessageTemplate>(
  'OfficeMessageTemplate',
  OfficeMessageTemplateSchema
)
