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

export interface IChat extends Document {
  _id: string;
  content: string;
  userId: string;
  action: string;
  username: string;
  picture: string;
  media: [
    {
      source: string;
      name: string;
      duration: number;
      size: number;
    }
  ];
  connection: string;
  senderTime: Date;
  receiverTime: Date;
  createdAt: Date;
  time: number;
  receiverUsername: string;
  receiverPicture: string;
  receiverId: string;
  isPinned: boolean;
  isRead: boolean;
  isFriends: boolean;
  received: boolean;
  senderId: string;
}

export interface IFollower extends Document {
  userId: string;
  username: string;
  picture: string;
  followerId: string;
  followerUsername: string;
  followerPicture: string;
  postId: string;
}

export interface IGeneral {
  picture: string;
  name: string;
  title: string;
  content: string;
  media: Object;
  username: string;
  country: string;
  state: string;
  area: string;
  description: string;
  type: string;
  subject: string;
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

interface Option {
  index: number;
  value: string;
  isSelected: boolean;
  isClicked: boolean;
}

interface Poll {
  picture: string;
  text: string;
  index: number;
  percent: number;
}

export interface IParticipant extends Document {
  _id: string;
  userId: string;
  paperId: string;
  isClicked: boolean;
  question: string;
  options: Option[];
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
  followed: boolean;
  muted: boolean;
  liked: boolean;
  bookmarked: boolean;
  viewed: boolean;
  isVerified: boolean;
  shares: number;
  followers: number;
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
  isFollowed: boolean;
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
  accountId: string;
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

export interface IUserTestExam extends Document {
  username: string;
  userId: string;
  picture: string;
  paperId: string;
  name: string;
  title: string;
  type: string;
  instruction: string;
  questions: number;
  duration: number;
  rate: number;
  accuracy: number;
  metric: number;
  attempts: number;
  totalAnswered: number;
  totalCorrectAnswer: number;
}
export interface IUserTest extends Document {
  _id: string;
  userId: string;
  paperId: string;
  isClicked: boolean;
  question: string;
  options: Option[];
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
