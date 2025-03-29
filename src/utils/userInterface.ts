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

export interface IFollower extends Document {
  userId: string;
  followersId: string[];
  followingId: string[];
}

export interface IGeneral {
  picture: string;
  name: string;
  title: string;
  username: string;
  type: string;
  id: string;
}

export interface IStat extends Document {
  userId: string;
  postId: string;
}

interface Media {
  source: string;
  type: string;
}

interface Poll {
  picture: string;
  text: string;
  index: number;
  percent: number;
}

export interface IPost extends Document {
  _id: string;
  postId: string;
  createdAt: Date;
  username: string;
  userId: string;
  sender: IUser;
  postType: string;
  displayName: string;
  content: string;
  postCountry: string;
  media: Media[];
  polls: Poll[];
  users: string[];
  picture: string;
  country: string;
  liked: boolean;
  bookmarked: boolean;
  viewed: boolean;
  isVerified: boolean;
  shares: number;
  replies: number;
  score: number;
  trendScore: number;
  views: number;
  bookmarks: number;
  likes: number;
  reposts: number;
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
  userId?: string;
  username?: string;
  email: string;
  displayName: string;
  intro: string;
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
  isRelated: boolean;
  isVerified: boolean;
  isEducationDocument: boolean;
  isEducationHistory: boolean;
  isEducation: boolean;
  isAccountSet: boolean;
  isSuspendeded: boolean;
  isDeleted: boolean;
  isFirstTime: boolean;
  createdAt: Date;
  passwordResetToken?: string;
  password?: string;
  passwordExpiresAt?: Date;
}

interface IDDocs {
  name: string;
  tempDoc: string;
  doc: string | File;
  docId: string;
}

export interface IUserInfo extends Document {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  picture: string;
  username: string;
  displayName: string;
  intro: string;
  dob: string;
  gender: string;
  maritalStatus: string;
  documents: IDDocs[];
  residentCountry: string;
  residentState: string;
  residentArea: string;
  originCountry: string;
  origintState: string;
  origintArea: string;
  phone: string;
  email: string;
  passport: string;
  currentAcademicLevelSymbol: string;
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

export interface IUserNotification extends Document {
  _id: string;
  content: string;
  title: string;
  username: string;
  userId: string;
  unread: boolean;
  createdAt: Date;
}

export interface IUserInterest extends Document {
  userId: string;
  interests: string[];
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
