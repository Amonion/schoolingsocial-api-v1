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
exports.Follower = exports.UserInterest = exports.Account = exports.Post = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PostSchema = new mongoose_1.Schema({
    displayName: { type: String },
    username: { type: String },
    userId: { type: String },
    picture: { type: String, default: "" },
    media: { type: Array, default: [] },
    polls: { type: Array, default: [] },
    users: { type: Array, default: [] },
    content: { type: String, default: "" },
    postCountry: { type: String, default: "" },
    postType: { type: String, default: "main" },
    postId: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    replies: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    liked: { type: Boolean, default: false },
    bookmarked: { type: Boolean, default: false },
    viewed: { type: Boolean, default: false },
    views: { type: Number, default: 1 },
    reposts: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    trendSscore: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Post = mongoose_1.default.model("Post", PostSchema);
const AccountSchema = new mongoose_1.Schema({
    displayName: { type: String },
    username: { type: String },
    userId: { type: String },
    picture: { type: String, default: "" },
    media: { type: String, default: null },
    description: { type: String, default: "" },
    type: { type: String, default: "Original" },
    isVerified: { type: Boolean, default: false },
    verificationLevel: { type: Number, default: 0 },
    posts: { type: Number, default: 0 },
    replies: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    following: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Account = mongoose_1.default.model("Account", AccountSchema);
const UserInterestSchema = new mongoose_1.Schema({
    userId: { type: String },
    interests: { type: Array },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.UserInterest = mongoose_1.default.model("UserInterest", UserInterestSchema);
const FollowerSchema = new mongoose_1.Schema({
    userId: { type: String },
    followersId: { type: Array },
    followingsId: { type: Array },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Follower = mongoose_1.default.model("Follower", FollowerSchema);
