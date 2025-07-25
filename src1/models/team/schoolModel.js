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
exports.Course = exports.Department = exports.Faculty = exports.SchoolPayment = exports.School = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const SchoolSchema = new mongoose_1.Schema({
    longitude: { type: Number, default: 0.0 },
    latitude: { type: Number, default: 0.0 },
    resultPointSystem: { type: Number, default: 0.0 },
    logo: { type: String },
    levels: { type: Array },
    institutions: { type: Array, default: [] },
    name: { type: String, default: "" },
    username: { type: String, default: "" },
    area: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    countrySymbol: { type: String, default: "" },
    continent: { type: String, default: "" },
    placeId: { type: String, default: "" },
    countryFlag: { type: String, default: "" },
    description: { type: String, default: "" },
    media: { type: String, default: "" },
    picture: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isRecorded: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.School = mongoose_1.default.model("School", SchoolSchema);
const SchoolPaymentSchema = new mongoose_1.Schema({
    amount: { type: Number, default: 0.0 },
    charge: { type: Number, default: 0.0 },
    schoolLogo: { type: String },
    school: { type: String },
    name: { type: String, default: "" },
    schoolId: { type: String, default: "" },
    currency: { type: String, default: "" },
    currencySymbol: { type: String, default: "" },
    country: { type: String, default: "" },
    countrySymbol: { type: String, default: "" },
    placeId: { type: String, default: "" },
    countryFlag: { type: String, default: "" },
    description: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.SchoolPayment = mongoose_1.default.model("SchoolPayment", SchoolPaymentSchema);
const FacultySchema = new mongoose_1.Schema({
    schoolId: { type: String },
    school: { type: String },
    schoolUsername: { type: String },
    name: { type: String, default: "" },
    username: { type: String, default: "" },
    picture: { type: String, default: "" },
    media: { type: String, default: "" },
    description: { type: String, default: "" },
    isNew: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Faculty = mongoose_1.default.model("Faculty", FacultySchema);
const DepartmentSchema = new mongoose_1.Schema({
    period: { type: Number },
    schoolId: { type: String },
    school: { type: String },
    facultyId: { type: String },
    faculty: { type: String },
    facultyUsername: { type: String },
    name: { type: String, default: "" },
    username: { type: String, default: "" },
    picture: { type: String, default: "" },
    media: { type: String, default: "" },
    description: { type: String, default: "" },
    isNew: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Department = mongoose_1.default.model("Department", DepartmentSchema);
const CourseSchema = new mongoose_1.Schema({
    level: { type: Number },
    semester: { type: Number },
    load: { type: Number },
    facultyId: { type: String },
    schoolId: { type: String },
    departmentId: { type: String },
    department: { type: String },
    name: { type: String, default: "" },
    courseCode: { type: String, default: "" },
    picture: { type: String, default: "" },
    media: { type: String, default: "" },
    description: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Course = mongoose_1.default.model("Course", CourseSchema);
