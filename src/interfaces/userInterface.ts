interface Location {
  lat: number
  lng: number
}

export interface IAuthUser extends Document {
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
  signedUplocation: Location
  username: string
  status: string
}

export interface IBioUserBank extends Document {
  accountName: string
  accountNumber: string
  bankId: string
  bankName: string
  bankLogo: string
  bankUsername: string
  bioUserDisplayName: string
  bioUserId: string
  bioUserIntro: string
  bioUserMedia: string
  bioUserPicture: string
  bioUserUsername: string
  bvn: string
  createdAt: Date
}

export interface IUserWallet extends Document {
  balance: 0
  bioUserId: string
  country: string
  countryFlag: string
  countrySymbol: string
  currency: string
  currencySymbol: string
  createdAt: Date
  picture: string
  received: 0
  spent: 0
  username: string
  userId: string
}
