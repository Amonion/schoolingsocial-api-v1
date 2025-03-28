import mongoose, { Schema } from "mongoose";
import {
  IWeekend,
  IExam,
  ILeague,
  IPaper,
  IObjective,
} from "../../utils/teamInterface";

const WeekendSchema: Schema = new Schema(
  {
    continent: { type: String },
    country: { type: String },
    state: { type: String, default: "" },
    placeId: { type: String, default: "" },
    title: { type: String, default: "" },
    instruction: { type: String, default: "" },
    answer: { type: String, default: "" },
    price: { type: Number, default: 0 },
    levels: { type: String, default: "" },
    status: { type: String, default: "Draft" },
    video: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    picture: { type: String, default: "" },
    category: { type: String, default: "" },
    duration: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    publishedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const Weekend = mongoose.model<IWeekend>("Weekend", WeekendSchema);

const ObjectiveSchema: Schema = new Schema(
  {
    index: { type: Number },
    paperId: { type: String },
    leagueId: { type: String },
    question: { type: String },
    options: { type: Array },
    isSelected: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const Objective = mongoose.model<IObjective>(
  "Objective",
  ObjectiveSchema
);

const PaperSchema: Schema = new Schema(
  {
    continent: { type: String },
    country: { type: String },
    state: { type: String, default: "" },
    placeId: { type: String, default: "" },
    title: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    instruction: { type: String, default: "" },
    randomize: { type: Boolean, default: false },
    showResult: { type: Boolean, default: false },
    isEditable: { type: Boolean, default: true },
    simultaneous: { type: Boolean, default: false },
    type: { type: String, default: "" },
    status: { type: String, default: "Draft" },
    from: { type: String, default: "" },
    duration: { type: Number, default: 0 },
    questionsPerPage: { type: Number, default: 0 },
    optionsPerQuestion: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    publishedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const Paper = mongoose.model<IPaper>("Paper", PaperSchema);

const LeagueSchema: Schema = new Schema(
  {
    continent: { type: String },
    country: { type: String },
    state: { type: String, default: "" },
    placeId: { type: String, default: "" },
    title: { type: String, default: "" },
    status: { type: String, default: "Draft" },
    schools: { type: Number, default: 0 },
    subjects: { type: String },
    students: { type: Number, default: 0 },
    instruction: { type: String, default: "" },
    media: { type: String, default: "" },
    picture: { type: String, default: "" },
    level: { type: String, default: "" },
    price: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    publishedAt: { type: Date, default: Date.now },
    endAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const League = mongoose.model<ILeague>("League", LeagueSchema);

const ExamSchema: Schema = new Schema(
  {
    continents: { type: Array, default: [] },
    countries: { type: Array, default: [] },
    countriesId: { type: Array, default: [] },
    states: { type: Array, default: [] },
    statesId: { type: Array, default: [] },
    academicLevels: { type: Array, default: [] },

    title: { type: String, default: "" },
    subjects: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    instruction: { type: String, default: "" },
    randomize: { type: Boolean, default: false },
    showResult: { type: Boolean, default: false },
    simultaneous: { type: Boolean, default: false },
    eligibility: { type: Boolean, default: false },
    isEditable: { type: Boolean, default: false },
    type: { type: String, default: "" },
    name: { type: String, default: "" },
    status: { type: String, default: "Draft" },
    duration: { type: Number, default: 0 },
    questions: { type: Number, default: 0 },
    questionsPerPage: { type: Number, default: 0 },
    optionsPerQuestion: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    questionDate: { type: Date, default: null },
    publishedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const Exam = mongoose.model<IExam>("Exam", ExamSchema);
