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
exports.Participant = exports.LastUserObjective = exports.UserObjective = exports.UserTestExam = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserTestExamSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
exports.UserTestExam = mongoose_1.default.model('UserTestExam', UserTestExamSchema);
const UserObjectiveSchema = new mongoose_1.Schema({
    bioUserId: { type: String },
    paperId: { type: String },
    objectiveId: { type: String },
    isClicked: { type: Boolean, default: false },
    isCorrect: { type: Boolean, default: false },
    question: { type: String },
    options: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.UserObjective = mongoose_1.default.model('UserObjective', UserObjectiveSchema);
const LastUserObjectiveSchema = new mongoose_1.Schema({
    bioUserId: { type: String },
    paperId: { type: String },
    objectiveId: { type: String },
    isClicked: { type: Boolean, default: false },
    question: { type: String },
    options: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.LastUserObjective = mongoose_1.default.model('LastUserObjective', LastUserObjectiveSchema);
const ParticipantSchema = new mongoose_1.Schema({
    bioUserId: { type: String },
    bioUserUsername: { type: String },
    paperId: { type: String, default: '' },
    isClicked: { type: Boolean, default: false },
    question: { type: String, default: '' },
    options: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Participant = mongoose_1.default.model('Participant', ParticipantSchema);
