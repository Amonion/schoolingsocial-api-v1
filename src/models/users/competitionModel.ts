import mongoose, { Schema } from 'mongoose'

interface Option {
  index: number
  value: string
  isSelected: boolean
  isClicked: boolean
}

export interface IUserTestExam extends Document {
  bioUserUsername: string
  bioUserId: string
  bioUserPicture: string
  paperId: string
  bioUserDisplayName: string
  title: string
  type: string
  instruction: string
  questions: number
  duration: number
  rate: number
  accuracy: number
  metric: number
  attempts: number
  isFirstTime: boolean
  totalAnswered: number
  totalCorrectAnswer: number
}

const UserTestExamSchema: Schema = new Schema(
  {
    bioUserUsername: { type: String },
    bioUserId: { type: String },
    bioUserPicture: { type: String },
    paperId: { type: String },
    bioUserDisplayName: { type: String },
    title: { type: String },
    instruction: { type: String },
    type: { type: String },
    questions: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    metric: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    isFirstTime: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    attemptedQuestions: { type: Number, default: 0 },
    totalCorrectAnswer: { type: Number, default: 0 },
    started: { type: Number, default: 0 },
    ended: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const UserTestExam = mongoose.model<IUserTestExam>(
  'UserTestExam',
  UserTestExamSchema
)

export interface IUserObjective extends Document {
  _id: string
  bioUserId: string
  paperId: string
  objectiveId: string
  isClicked: boolean
  isCorrect: boolean
  question: string
  options: Option[]
}

const UserObjectiveSchema: Schema = new Schema(
  {
    bioUserId: { type: String },
    paperId: { type: String },
    objectiveId: { type: String },
    isClicked: { type: Boolean, default: false },
    isCorrect: { type: Boolean, default: false },
    question: { type: String },
    options: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const UserObjective = mongoose.model<IUserObjective>(
  'UserObjective',
  UserObjectiveSchema
)
const LastUserObjectiveSchema: Schema = new Schema(
  {
    bioUserId: { type: String },
    paperId: { type: String },
    objectiveId: { type: String },
    isClicked: { type: Boolean, default: false },
    question: { type: String },
    options: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const LastUserObjective = mongoose.model<IUserObjective>(
  'LastUserObjective',
  LastUserObjectiveSchema
)

export interface IParticipant extends Document {
  _id: string
  bioUserId: string
  bioUserUsername: string
  paperId: string
  isClicked: boolean
  question: string
  options: Option[]
}

const ParticipantSchema: Schema = new Schema(
  {
    bioUserId: { type: String },
    bioUserUsername: { type: String },
    paperId: { type: String, default: '' },
    isClicked: { type: Boolean, default: false },
    question: { type: String, default: '' },
    options: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Participant = mongoose.model<IParticipant>(
  'Participant',
  ParticipantSchema
)
