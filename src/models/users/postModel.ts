import mongoose, { Schema } from "mongoose";
import { IAccount, IUserInterest, IFollower } from "../../utils/userInterface";

const AccountSchema: Schema = new Schema(
  {
    display: { type: String },
    username: { type: String },
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
    followersId: { type: Array },
    followingsId: { type: Array },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const Follower = mongoose.model<IFollower>("Follower", FollowerSchema);
