import mongoose, { Schema } from "mongoose";
import {
  IUserInfo,
  IUserSchoolInfo,
  IUserFinanceInfo,
} from "../../utils/userInterface";

const UserInfoSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "A user with this email already exists"],
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    firstName: { type: String, default: "" },
    middleName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    displayName: { type: String, default: "" },
    username: { type: String, default: "" },
    picture: { type: String, default: "" },
    media: { type: String, default: "" },
    intro: { type: String, default: "" },
    passport: { type: String, default: "" },
    gender: { type: String, default: "" },
    maritalStatus: { type: String, default: "" },
    documents: { type: Array, default: [] },
    signupIp: { type: String, default: "" },

    homeContinent: { type: String, default: "" },
    homeCountry: { type: String, default: "" },
    homeCountrySymbol: { type: String, default: "" },
    homeState: { type: String, default: "" },
    homeArea: { type: String, default: "" },
    homeAddress: { type: String, default: "" },
    homeId: { type: String, default: "" },
    userStatus: { type: String, default: "User" },

    phone: { type: String, default: "" },
    continent: { type: String, default: "" },
    country: { type: String, default: "" },
    countrySymbol: { type: String, default: "" },
    state: { type: String, default: "" },
    area: { type: String, default: "" },
    address: { type: String, default: "" },
    placeId: { type: String, default: "" },
    examAttempts: { type: Number, default: 0 },

    bioInfo: {
      type: Array,
      default: [
        {
          title: "Your Government",
          name: "government",
          allowed: true,
        },
        {
          title: "Your School",
          name: "school",
          allowed: true,
        },
        {
          title: "Applied Institution",
          name: "apply",
          allowed: true,
        },
        {
          title: "Authorized Friends",
          name: "authorized",
          allowed: true,
        },
      ],
    },
    eduInfo: {
      type: Array,
      default: [
        {
          title: "Your Government",
          name: "government",
          allowed: true,
        },
        {
          title: "Your School",
          name: "school",
          allowed: true,
        },
        {
          title: "Applied Institution",
          name: "apply",
          allowed: true,
        },
        {
          title: "Authorized Friends",
          name: "authorized",
          allowed: true,
        },
      ],
    },
    result: {
      type: Array,
      default: [
        {
          title: "Your Government",
          name: "government",
          allowed: true,
        },
        {
          title: "Your School",
          name: "school",
          allowed: true,
        },
        {
          title: "Applied Institution",
          name: "apply",
          allowed: true,
        },
        {
          title: "Authorized Friends",
          name: "authorized",
          allowed: true,
        },
      ],
    },
    motherName: { type: String, default: "" },
    occupation: { type: String, default: "" },
    nextKin: { type: String, default: "" },
    nextKinPhone: { type: String, default: "" },
    operatingSystem: { type: String, default: "" },
    isOnVerification: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    inSchool: { type: Boolean, default: false },
    isPublic: { type: Boolean, default: false },
    verifyingAt: { type: Date, default: null },
    verifiedAt: { type: Date, default: Date.now },
    dob: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const UserInfo = mongoose.model<IUserInfo>("UserInfo", UserInfoSchema);

const UserSchoolInfoSchema: Schema = new Schema(
  {
    displayName: { type: String, default: "" },
    username: { type: String, default: "" },
    picture: { type: String, default: "" },
    media: { type: String, default: "" },
    intro: { type: String, default: "" },
    userId: { type: String, default: "" },

    currentSchoolContinent: { type: String, default: "" },
    currentSchoolCountry: { type: String, default: "" },
    currentSchoolCountryFlag: { type: String, default: "" },
    currentSchoolCountrySymbol: { type: String, default: "" },
    currentSchoolLogo: { type: String, default: "" },
    currentSchoolState: { type: String, default: "" },
    currentSchoolPicture: { type: String, default: "" },
    currentSchoolArea: { type: String, default: "" },
    currentSchoolUsername: { type: String, default: "" },
    currentSchoolName: { type: String, default: "" },
    currentSchoolId: { type: String, default: "" },
    currentAcademicLevelSymbol: { type: String, default: "" },
    currentAcademicLevel: { type: Object, default: {} },
    currentAcademicLevelName: { type: String, default: "" },
    currentSchoolLevel: { type: String, default: "" },
    currentSchoolPlaceId: { type: String, default: "" },
    currentFaculty: { type: String, default: "" },
    currentFacultyId: { type: String, default: "" },
    currentFacultyUsername: { type: String, default: "" },
    currentDepartment: { type: String, default: "" },
    currentDepartmentId: { type: String, default: "" },
    currentDepartmentUsername: { type: String, default: "" },
    isSchoolRecorded: { type: Boolean, default: false },
    inSchool: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    pastSchools: { type: Array, default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const UserSchoolInfo = mongoose.model<IUserSchoolInfo>(
  "UserSchoolInfo",
  UserSchoolInfoSchema
);

const UserFinanceInfoSchema: Schema = new Schema(
  {
    displayName: { type: String, default: "" },
    username: { type: String, default: "" },
    picture: { type: String, default: "" },
    media: { type: String, default: "" },
    intro: { type: String, default: "" },
    userId: { type: String, default: "" },

    accountName: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    bvn: { type: String, default: "" },
    bankName: { type: String, default: "" },
    bankId: { type: String, default: "" },
    bankUsername: { type: String, default: "" },
    bankLogo: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const UserFinanceInfo = mongoose.model<IUserFinanceInfo>(
  "UserFinanceInfo",
  UserFinanceInfoSchema
);
