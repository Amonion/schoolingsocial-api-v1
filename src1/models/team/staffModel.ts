import mongoose, { Schema } from "mongoose";
import { IStaff } from "../../utils/teamInterface";
// Define an interface for the User document

const StaffSchema: Schema = new Schema(
  {
    email: {
      type: String,
    },
    username: {
      type: String,
    },
    phone: {
      type: String,
    },
    picture: { type: String, default: "" },
    role: { type: String, default: null },
    position: { type: String, default: null },
    salary: { type: Number, default: 10000 },
    level: { type: Number, default: 1 },
    userId: { type: String, default: null },
    areaId: { type: String, default: null },
    area: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: "" },
    continent: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt
  }
);

export const Staff = mongoose.model<IStaff>("Staff", StaffSchema);
