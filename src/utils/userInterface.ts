export interface IAccount extends Document {
  username: string;
  userId: string;
  displayName: string;
  description: string;
  media: string;
  picture: string;
  followers: number;
  posts: number;
  following: number;
  verification: number;
  replies: number;
  isVerified: boolean;
}

export interface IStat extends Document {
  userId: string;
  postId: string;
}

interface Media {
  source: string;
  type: string;
}

export interface IPost extends Document {
  postId: string;
  createdAt: Date;
  username: string;
  userId: string;
  sender: IUser;
  postType: string;
  displayName: string;
  content: string;
  media: Media[];
  picture: string;
  country: string;
  isVerified: boolean;
  shares: number;
  replies: number;
  views: number;
  likes: number;
  repost: number;
}

export interface IUpload extends Document {
  username: string;
  mediaName: string;
  media: string;
  userStatus: string;
  staffPosition: string;
  userId: string;
  createdAt: Date;
}

export interface IUser extends Document {
  _id?: string;
  username?: string;
  email: string;
  displayName: string;
  phone: string;
  picture?: string;
  role?: string;
  signupIp?: string;
  userStatus?: string;
  residentCountry?: string;
  postVisibility?: string;
  commentAbility?: string;
  residentState?: string;
  originCountry?: string;
  origintState?: string;
  signupCountry?: string;
  signupCountryFlag?: string;
  level: number;
  isDocument: boolean;
  isOrigin: boolean;
  isContact: boolean;
  isBio: boolean;
  isVerified: boolean;
  isEducationDocument: boolean;
  isEducationHistory: boolean;
  isEducation: boolean;
  isFinancial: boolean;
  isSuspendeded: boolean;
  isDeleted: boolean;
  isFirstTime: boolean;
  createdAt: Date;
  passwordResetToken?: string;
  password?: string;
  passwordExpiresAt?: Date;
}

export interface IUserInfo extends Document {
  userId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  residentCountry: string;
  residentState: string;
  residentArea: string;
  originCountry: string;
  origintState: string;
  origintArea: string;
  phone: string;
  email: string;
  passport: string;
  isDocument: boolean;
  isOrigin: boolean;
  isContact: boolean;
  isBio: boolean;
  isRelated: boolean;
  isEducationDocument: boolean;
  isEducationHistory: boolean;
  isEducation: boolean;
  isFinancial: boolean;
  isSuspendeded: boolean;
  isDeleted: boolean;
  isFirstTime: boolean;
  createdAt: Date;
  passwordResetToken?: string;
  password?: string;
  passwordExpiresAt?: Date;
}

export interface IUserInterest extends Document {
  userId: string;
  interests: string[];
}

export interface IFollower extends Document {
  userId: string;
  followersId: string[];
  followingId: string[];
}

interface File {
  name: string;
  data: string;
  type: string;
}

export interface Socket {
  sender: IUser;
  to: string;
  type: string;
  postId: string;
  content: string;
  createdAt: Date;
  media: File[];
  types: string[];
}
