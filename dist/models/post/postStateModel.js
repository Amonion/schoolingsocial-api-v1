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
exports.Follower = exports.Mute = exports.Block = exports.Pin = void 0;
const mongoose_1 = __importStar(require("mongoose"));
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
    accountDisplayName: { type: String },
    accountIsVerified: { type: Boolean },
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
    followed: { type: Boolean },
    postId: { type: String },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Follower = mongoose_1.default.model('Follower', FollowerSchema);
