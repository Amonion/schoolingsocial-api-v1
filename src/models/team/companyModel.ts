import mongoose, { Schema } from 'mongoose'
import {
  ICompany,
  IExpenses,
  IPosition,
  IInterest,
} from '../../utils/teamInterface'

const PositionSchema: Schema = new Schema(
  {
    role: { type: String },
    position: { type: String },
    duties: { type: String },
    level: { type: Number },
    salary: { type: Number },
    allowSignup: { type: Boolean },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Position = mongoose.model<IPosition>('Position', PositionSchema)

const CompanySchema: Schema = new Schema(
  {
    name: { type: String },
    domain: { type: String },
    email: { type: String, default: '' },
    documents: { type: String, default: '' },
    finalInstruction: { type: String, default: '' },
    welcomeMessage: { type: String, default: '' },
    phone: { type: String, default: '' },
    headquaters: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Company = mongoose.model<ICompany>('Company', CompanySchema)

const ExpensesSchema: Schema = new Schema(
  {
    name: { type: String },
    amount: { type: Number },
    receipt: { type: String, default: '' },
    description: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Expenses = mongoose.model<IExpenses>('Expenses', ExpensesSchema)

const InterestSchema: Schema = new Schema(
  {
    name: { type: String, default: '' },
    country: { type: String, default: '' },
    rank: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

export const Interest = mongoose.model<IInterest>('Interest', InterestSchema)
