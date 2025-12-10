import mongoose, { Schema } from 'mongoose'

export interface IUser extends Document {
  _id: string
  active: string
  bioUserId: string
  comments: number
  createdAt: Date
  displayName: string
  email: string
  exams: number
  followers: number
  followings: number
  intro: string
  isFirstTime: boolean
  isSuspended: boolean
  isVerified: boolean
  followed: boolean
  media: string
  officeNum: number
  online: boolean
  password: string
  passwordExpiresAt: Date
  passwordResetToken: string
  personId: string
  phone: string
  picture: string
  posts: number
  country: string
  countryFlag: string
  countrySymbol: string
  state: string
  signupIp: string
  lat: number
  lng: number
  username: string
  staffPositions: string[]
  staffRanking: number
  postMedia: number
  status: string
}

const UserSchema: Schema = new Schema(
  {
    active: { type: Boolean },
    bioUserId: { type: String },
    bioUserUsername: { type: String },
    comments: { type: Number },
    createdAt: { type: Date, default: Date.now },
    displayName: { type: String },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'A user with this email already exists'],
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
      lowercase: true,
    },
    exams: { type: Number },
    followers: { type: Number },
    followings: { type: Number },
    intro: { type: String },
    isFirstTime: { type: Boolean, default: true },
    isVerified: { type: Boolean },
    isSuspended: { type: Boolean },
    followed: { type: Boolean },
    media: { type: String },
    officeNum: { type: Number },
    online: { type: Boolean, default: true },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    passwordExpiresAt: { type: Date, default: null },
    passwordResetToken: { type: String, default: null },
    phone: { type: String },
    picture: { type: String },
    posts: { type: Number },
    postMedia: { type: Number },
    country: { type: String },
    countryFlag: { type: String },
    countrySymbol: { type: String },
    state: { type: String },
    signupIp: { type: String },
    lng: { type: Number },
    lat: { type: Number },
    username: { type: String },
    staffPositions: { type: Array, default: [] },
    staffRanking: { type: Number },
    status: { type: String, default: 'User' },
  },
  {
    timestamps: true,
  }
)
export const User = mongoose.model<IUser>('User', UserSchema)

export interface IDeletedUser extends Document {
  bioUserId: string
  email: string
  username: string
  picture: string
  createdAt: Date
  displayName: string
}

const DeletedUserSchema: Schema = new Schema(
  {
    bioUserId: { type: String, default: '' },
    email: { type: String, default: '' },
    username: { type: String, default: '' },
    picture: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    displayName: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
)

export const DeletedUser = mongoose.model<IDeletedUser>(
  'DeletedUser',
  DeletedUserSchema
)
