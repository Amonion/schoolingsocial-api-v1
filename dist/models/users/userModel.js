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
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "A user with this email already exists"],
        match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    username: {
        type: String,
    },
    phone: { type: String, default: "" },
    media: { type: String, default: "" },
    picture: { type: String, default: "" },
    displayName: { type: String, default: "" },
    intro: { type: String, default: "" },
    userId: { type: String, default: "" },
    role: { type: String, default: null },
    signupIp: { type: String, default: "" },
    interests: { type: Array, default: [] },
    userStatus: { type: String, default: "User" },
    staffPositions: { type: String, default: "" },
    residentCountry: { type: String, default: "" },
    postVisibility: { type: String, default: "" },
    commentAbility: { type: String, default: "" },
    residentState: { type: String, default: "" },
    originCountry: { type: String, default: "" },
    origintState: { type: String, default: "" },
    notifications: { type: String, default: "" },
    socials: { type: String, default: "" },
    signupCountry: { type: String, default: "" },
    signupCountryFlag: { type: String, default: "" },
    level: { type: Number, default: 1 },
    followers: { type: Number, default: 0 },
    posts: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    uploads: { type: Number, default: 0 },
    exams: { type: Number, default: 0 },
    isOnVerification: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    isFollowed: { type: Boolean, default: false },
    isDocument: { type: Boolean, default: false },
    isOrigin: { type: Boolean, default: false },
    isContact: { type: Boolean, default: false },
    isBio: { type: Boolean, default: false },
    isRelated: { type: Boolean, default: false },
    isEducationDocument: { type: Boolean, default: false },
    isEducationHistory: { type: Boolean, default: false },
    isEducation: { type: Boolean, default: false },
    isAccountSet: { type: Boolean, default: false },
    isAccountOpen: { type: Boolean, default: false },
    isSuspendeded: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isFirstTime: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    passwordResetToken: { type: String, default: null },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false,
    },
    passwordExpiresAt: { type: Date, default: null },
}, {
    timestamps: true,
});
exports.User = mongoose_1.default.model("User", UserSchema);
