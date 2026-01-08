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
exports.Friend = exports.Chat = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const ChatSchema = new mongoose_1.Schema({
    senderUsername: { type: String },
    media: { type: Array },
    day: { type: String },
    connection: { type: String },
    status: { type: String },
    repliedChat: { type: Object, default: {} },
    content: { type: String },
    isSavedUsernames: { type: Array },
    isReadUsernames: { type: Array },
    isPinned: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
    receiverUsername: { type: String },
    timeNumber: { type: Number, default: 0 },
    deletedUsername: { type: String },
    receiverTime: { type: Date, default: Date.now },
    senderTime: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Chat = mongoose_1.default.model('Chat', ChatSchema);
const FriendSchema = new mongoose_1.Schema({
    senderUsername: { type: String },
    username: { type: String },
    bioUserId: { type: String },
    displayName: { type: String },
    picture: { type: String },
    isFriends: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    connection: { type: String },
    status: { type: String },
    content: { type: String },
    contentType: { type: String },
    timeNumber: { type: Number },
    unread: { type: Number, default: 0 },
    media: { type: Array },
    time: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Friend = mongoose_1.default.model('Friend', FriendSchema);
