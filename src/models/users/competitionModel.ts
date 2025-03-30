import mongoose, { Schema } from "mongoose";
import {
  IAccount,
  IUserTest,
  IUserInterest,
  IFollower,
} from "../../utils/userInterface";

const UserTestSchema: Schema = new Schema(
  {
    username: { type: String },
    userId: { type: String },
    picture: { type: String, default: "" },
    paperId: { type: String, default: "" },
    name: { type: String, default: "" },
    title: { type: String, default: "" },
    type: { type: String, default: "" },
    questionLen: { type: Number, default: 0 },
    questions: { type: Array, default: [] },

    rate: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    metric: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    attemptedQuestions: { type: Number, default: 0 },
    totalCorrectAnswer: { type: Number, default: 0 },

    started: { type: Date, default: Date.now },
    ended: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const UserTest = mongoose.model<IUserTest>("UserTest", UserTestSchema);
