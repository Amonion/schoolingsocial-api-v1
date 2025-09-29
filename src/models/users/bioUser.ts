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
  signupLocation: {}
  signupIp: string
}

const BioUserSchema: Schema = new Schema(
  {
    authorityName: { type: String, default: '' },
    authorityLevel: { type: Number, default: 0 },
    bioUserDisplayName: { type: String, default: '' },
    bioUserIntro: { type: String, default: '' },
    bioUserMedia: { type: String, default: '' },
    bioUserPicture: { type: String, default: '' },
    bioUserUsername: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    dateOfBirth: { type: Date, default: null },
    documents: { type: Array, default: [] },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'A user with this email already exists'],
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    firstName: { type: String, default: '' },
    gender: { type: String, default: '' },
    homeAddress: { type: String, default: '' },
    homeArea: { type: String, default: '' },
    homeContinent: { type: String, default: '' },
    homeCountry: { type: String, default: '' },
    homeCountrySymbol: { type: String, default: '' },
    homePlaceId: { type: String, default: '' },
    homeState: { type: String, default: '' },
    isVerified: { type: Boolean, default: false },
    lastName: { type: String, default: '' },
    maritalStatus: { type: String, default: '' },
    middleName: { type: String, default: '' },
    motherName: { type: String, default: '' },
    nextKinName: { type: String, default: '' },
    nextKinPhoneNumber: { type: String, default: '' },
    notificationToken: { type: String, default: '' },
    occupation: { type: String, default: '' },
    passport: { type: String, default: '' },
    phone: { type: String, default: '' },
    residentAddress: { type: String, default: '' },
    residentArea: { type: String, default: '' },
    residentContinent: { type: String, default: '' },
    residentCountry: { type: String, default: '' },
    residentCountrySymbol: { type: String, default: '' },
    residentPlaceId: { type: String, default: '' },
    residentState: { type: String, default: '' },
    signupCountry: { type: Object, default: {} },
    signupLocation: { type: Object, default: {} },
    signupDevice: { type: String, default: '' },
    signupIp: { type: String, default: '' },
    signupOS: { type: String, default: '' },
    verificationLocation: { type: Object, default: {} },
  },
  {
    timestamps: true,
  }
)

export const BioUser = mongoose.model<IBioUser>('BioUser', BioUserSchema)
