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
exports.UserFinanceInfo = exports.UserSchoolInfo = exports.UserInfo = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserInfoSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "A user with this email already exists"],
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    firstName: { type: String, default: "" },
    middleName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    displayName: { type: String, default: "" },
    username: { type: String, default: "" },
    picture: { type: String, default: "" },
    media: { type: String, default: "" },
    intro: { type: String, default: "" },
    passport: { type: String, default: "" },
    gender: { type: String, default: "" },
    maritalStatus: { type: String, default: "" },
    documents: { type: Array, default: [] },
    signupIp: { type: String, default: "" },
    homeContinent: { type: String, default: "" },
    homeCountry: { type: String, default: "" },
    homeCountrySymbol: { type: String, default: "" },
    homeState: { type: String, default: "" },
    homeArea: { type: String, default: "" },
    homeAddress: { type: String, default: "" },
    homeId: { type: String, default: "" },
    userStatus: { type: String, default: "User" },
    notificationToken: { type: String, default: "" },
    phone: { type: String, default: "" },
    continent: { type: String, default: "" },
    country: { type: String, default: "" },
    countrySymbol: { type: String, default: "" },
    state: { type: String, default: "" },
    area: { type: String, default: "" },
    address: { type: String, default: "" },
    placeId: { type: String, default: "" },
    examAttempts: { type: Number, default: 0 },
    motherName: { type: String, default: "" },
    occupation: { type: String, default: "" },
    nextKin: { type: String, default: "" },
    nextKinPhone: { type: String, default: "" },
    operatingSystem: { type: String, default: "" },
    isOnVerification: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    inSchool: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false },
    verifyingAt: { type: Date, default: null },
    verifiedAt: { type: Date, default: Date.now },
    dob: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.UserInfo = mongoose_1.default.model("UserInfo", UserInfoSchema);
const UserSchoolInfoSchema = new mongoose_1.Schema({
    displayName: { type: String, default: "" },
    username: { type: String, default: "" },
    picture: { type: String, default: "" },
    media: { type: String, default: "" },
    intro: { type: String, default: "" },
    userId: { type: String, default: "" },
    currentSchoolContinent: { type: String, default: "" },
    currentSchoolCountry: { type: String, default: "" },
    currentSchoolCountryFlag: { type: String, default: "" },
    currentSchoolCountrySymbol: { type: String, default: "" },
    currentSchoolLogo: { type: String, default: "" },
    currentSchoolState: { type: String, default: "" },
    currentSchoolPicture: { type: String, default: "" },
    currentSchoolArea: { type: String, default: "" },
    currentSchoolUsername: { type: String, default: "" },
    currentSchoolName: { type: String, default: "" },
    currentSchoolId: { type: String, default: "" },
    currentAcademicLevelSymbol: { type: String, default: "" },
    currentAcademicLevel: { type: Object, default: {} },
    currentAcademicLevelName: { type: String, default: "" },
    currentSchoolLevel: { type: String, default: "" },
    currentSchoolPlaceId: { type: String, default: "" },
    currentFaculty: { type: String, default: "" },
    currentFacultyId: { type: String, default: "" },
    currentFacultyUsername: { type: String, default: "" },
    currentDepartment: { type: String, default: "" },
    currentDepartmentId: { type: String, default: "" },
    currentDepartmentUsername: { type: String, default: "" },
    isSchoolRecorded: { type: Boolean, default: false },
    inSchool: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    pastSchools: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.UserSchoolInfo = mongoose_1.default.model("UserSchoolInfo", UserSchoolInfoSchema);
const UserFinanceInfoSchema = new mongoose_1.Schema({
    displayName: { type: String, default: "" },
    username: { type: String, default: "" },
    picture: { type: String, default: "" },
    media: { type: String, default: "" },
    intro: { type: String, default: "" },
    userId: { type: String, default: "" },
    accountName: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    bvn: { type: String, default: "" },
    bankName: { type: String, default: "" },
    bankId: { type: String, default: "" },
    bankUsername: { type: String, default: "" },
    bankLogo: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.UserFinanceInfo = mongoose_1.default.model("UserFinanceInfo", UserFinanceInfoSchema);
