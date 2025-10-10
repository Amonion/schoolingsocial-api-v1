import mongoose, { Schema } from 'mongoose'

export interface IBlock extends Document {
  userId: string
  username: string
  picture: string
  displayName: string
  bioId: string
  isVerified: string
  postId: string
  accountUsername: string
  accountUserId: string
  accountDisplayName: string
  accountPicture: string
  accountBioId: string
  accountIsVerified: boolean
}

export interface IPin extends Document {
  userId: string
  postId: string
  createdAt: Date
}

export interface IMute extends Document {
  userId: string
  postId: string
  accountUsername: string
  accountUserId: string
}

export interface IFollower extends Document {
  userId: string
  displayName: string
  isVerified: boolean
  followerDisplayName: string
  username: string
  picture: string
  followerId: string
  followerUsername: string
  followerPicture: string
  followerIsVerified: boolean
  followed: boolean
  postId: string
}

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
    accountDisplayName: { type: String },
    accountIsVerified: { type: Boolean },
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
    followed: { type: Boolean },
    postId: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Follower = mongoose.model<IFollower>('Follower', FollowerSchema)
