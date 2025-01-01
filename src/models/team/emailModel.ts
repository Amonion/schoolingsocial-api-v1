import mongoose, { Schema } from "mongoose";
import { IEmail } from "../../utils/teamInterface";

const EmailSchema: Schema = new Schema(
  {
    content: { type: String, default: "" },
    title: { type: String },
    name: { type: String, default: "" },
    picture: { type: String, default: "" },
    greetings: { type: String, default: "" },
    note: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt
  }
);

export const Email = mongoose.model<IEmail>("Email", EmailSchema);
