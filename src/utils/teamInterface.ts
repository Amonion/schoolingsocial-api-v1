export interface IAcademicLevel extends Document {
  country: string
  countryFlag: string
  placeId: string
  level: number
  maxLevel: number
  levelName: string
  section: string
  subsection: string
  institution: string
  certificate: string
  certificateName: string
  description: string
  createdAt: Date
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
  isChecked?: boolean
  isActive?: boolean
}

export interface IBank extends Document {
  category: string
  picture: string
  name: string
  description: string
  username: string
  continent: string
  country: string
  countryFlag: string
  placeId: string
}

export interface ICompany extends Document {
  name: string
  domain: string
  email: string
  documents: string
  finalInstruction: string
  phone: string
  allowSignup: boolean
  headqauters: string
  newVersion: string
  newVersionLink: string
  createdAt: Date
}

export interface ICourse extends Document {
  schoolId: string
  facultyId: string
  level: number
  semester: number
  courseCode: string
  load: number
  departmentId: number
  department: string
  name: string
  picture: string
  media: string
  description: string
  isChecked?: boolean
  isActive?: boolean
}

export interface IDepartment extends Document {
  period: number
  facultyId: number
  schoolId: number
  school: string
  faculty: string
  name: string
  username: string
  profilePicture: string
  media: string
  description: string
}

export interface IDocument extends Document {
  picture: string
  name: string
  description: string
  country: string
  countryFlag: string
  placeId: string
  required: boolean
  createdAt: Date
}

export interface IEmail extends Document {
  content: string
  picture: string
  title: string
  greetings: string
  name: string
  note: string
  createdAt: Date
}

export interface IExam extends Document {
  title: string
  instruction: string
  country: string
  subtitle: string
  name: string
  picture: string
  username: string
  subjects: string
  continent: string
  type: string
  randomize: boolean
  simultaneous: boolean
  showResult: boolean
  state: string
  stateId: number
  publishedAt: Date
  duration: number
  questionsPerPage: number
  optionsPerQuestion: number
  questions: number
  status: string
  createdAt: Date
  questionDate: Date
}

export interface IExpenses extends Document {
  name: string
  amount: number
  receipt: string
  description: string
  createdAt: Date
}

export interface IFaculty extends Document {
  schoolId: string
  school: string
  name: string
  username: string
  picture: string
  media: string
  description: string
  createdAt: Date
}

export interface IInterest extends Document {
  name: string
  rank: number
}

export interface ILeague extends Document {
  title: string
  instruction: string
  country: string
  schools: string
  students: string
  continent: string
  level: string
  price: number
  media: string
  picture: string
  state: string
  placeId: string
  publishedAt: Date
  endAt: Date
  subjects: string[]
  createdAt: Date
}

export interface INews extends Document {
  placeId: string
  title: string
  content: string
  author: string
  publishedAt: Date | null | string
  status: string
  state: string
  level: string
  country: string
  interests: number
  saves: number
  likes: number
  comments: number
  tags: string
  continent: string
  picture: string
  video: string
  videoUrl: string
  category: string
  subtitle: string
  source: string
  isFeatured: boolean
  seoTitle: string
  seoDescription: string
}

export interface INotification extends Document {
  content: string
  greetings: string
  title: string
  name: string
  createdAt: Date
}

export interface IObjective extends Document {
  _id: string
  index: number
  isClicked: boolean
  paperId: string
  leagueId: string
  question: string
  options: IOption[]
  createdAt: Date
}

export interface IOption {
  index: number
  value: string
  isSelected: boolean
  isClicked: boolean
}

export interface IPayment extends Document {
  name: string
  amount: number
  charge: number
  logo: string
  description: string
  placeId: string
  country: string
  countryFlag: string
  countrySymbol: string
  currency: string
  currencySymbol: string
  createdAt: Date
}

export interface IPlace extends Document {
  continent: string
  country: string
  countryCapital: string
  state: string
  area: string
  landmark: string
  zipCode: string
  countryCode: string
  countryFlag: string
  stateCapital: string
  stateLogo: string
  countrySymbol: string
  currency: string
  currencySymbol: string
  createdAt: Date
}

export interface IPaper extends Document {
  title: string
  instruction: string
  country: string
  subtitle: string
  continent: string
  type: string
  randomize: boolean
  simultaneous: boolean
  showResult: boolean
  state: string
  placeId: string
  publishedAt: Date
  duration: number
  questionsPerPage: number
  optionsPerQuestion: number
  status: string
  createdAt: Date
}

export interface IPosition extends Document {
  level: number
  position: string
  duties: string
  region: string
  salary: number
  role: string
  createdAt: Date
}

export interface ISocketData {
  to: string
  action: string
  type: string
  postId: string
  data: IUserData
  content: string
  createdAt: Date
  media: File[]
  types: string[]
}

export interface ISchool extends Document {
  country: string
  state: string
  area: string
  name: string
  levels: string
  levelNames: []
  username: string
  type: string
  logo: string
  media: string
  picture: string
  continent: string
  landmark: string
  countryFlag: string
  longitude: number
  latitude: number
  isVerified: boolean
  isNew: boolean
  isRecorded: boolean
}

export interface ISchoolPayment extends Document {
  name: string
  amount: number
  charge: number
  schoolLogo: string
  school: string
  schoolId: string
  description: string
  placeId: string
  country: string
  countryFlag: string
  countrySymbol: string
  currency: string
  currencySymbol: string
  createdAt: Date
}

export interface ISms extends Document {
  content: string
  name: string
  createdAt: Date
}

export interface IStaff extends Document {
  userId: string
  areaId: string
  salary: number
  level: number
  username: string
  picture: string
  email: string
  phone: string
  position: string
  role: string
  area: string
  state: string
  country: string
  continent: string
  isActive: boolean
  createdAt: Date
}

export interface IUserData {
  ip: string
  bioId: string
  country: string
  countryCode: string
  online: boolean
  userId: string
  username: string
  leftAt: Date
  visitedAt: Date
}

export interface IWeekend extends Document {
  title: string
  instruction: string
  country: string
  videoUrl: string
  continent: string
  levels: string
  answer: string
  price: number
  video: string
  picture: string
  state: string
  placeId: number
  publishedAt: Date
  duration: number
  status: string
  category: string
  createdAt: Date
}

export interface IPolicy extends Document {
  _id: string
  name: string
  title: string
  content: string
  category: string
  createdAt: Date
}
