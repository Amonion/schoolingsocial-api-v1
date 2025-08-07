import mongoose, { Schema } from 'mongoose'
import { IStat } from '../../utils/userInterface'

const HateSchema: Schema = new Schema(
  {
    userId: { type: String },
    postId: { type: String },
    hated: { type: Boolean },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Hate = mongoose.model<IStat>('Hate', HateSchema)
const LikeSchema: Schema = new Schema(
  {
    userId: { type: String },
    postId: { type: String },
    liked: { type: Boolean },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Like = mongoose.model<IStat>('Like', LikeSchema)

const BookmarkSchema: Schema = new Schema(
  {
    userId: { type: String },
    postId: { type: String },
    bookmarkUserId: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Bookmark = mongoose.model<IStat>('Bookmark', BookmarkSchema)

const CommentSchema: Schema = new Schema(
  {
    userId: { type: String },
    postId: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const CommentStat = mongoose.model<IStat>('CommentStat', CommentSchema)

const ViewSchema: Schema = new Schema(
  {
    userId: { type: String },
    postId: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const View = mongoose.model<IStat>('Views', ViewSchema)

const RepostSchema: Schema = new Schema(
  {
    userId: { type: String },
    postId: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Repost = mongoose.model<IStat>('Repost', RepostSchema)
