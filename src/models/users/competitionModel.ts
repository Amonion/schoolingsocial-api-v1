import mongoose, { Schema } from "mongoose";
import {
  IUserTestExam,
  IUserTest,
  IParticipant,
  IAttempt,
} from "../../utils/userInterface";

const UserTestExamSchema: Schema = new Schema(
  {
    username: { type: String },
    userId: { type: String },
    picture: { type: String, default: "" },
    paperId: { type: String, default: "" },
    name: { type: String, default: "" },
    title: { type: String, default: "" },
    instruction: { type: String, default: "" },
    type: { type: String, default: "" },
    questions: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    metric: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    attemptedQuestions: { type: Number, default: 0 },
    totalCorrectAnswer: { type: Number, default: 0 },
    started: { type: Number, default: 0 },
    ended: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const UserTestExam = mongoose.model<IUserTestExam>(
  "UserTestExam",
  UserTestExamSchema
);

const UserTestSchema: Schema = new Schema(
  {
    userId: { type: String },
    paperId: { type: String, default: "" },
    isClicked: { type: Boolean, default: false },
    question: { type: String, default: "" },
    options: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const UserTest = mongoose.model<IUserTest>("UserTest", UserTestSchema);

const ParticipantSchema: Schema = new Schema(
  {
    userId: { type: String },
    paperId: { type: String, default: "" },
    isClicked: { type: Boolean, default: false },
    question: { type: String, default: "" },
    options: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const Participant = mongoose.model<IParticipant>(
  "Participant",
  ParticipantSchema
);

const AttemptSchema: Schema = new Schema(
  {
    userId: { type: String },
    paperId: { type: String, default: "" },
    username: { type: String, default: false },
    attempts: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const Attempt = mongoose.model<IAttempt>("Attempt", AttemptSchema);
