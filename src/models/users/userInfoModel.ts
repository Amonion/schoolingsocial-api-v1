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
    passport: { type: String, default: "" },
    gender: { type: String, default: "" },
    maritalStatus: { type: String, default: "" },
    documents: { type: Array, default: [] },

    homeContinent: { type: String, default: "" },
    homeCountry: { type: String, default: "" },
    homeState: { type: String, default: "" },
    homeArea: { type: String, default: "" },
    homeAddress: { type: String, default: "" },
    homeId: { type: String, default: "" },

    continent: { type: String, default: "" },
    country: { type: String, default: "" },
    state: { type: String, default: "" },
    area: { type: String, default: "" },
    address: { type: String, default: "" },
    placeId: { type: String, default: "" },

    currentSchoolContinent: { type: String, default: "" },
    currentSchoolCountry: { type: String, default: "" },
    currentSchoolState: { type: String, default: "" },
    currentSchoolArea: { type: String, default: "" },
    currentSchoolName: { type: String, default: "" },
    currentSchoolId: { type: String, default: "" },
    currentAcademicLevel: { type: String, default: "" },
    currentAcademicLevelName: { type: String, default: "" },
    currentSchoolLevel: { type: String, default: "" },
    currentSchoolPlaceId: { type: String, default: "" },

    pastSchools: { type: String, default: "" },
    pastSchool: { type: Array, default: [] },

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

    dob: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const UserInfo = mongoose.model<IUserInfo>("UserInfo", UserInfoSchema);
