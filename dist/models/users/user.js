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
exports.DeletedUser = exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserSchema = new mongoose_1.Schema({
    active: { type: Boolean, default: false },
    bioUserId: { type: String, default: '' },
    bioUserUsername: { type: String, default: '' },
    comments: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    displayName: { type: String, default: '' },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'A user with this email already exists'],
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
        lowercase: true,
    },
    exams: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    followings: { type: Number, default: 0 },
    intro: { type: String, default: '' },
    isFirstTime: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    media: { type: String, default: '' },
    officeNum: { type: Number, default: 0 },
    online: { type: Boolean, default: true },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false,
    },
    passwordExpiresAt: { type: Date, default: null },
    passwordResetToken: { type: String, default: null },
    phone: { type: String, default: '' },
    picture: { type: String, default: '' },
    posts: { type: Number, default: 0 },
    signupCountry: { type: String, default: '' },
    signupIp: { type: String, default: '' },
    signupLocation: { type: Object, default: {} },
    username: { type: String },
    staffPositions: { type: Array, default: [] },
    staffRanking: { type: Number, default: 0 },
    status: { type: String, default: 'User' },
}, {
    timestamps: true,
});
exports.User = mongoose_1.default.model('User', UserSchema);
const DeletedUserSchema = new mongoose_1.Schema({
    bioUserId: { type: String, default: '' },
    email: { type: String, default: '' },
    username: { type: String, default: '' },
    picture: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    displayName: { type: String, default: '' },
}, {
    timestamps: true,
});
exports.DeletedUser = mongoose_1.default.model('DeletedUser', DeletedUserSchema);
