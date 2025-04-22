import mongoose, { Schema } from "mongoose";
import { IUserInfo } from "../../utils/userInterface";

const UserInfoSchema: Schema = new Schema(
  {
    firstName: { type: String, default: "" },
    middleName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    displayName: { type: String, default: "" },
    username: { type: String, default: "" },
    picture: { type: String, default: "" },
    intro: { type: String, default: "" },
    accountId: { type: String, default: "" },
    passport: { type: String, default: "" },
    gender: { type: String, default: "" },
    maritalStatus: { type: String, default: "" },
    documents: { type: Array, default: [] },

    homeContinent: { type: String, default: "" },
    homeCountry: { type: String, default: "" },
    homeCountrySymbol: { type: String, default: "" },
    homeState: { type: String, default: "" },
    homeArea: { type: String, default: "" },
    homeAddress: { type: String, default: "" },
    homeId: { type: String, default: "" },
    phone: { type: String, default: "" },
    email: { type: String, default: "" },

    continent: { type: String, default: "" },
    country: { type: String, default: "" },
    countrySymbol: { type: String, default: "" },
    state: { type: String, default: "" },
    area: { type: String, default: "" },
    address: { type: String, default: "" },
    placeId: { type: String, default: "" },

    currentSchoolContinent: { type: String, default: "" },
    currentSchoolCountry: { type: String, default: "" },
    currentSchoolCountryFlag: { type: String, default: "" },
    currentSchoolCountrySymbol: { type: String, default: "" },
    currentSchoolState: { type: String, default: "" },
    currentSchoolPicture: { type: String, default: "" },
    currentSchoolArea: { type: String, default: "" },
    currentSchoolName: { type: String, default: "" },
    currentSchoolId: { type: String, default: "" },
    currentAcademicLevelSymbol: { type: String, default: "" },
    currentAcademicLevel: { type: String, default: "" },
    currentAcademicLevelName: { type: String, default: "" },
    currentSchoolLevel: { type: String, default: "" },
    currentSchoolPlaceId: { type: String, default: "" },
    currentFaculty: { type: String, default: "" },
    currentFacultyUsername: { type: String, default: "" },
    currentDepartment: { type: String, default: "" },
    currentDepartmentUsername: { type: String, default: "" },

    pastSchools: { type: Array, default: [] },

    accountName: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    bvn: { type: String, default: "" },
    bankName: { type: String, default: "" },
    bankId: { type: String, default: "" },
    bankUsername: { type: String, default: "" },
    bankLogo: { type: String, default: "" },

    motherName: { type: String, default: "" },
    occupation: { type: String, default: "" },
    nextKin: { type: String, default: "" },
    nextKinPhone: { type: String, default: "" },
    isOnVerification: { type: Boolean, default: false },
    isSchoolRecorded: { type: Boolean, default: false },
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
