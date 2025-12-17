export interface IAccount extends Document {
  username: string
  userId: string
  displayName: string
  description: string
  media: string
  picture: string
  followers: number
  posts: number
  following: number
  verification: number
  replies: number
  isVerified: boolean
}

export interface IAd extends Document {
  category: string
  picture: string
  name: string
  description: string
  price: number
  duration: number
  postNumber: number
  continent: string
  country: string
  currency: string
  currencySymbol: string
  countrySymbol: string
  placeId: string
  onReview: boolean
  online: boolean
}

export interface IChatData extends Document {
  to: string
  action: string
  receiverId: string
  userId: string
  data: unknown
}
export interface IDeletedUser extends Document {
  email: string
  username: string
  displayName: string
  picture: string
  userId: string
}

export interface IGeneral {
  picture: string
  name: string
  title: string
  content: string
  media: Object
  username: string
  country: string
  state: string
  area: string
  description: string
  type: string
  subject: string
  isVerified: boolean
  currentSchoolCountry: string
  currentSchoolName: string
  countrySymbol: string
}

export interface IPoll extends Document {
  userId: string
  postId: string
  username: string
  pollIndex: number
  createdAt: Date
}

export interface IStat extends Document {
  userId: string
  postId: string
  hated: boolean
  liked: boolean
  bookmarkUserId: string
}

interface ISocialSetObj {
  name: string
  title: string
  allowed: boolean
}

export interface ISubUser extends Document {
  _id: string
  username: string
  email: string
  displayName: string
  intro: string
  phone: string
  picture?: string

  following: number
  followers: number
  posts: number
  interests: number
}

export interface IUpload extends Document {
  username: string
  mediaName: string
  media: string
  userStatus: string
  staffPosition: string
  userId: string
  createdAt: Date
}

export interface IUser extends Document {
  _id: string
  userId: string
  username?: string
  email: string
  displayName: string
  intro: string
  phone: string
  picture?: string
  role?: string
  signupIp?: string
  userStatus?: string
  residentCountry?: string
  postVisibility?: string
  commentAbility?: string
  residentState?: string
  originCountry?: string
  origintState?: string
  signupCountry?: string
  signupCountryFlag?: string
  level: number
  totalAttempts: number
  officeNum: number
  mutes: number
  isDocument: boolean
  isOrigin: boolean
  processingOffice: boolean
  isContact: boolean
  isBio: boolean
  isRelated: boolean
  isOnVerification: boolean
  isVerified: boolean
  isPublic: boolean
  isFollowed: boolean
  isEducationDocument: boolean
  isEducationHistory: boolean
  isEducation: boolean
  isAccountSet: boolean
  isSuspendeded: boolean
  isDeleted: boolean
  isFirstTime: boolean
  online: boolean
  visitedAt: Date
  verifyingAt: Date
  verifiedAt: Date
  leftAt: Date
  createdAt: Date
  passwordResetToken?: string
  password?: string
  passwordExpiresAt?: Date
}

interface IDDocs {
  name: string
  tempDoc: string
  doc: string | File
  docId: string
}

export interface IUserInfo extends Document {
  _id: string
  firstName: string
  middleName: string
  lastName: string
  picture: string
  username: string
  displayName: string
  accountId: string
  intro: string
  dob: string
  gender: string
  examAttempts: number
  maritalStatus: string
  documents: IDDocs[]
  residentCountry: string
  residentState: string
  residentArea: string
  originCountry: string
  origintState: string
  origintArea: string
  phone: string
  notificationToken: string
  email: string
  passport: string
  bioInfo: ISocialSetObj[]
  eduInfo: ISocialSetObj[]
  results: ISocialSetObj[]
  userAccounts: ISubUser[]
  currentAcademicLevelSymbol: string
  isDocument: boolean
  isOrigin: boolean
  isContact: boolean
  isBio: boolean
  isRelated: boolean
  isEducationDocument: boolean
  isEducationHistory: boolean
  isEducation: boolean
  isFinancial: boolean
  isSuspendeded: boolean
  isDeleted: boolean
  isFirstTime: boolean
  isOnVerification: boolean
  isVerified: boolean
  isPublic: boolean
  verifyingAt: Date
  verifiedAt: Date
  createdAt: Date
  passwordResetToken?: string
  password?: string
  passwordExpiresAt?: Date
}

export interface IUserSchoolInfo extends Document {
  displayName: string
  username: string
  picture: string
  media: string
  intro: string
  userId: string

  currentSchoolContinent: string
  currentSchoolCountry: string
  currentSchoolCountryFlag: string
  currentSchoolCountrySymbol: string
  currentSchoolState: string
  currentSchoolPicture: string
  currentSchoolArea: string
  currentSchoolUsername: string
  currentSchoolName: string
  currentSchoolId: string
  currentAcademicLevelSymbol: string
  currentAcademicLevel: string
  currentAcademicLevelName: string
  currentSchoolLevel: string
  currentSchoolPlaceId: string
  currentFaculty: string
  currentFacultyUsername: string
  currentDepartment: string
  currentDepartmentUsername: string
  isSchoolRecorded: boolean

  pastSchools: any[]

  createdAt: Date
}
export interface IUserFinanceInfo extends Document {
  displayName: string
  username: string
  picture: string
  media: string
  intro: string
  userId: string

  accountName: string
  accountNumber: string
  bvn: string
  bankName: string
  bankId: string
  bankUsername: string
  bankLogo: string

  createdAt: Date
}

export interface IUserInterest extends Document {
  userId: string
  interests: string[]
}

export interface SectionSettings {
  government: boolean
  institution: boolean
  single: boolean
  company: boolean
}

export interface IUserSettings {
  username?: string
  userId: string
  bioInfo: SectionSettings
  originInfo: SectionSettings
  residentialInfo: SectionSettings
  relatedInfo: SectionSettings
  documentInfo: SectionSettings
  createdAt?: Date
  updatedAt?: Date
}

interface File {
  name: string
  data: string
  type: string
}

export interface Socket {
  sender: IUser
  to: string
  type: string
  postId: string
  content: string
  createdAt: Date
  media: File[]
  types: string[]
}
export interface IWallet extends Document {
  username: string
  userId: string
  bioId: string
  picture: string
  balance: number
  spent: number
  received: number

  country: string
  countryFlag: string
  countrySymbol: string
  currency: string
  currencySymbol: string
  createdAt: Date
}
