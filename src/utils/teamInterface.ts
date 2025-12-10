export interface IAdCategory extends Document {
  _id: string
  name: string
  price: number
  distribution: string
  picture: string
  duration: number
  description: string
  createdAt: number
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

export interface IExam extends Document {
  title: string
  instruction: string
  country: string
  subtitle: string
  name: string
  picture: string
  logo: string
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
export interface IOffice extends Document {
  name: string
  username: string
  type: string
  levels: []
  owenrName: string
  ownerUsername: string
  ownerPicture: string
  email: string
  phone: string
  userId: string
  bioId: string
  country: string
  state: string
  area: string
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

export interface ITransaction extends Document {
  name: string
  title: string
  amount: number
  charge: number
  logo: string
  description: string
  country: string
  countryFlag: string
  countrySymbol: string
  currency: string
  currencySymbol: string
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

export interface IUserData {
  ip: string
  bioUserId: string
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
