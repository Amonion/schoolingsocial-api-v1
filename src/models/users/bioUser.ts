import mongoose, { Schema } from 'mongoose'

interface IDDocs {
  name: string
  tempDoc: string
  doc: string | File
  docId: string
}

export interface IBioUser extends Document {
  _id: string
  authorityName: string
  authorityLevel: string
  bioUserDisplayName: string
  bioUserIntro: string
  bioUserMedia: string
  bioUserPicture: string
  bioUserUsername: string
  createdAt: Date
  dateOfBirth: Date
  documents: IDDocs[]
  email: string
  firstName: string
  gender: string
  homeAddress: string
  homeArea: string
  homeContinent: string
  homeCountry: string
  homeCountrySymbol: string
  homePlaceId: string
  homeState: string
  isVerified: boolean
  lastName: string
  maritalStatus: string
  middleName: string
  motherName: string
  nextKinName: string
  nextKinPhoneNumber: string
  notificationToken: string
  occupation: string
  passport: string
  phone: string
  residentAddress: string
  residentArea: string
  residentContinent: string
  residentCountry: string
  residentCountrySymbol: string
  residentPlaceId: string
  residentState: string
  lng: number
  lat: number
  signupIp: string
}

const BioUserSchema: Schema = new Schema(
  {
    authorityName: { type: String },
    authorityLevel: { type: Number, default: 0 },
    bioUserDisplayName: { type: String },
    bioUserIntro: { type: String },
    bioUserMedia: { type: String },
    bioUserPicture: { type: String },
    bioUserUsername: { type: String },
    createdAt: { type: Date, default: Date.now },
    dateOfBirth: { type: Date },
    documents: { type: Array },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'A user with this email already exists'],
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    firstName: { type: String },
    gender: { type: String },
    homeAddress: { type: String },
    homeArea: { type: String },
    homeContinent: { type: String },
    homeCountry: { type: String },
    homeCountrySymbol: { type: String },
    homePlaceId: { type: String },
    homeState: { type: String },
    isVerified: { type: Boolean, default: false },
    lastName: { type: String },
    maritalStatus: { type: String },
    middleName: { type: String },
    motherName: { type: String },
    nextKinName: { type: String },
    nextKinPhoneNumber: { type: String },
    notificationToken: { type: String },
    occupation: { type: String },
    passport: { type: String },
    phone: { type: String },
    residentAddress: { type: String },
    residentArea: { type: String },
    residentContinent: { type: String },
    residentCountry: { type: String },
    residentCountrySymbol: { type: String },
    residentPlaceId: { type: String },
    residentState: { type: String },
    signupCountry: { type: String },
    signupDevice: { type: String },
    signupIp: { type: String },
    signupOS: { type: String },
    lng: { type: Number },
    lat: { type: Number },
  },
  {
    timestamps: true,
  }
)

export const BioUser = mongoose.model<IBioUser>('BioUser', BioUserSchema)
