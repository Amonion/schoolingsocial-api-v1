import mongoose, { Schema } from 'mongoose'
import {
  IAccount,
  IPost,
  IPoll,
  IUserInterest,
  IFollower,
  IPin,
  IMute,
  IBlock,
} from '../../utils/userInterface'

const PostSchema: Schema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
)
export const Post = mongoose.model<IPost>('Post', PostSchema)

const AccountSchema: Schema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
)
export const Account = mongoose.model<IAccount>('Account', AccountSchema)

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

const PinSchema: Schema = new Schema(
  {
    userId: { type: String },
    postId: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Pin = mongoose.model<IPin>('Pin', PinSchema)

const BlockSchema: Schema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
)
export const Block = mongoose.model<IBlock>('Block', BlockSchema)

const MuteSchema: Schema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
)
export const Mute = mongoose.model<IMute>('Mute', MuteSchema)

const UserInterestSchema: Schema = new Schema(
  {
    userId: { type: String },
    interests: { type: Array },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const UserInterest = mongoose.model<IUserInterest>(
  'UserInterest',
  UserInterestSchema
)

const FollowerSchema: Schema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
)
export const Follower = mongoose.model<IFollower>('Follower', FollowerSchema)
