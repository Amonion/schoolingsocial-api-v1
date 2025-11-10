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
exports.Poll = exports.Post = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PostSchema = new mongoose_1.Schema({
    displayName: { type: String },
    username: { type: String },
    bioUserId: { type: String },
    picture: { type: String },
    commentMedia: { type: String },
    media: { type: Array },
    polls: { type: Array },
    userId: { type: String },
    comments: { type: Array },
    content: { type: String },
    country: { type: String },
    backgroundColor: { type: String },
    user: { type: String },
    replyTo: { type: String },
    postType: { type: String, default: 'main' },
    repostedUsername: { type: String },
    uniqueId: { type: String },
    postId: { type: String },
    replyToId: { type: String },
    isVerified: { type: Boolean },
    isSelected: { type: Boolean },
    replies: { type: Number },
    level: { type: Number },
    bookmarks: { type: Number },
    followers: { type: Number },
    unfollowers: { type: Number },
    shares: { type: Number },
    totalVotes: { type: Number },
    likes: { type: Number },
    hates: { type: Number },
    followed: { type: Boolean },
    muted: { type: Boolean },
    blocked: { type: Boolean },
    liked: { type: Boolean },
    hated: { type: Boolean },
    bookmarked: { type: Boolean },
    viewed: { type: Boolean },
    isPinned: { type: Boolean },
    reposted: { type: Boolean },
    views: { type: Number, default: 1 },
    blocks: { type: Number },
    reposts: { type: Number },
    mutes: { type: Number },
    score: { type: Number },
    status: { type: Boolean, default: true },
    trendSscore: { type: Number },
    pinnedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
PostSchema.index({ country: 1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ score: -1 });
PostSchema.index({ country: 1, score: -1, createdAt: -1 });
exports.Post = mongoose_1.default.model('Post', PostSchema);
const PollSchema = new mongoose_1.Schema({
    userId: { type: String },
    username: { type: String },
    postId: { type: String },
    pollIndex: { type: Number },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Poll = mongoose_1.default.model('Poll', PollSchema);
