import mongoose, { Schema } from 'mongoose'

export interface IUser extends Document {
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
  isVerified: boolean
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
  signupCountry: string
  signupIp: string
  signupLocation: object
  username: string
  staffPositions: string[]
  staffRanking: number
  status: string
}

const UserSchema: Schema = new Schema(
  {
    active: { type: Boolean, default: false },
    bioUserId: { type: String, default: '' },
    bioUserUsername: { type: String, default: '' },
    comments: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    displayName: { type: String, default: '' },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'A user with this email already exists'],
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
      lowercase: true,
    },
    exams: { type: Number, default: 0 },
    followers: { type: Number, default: 0 },
    followings: { type: Number, default: 0 },
    intro: { type: String, default: '' },
    isFirstTime: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    media: { type: String, default: '' },
    officeNum: { type: Number, default: 0 },
    online: { type: Boolean, default: true },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
    passwordExpiresAt: { type: Date, default: null },
    passwordResetToken: { type: String, default: null },
    phone: { type: String, default: '' },
    picture: { type: String, default: '' },
    posts: { type: Number, default: 0 },
    signupCountry: { type: String, default: '' },
    signupIp: { type: String, default: '' },
    signupLocation: { type: Object, default: {} },
    username: { type: String },
    staffPositions: { type: Array, default: [] },
    staffRanking: { type: Number, default: 0 },
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
