"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exam = exports.League = exports.Paper = exports.Objective = exports.Weekend = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const WeekendSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
exports.Weekend = mongoose_1.default.model("Weekend", WeekendSchema);
const ObjectiveSchema = new mongoose_1.Schema({
    index: { type: Number },
    paperId: { type: String },
    leagueId: { type: String },
    question: { type: String },
    options: { type: Array },
    isSelected: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Objective = mongoose_1.default.model("Objective", ObjectiveSchema);
const PaperSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
exports.Paper = mongoose_1.default.model("Paper", PaperSchema);
const LeagueSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
exports.League = mongoose_1.default.model("League", LeagueSchema);
const ExamSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
exports.Exam = mongoose_1.default.model("Exam", ExamSchema);
