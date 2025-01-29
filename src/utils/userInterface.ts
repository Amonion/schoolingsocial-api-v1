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

export interface IUser extends Document {
  username?: string;
  email: string;
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
