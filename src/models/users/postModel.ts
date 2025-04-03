import mongoose, { Schema } from "mongoose";
import {
  IAccount,
  IPost,
  IUserInterest,
  IFollower,
} from "../../utils/userInterface";

const PostSchema: Schema = new Schema(
  {
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
    followers: { type: Number, default: 0 },
    unfollowers: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    followed: { type: Boolean, default: false },
    muted: { type: Boolean, default: false },
    liked: { type: Boolean, default: false },
    bookmarked: { type: Boolean, default: false },
    viewed: { type: Boolean, default: false },
    views: { type: Number, default: 1 },
    reposts: { type: Number, default: 0 },
    score: { type: Number, default: 0 },
    trendSscore: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const Post = mongoose.model<IPost>("Post", PostSchema);

const AccountSchema: Schema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);
export const Account = mongoose.model<IAccount>("Account", AccountSchema);

const UserInterestSchema: Schema = new Schema(
  {
    userId: { type: String },
    interests: { type: Array },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const UserInterest = mongoose.model<IUserInterest>(
  "UserInterest",
  UserInterestSchema
);

const FollowerSchema: Schema = new Schema(
  {
    userId: { type: String },
    username: { type: String },
    picture: { type: String },
    followerId: { type: String },
    followerUsername: { type: String },
    followerPicture: { type: String },
    postId: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const Follower = mongoose.model<IFollower>("Follower", FollowerSchema);
