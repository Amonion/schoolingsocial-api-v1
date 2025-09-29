import mongoose, { Schema } from 'mongoose'

export interface IOfficialMessage extends Document {
  content: string
  greetings: string
  title: string
  type: string
  name: string
  unread: boolean
  senderUsername: string
  receiverUsername: string
  senderName: string
  receiverName: string
  senderPicture: string
  receiverPicture: string
  senderAddress: string
  senderArea: string
  senderState: string
  senderCountry: string
  receiverAddress: string
  receiverArea: string
  receiverState: string
  receiverCountry: string
  createdAt: Date
}

const OfficialMessageSchema: Schema = new Schema(
  {
    content: { type: String, default: '' },
    title: { type: String },
    senderUsername: { type: String, default: '' },
    receiverUsername: { type: String, default: '' },
    senderName: { type: String, default: '' },
    receiverName: { type: String, default: '' },
    senderPicture: { type: String, default: '' },
    receiverPicture: { type: String, default: '' },
    greetings: { type: String, default: '' },
    senderAddress: { type: String, default: '' },
    senderArea: { type: String, default: '' },
    senderState: { type: String, default: '' },
    senderCountry: { type: String, default: '' },
    receiverAddress: { type: String, default: '' },
    receiverArea: { type: String, default: '' },
    receiverState: { type: String, default: '' },
    receiverCountry: { type: String, default: '' },
    type: { type: String, default: '' },
    unread: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const OfficialMessage = mongoose.model<IOfficialMessage>(
  'OfficialMessage',
  OfficialMessageSchema
)
