import mongoose, { Schema } from "mongoose";
import { ICompany, IExpenses, IPosition } from "../../utils/teamInterface";

const PositionSchema: Schema = new Schema(
  {
    role: { type: String },
    position: { type: String },
    level: { type: Number },
    salary: { type: Number },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const Position = mongoose.model<IPosition>("Position", PositionSchema);

const CompanySchema: Schema = new Schema(
  {
    name: { type: String },
    domain: { type: String },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    headquaters: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const Company = mongoose.model<ICompany>("Company", CompanySchema);

const ExpensesSchema: Schema = new Schema(
  {
    name: { type: String },
    amount: { type: Number },
    receipt: { type: String, default: "" },
    description: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const Expenses = mongoose.model<IExpenses>("Expenses", ExpensesSchema);
