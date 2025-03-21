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
exports.Repost = exports.View = exports.CommentStat = exports.Bookmark = exports.Like = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const LikeSchema = new mongoose_1.Schema({
    userId: { type: String },
    postId: { type: String },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Like = mongoose_1.default.model("Like", LikeSchema);
const BookmarkSchema = new mongoose_1.Schema({
    userId: { type: String },
    postId: { type: String },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Bookmark = mongoose_1.default.model("Bookmark", BookmarkSchema);
const CommentSchema = new mongoose_1.Schema({
    userId: { type: String },
    postId: { type: String },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.CommentStat = mongoose_1.default.model("CommentStat", CommentSchema);
const ViewSchema = new mongoose_1.Schema({
    userId: { type: String },
    postId: { type: String },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.View = mongoose_1.default.model("Views", ViewSchema);
const RepostSchema = new mongoose_1.Schema({
    userId: { type: String },
    postId: { type: String },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
});
exports.Repost = mongoose_1.default.model("Repost", RepostSchema);
