import mongoose, { Schema } from 'mongoose'
import { IPoll } from '../../utils/userInterface'
import { IUser } from '../users/user'

interface Media {
  source: string
  type: string
}

interface Poll {
  picture: string
  text: string
  userId: string
  index: number
  percent: number
  isSelected: boolean
}

export interface IPost extends Document {
  _id: string
  postId: string
  backgroundColor: string
  createdAt: Date
  pinnedAt: Date
  username: string
  userMedia: string
  repostedUsername: string
  userId: string
  sender: IUser
  postType: string
  replyToId: string
  displayName: string
  content: string
  commentMedia: string
  mutes: number
  hates: number
  blocks: number
  totalVotes: number
  media: Media[]
  polls: Poll[]
  users: string[]
  picture: string
  country: string
  isSelected: boolean
  status: boolean
  followed: boolean
  muted: boolean
  liked: boolean
  hated: boolean
  bookmarked: boolean
  isPinned: boolean
  viewed: boolean
  reposted: boolean
  blocked: boolean
  isVerified: boolean
  shares: number
  followers: number
  unfollowers: number
  replies: number
  score: number
  trendScore: number
  views: number
  bookmarks: number
  likes: number
  reposts: number
}

const PostSchema: Schema = new Schema(
  {
    displayName: { type: String },
    username: { type: String },
    bioUserId: { type: String },
    picture: { type: String },
    userMedia: { type: String },
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
    bookmarks: { type: Number, default: 0 },
    followers: { type: Number },
    unfollowers: { type: Number },
    shares: { type: Number },
    totalVotes: { type: Number },
    likes: { type: Number, default: 0 },
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
  },
  {
    timestamps: true,
  }
)

PostSchema.index({ country: 1 })
PostSchema.index({ createdAt: -1 })
PostSchema.index({ score: -1 })
PostSchema.index({ country: 1, score: -1, createdAt: -1 })
export const Post = mongoose.model<IPost>('Post', PostSchema)

const PollSchema: Schema = new Schema(
  {
    userId: { type: String },
    username: { type: String },
    postId: { type: String },
    pollIndex: { type: Number },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Poll = mongoose.model<IPoll>('Poll', PollSchema)
