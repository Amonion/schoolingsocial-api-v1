import mongoose, { Schema } from 'mongoose'

export interface IOption {
  index: number
  value: string
  isSelected: boolean
  isClicked: boolean
}
export interface IObjective extends Document {
  _id: string
  index: number
  isClicked: boolean
  isSelected: boolean
  paperId: string
  question: string
  options: IOption[]
}

const ObjectiveSchema: Schema = new Schema(
  {
    index: { type: Number },
    paperId: { type: String },
    question: { type: String },
    options: { type: Array },
    isSelected: { type: Boolean, default: false },
    isClicked: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Objective = mongoose.model<IObjective>(
  'Objective',
  ObjectiveSchema
)
