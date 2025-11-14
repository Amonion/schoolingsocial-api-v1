import mongoose, { Schema } from 'mongoose'
import { IUser } from '../users/user'

interface Media {
  source: string
  type: string
}

export interface IComment extends Document {
  _id: string
  postId: string
  createdAt: Date
  username: string
  userId: string
  replyToId: string
  displayName: string
  content: string
  commentMedia: string
  hates: number
  media: Media[]
  picture: string
  liked: boolean
  hated: boolean
  isVerified: boolean
  replies: number
  score: number
  trendScore: number
  views: number
  bookmarks: number
  likes: number
  reposts: number
}

const CommentSchema: Schema = new Schema(
  {
    displayName: { type: String },
    username: { type: String },
    picture: { type: String },
    commentMedia: { type: String },
    media: { type: Array },
    userId: { type: String },
    comments: { type: Array },
    content: { type: String },
    replyTo: { type: String },
    uniqueId: { type: String },
    postId: { type: String },
    replyToId: { type: String },
    isVerified: { type: Boolean },
    replies: { type: Number, default: 0 },
    level: { type: Number },
    likes: { type: Number, default: 0 },
    hates: { type: Number, default: 0 },
    liked: { type: Boolean },
    hated: { type: Boolean },
    score: { type: Number },
    pinnedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

CommentSchema.index({ country: 1 })
CommentSchema.index({ createdAt: -1 })
CommentSchema.index({ score: -1 })
CommentSchema.index({ country: 1, score: -1, createdAt: -1 })
export const Comment = mongoose.model<IComment>('Comment', CommentSchema)
