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
exports.Activity = exports.StaffSubject = exports.AcademicLevel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AcademicLevelSchema = new mongoose_1.Schema({
    certificate: { type: String, default: '' },
    certificateName: { type: String, default: '' },
    level: { type: Number, default: 0 },
    maxLevel: { type: Number, default: 0 },
    maxLevelName: { type: String, default: '' },
    levelName: { type: String, default: '' },
    institution: { type: String, default: '' },
    section: { type: String, default: '' },
    subsection: { type: String, default: '' },
    country: { type: String, default: '' },
    placeId: { type: String, default: '' },
    countryFlag: { type: String, default: '' },
    description: { type: String, default: '' },
    inSchool: { type: Boolean, default: false },
    isCurriculum: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.AcademicLevel = mongoose_1.default.model('AcademicLevel', AcademicLevelSchema);
const StaffSubjectSchema = new mongoose_1.Schema({
    officeUsername: { type: String, default: '' },
    name: { type: String, default: '' },
    level: { type: Number, default: 0 },
    levelName: { type: String, default: '' },
    bioUserUsername: { type: String, default: '' },
    bioUserDisplayName: { type: String, default: '' },
    staffPicture: { type: String, default: '' },
    description: { type: String, default: '' },
    curriculumTitle: { type: String, default: '' },
    schemeOfWork: { type: String, default: '' },
    subjectCode: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.StaffSubject = mongoose_1.default.model('StaffSubject', StaffSubjectSchema);
const ActivitySchema = new mongoose_1.Schema({
    country: { type: String, default: '' },
    officeUsername: { type: String, default: '' },
    state: { type: String, default: '' },
    levelName: { type: String, default: '' },
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    picture: { type: String, default: '' },
    isHoliday: { type: Boolean, default: false },
    startingDate: { type: Date },
    endingDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Activity = mongoose_1.default.model('Activity', ActivitySchema);
