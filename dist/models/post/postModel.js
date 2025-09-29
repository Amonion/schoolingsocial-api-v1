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
exports.Follower = exports.UserInterest = exports.Mute = exports.Block = exports.Pin = exports.Poll = exports.Account = exports.Post = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PostSchema = new mongoose_1.Schema({
    displayName: { type: String },
    username: { type: String },
    bioUserId: { type: String },
    picture: { type: String, default: '' },
    media: { type: Array, default: [] },
    polls: { type: Array, default: [] },
    users: { type: Array, default: [] },
    comments: { type: Array, default: [] },
    content: { type: String, default: '' },
    postCountry: { type: String, default: '' },
    user: { type: String, default: '' },
    replyTo: { type: String, default: '' },
    postType: { type: String, default: 'main' },
    repostedUsername: { type: String, default: '' },
    uniqueId: { type: String, default: '' },
    postId: { type: String, default: '' },
    replyToId: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    isSelected: { type: Boolean, default: false },
    replies: { type: Number, default: 0 },
    level: { type: Number, default: 0 },
    bookmarks: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    unfollowers: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    totalVotes: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    hates: { type: Number, default: 0 },
    followed: { type: Boolean, default: false },
    muted: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    liked: { type: Boolean, default: false },
    hated: { type: Boolean, default: false },
    bookmarked: { type: Boolean, default: false },
    viewed: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    reposted: { type: Boolean, default: false },
    views: { type: Number, default: 1 },
    blocks: { type: Number, default: 1 },
    reposts: { type: Number, default: 0 },
    mutes: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    status: { type: Boolean, default: true },
    trendSscore: { type: Number, default: 0 },
    pinnedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Post = mongoose_1.default.model('Post', PostSchema);
const AccountSchema = new mongoose_1.Schema({
    displayName: { type: String },
    username: { type: String },
    userId: { type: String },
    picture: { type: String, default: '' },
    media: { type: String, default: null },
    description: { type: String, default: '' },
    type: { type: String, default: 'Original' },
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
exports.Account = mongoose_1.default.model('Account', AccountSchema);
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
const PinSchema = new mongoose_1.Schema({
    userId: { type: String },
    postId: { type: String },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Pin = mongoose_1.default.model('Pin', PinSchema);
const BlockSchema = new mongoose_1.Schema({
    userId: { type: String },
    postId: { type: String },
    accountUsername: { type: String },
    accountPicture: { type: String },
    accountUserId: { type: String },
    accountBioId: { type: String },
    accountDisplayName: { type: String },
    accountIsVerified: { type: Boolean },
    bioId: { type: String },
    username: { type: String },
    picture: { type: String },
    displayName: { type: String },
    isVerified: { type: String },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Block = mongoose_1.default.model('Block', BlockSchema);
const MuteSchema = new mongoose_1.Schema({
    userId: { type: String },
    postId: { type: String },
    accountUsername: { type: String },
    accountPicture: { type: String },
    accountUserId: { type: String },
    accountBioId: { type: String },
    accountDisplayName: { type: String },
    accountIsVerified: { type: Boolean },
    bioId: { type: String },
    username: { type: String },
    picture: { type: String },
    displayName: { type: String },
    isVerified: { type: String },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Mute = mongoose_1.default.model('Mute', MuteSchema);
const UserInterestSchema = new mongoose_1.Schema({
    userId: { type: String },
    interests: { type: Array },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.UserInterest = mongoose_1.default.model('UserInterest', UserInterestSchema);
const FollowerSchema = new mongoose_1.Schema({
    userId: { type: String },
    bioId: { type: String },
    username: { type: String },
    displayName: { type: String },
    isVerified: { type: Boolean },
    picture: { type: String },
    followerId: { type: String },
    followerUsername: { type: String },
    followerPicture: { type: String },
    followerDisplayName: { type: String },
    followerIsVerified: { type: Boolean },
    followed: { type: Boolean, default: false },
    postId: { type: String },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Follower = mongoose_1.default.model('Follower', FollowerSchema);
