import mongoose, { Schema } from 'mongoose'

export interface IBioUserSettings extends Document {
  username: string
  bioUserId: string
  bioVisibility: {}
  educationVisibility: {}
  originisibility: {}
  residentialisibility: {}
  relatedisibility: {}
  documentisibility: {}
  notification: {}
}

const BioUserSettingsSchema: Schema = new Schema(
  {
    bioUsername: { type: String },
    bioUserId: { type: String, default: '' },
    bioVisibility: {
      government: { type: Boolean, default: true },
      institution: { type: Boolean, default: true },
      single: { type: Boolean, default: false },
      company: { type: Boolean, default: false },
    },
    educationVisibility: {
      government: { type: Boolean, default: true },
      institution: { type: Boolean, default: true },
      single: { type: Boolean, default: false },
      company: { type: Boolean, default: false },
    },
    originisibility: {
      government: { type: Boolean, default: true },
      institution: { type: Boolean, default: true },
      single: { type: Boolean, default: false },
      company: { type: Boolean, default: false },
    },
    residentialisibility: {
      government: { type: Boolean, default: true },
      institution: { type: Boolean, default: true },
      single: { type: Boolean, default: false },
      company: { type: Boolean, default: false },
    },
    relatedisibility: {
      government: { type: Boolean, default: true },
      institution: { type: Boolean, default: true },
      single: { type: Boolean, default: false },
      company: { type: Boolean, default: false },
    },
    documentisibility: {
      government: { type: Boolean, default: true },
      institution: { type: Boolean, default: true },
      single: { type: Boolean, default: false },
      company: { type: Boolean, default: false },
    },
    notification: {
      jobPosting: { type: Boolean, default: true },
      friendRequest: { type: Boolean, default: true },
      newMessage: { type: Boolean, default: false },
      sound: { type: Boolean, default: false },
    },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export const BioUserSettings = mongoose.model<IBioUserSettings>(
  'BioUserSettings',
  BioUserSettingsSchema
)
