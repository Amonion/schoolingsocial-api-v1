import mongoose, { Schema } from 'mongoose'

export interface ISchoolQuestion extends Document {
  _id: string
  username: string
  name: string
  officeType: string
  subject: string
  level: number
  levelName: string
  title: string
  arm: string
  subtitle: string
  instruction: string
  logo: string
  media: string
  randomize: boolean
  showResult: boolean
  isEditable: boolean
  simultaneous: boolean
  isPublished: boolean
  isOn: boolean
  isExpired: boolean
  type: string
  status: string
  from: string
  totalQuestions: number
  duration: number
  publishingTime: number
  startingTime: number
  questionsPerPage: number
  optionsPerQuestion: number
  questionDate: Date | null
  publishedAt: Date | null
}

const SchoolQuestionSchema: Schema = new Schema(
  {
    level: { type: Number },
    levelName: { type: String },
    title: { type: String },
    media: { type: String },
    logo: { type: String },
    subject: { type: String },
    subtitle: { type: String },
    arm: { type: String },
    instruction: { type: String },
    randomize: { type: Boolean },
    showResult: { type: Boolean },
    simultaneous: { type: Boolean },
    isEditable: { type: Boolean },
    isPublished: { type: Boolean },
    isOn: { type: Boolean },
    isExpired: { type: Boolean },
    type: { type: String },
    name: { type: String },
    username: { type: String },
    status: { type: String, default: 'Draft' },
    participants: { type: Number },
    duration: { type: Number },
    totalQuestions: { type: Number },
    questionsPerPage: { type: Number },
    optionsPerQuestion: { type: Number },
    publishingTime: { type: Number },
    startingTime: { type: Number },
    createdAt: { type: Date, default: Date.now },
    questionDate: { type: Date, default: null },
    publishedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const SchoolQuestion = mongoose.model<ISchoolQuestion>(
  'SchoolQuestion',
  SchoolQuestionSchema
)
