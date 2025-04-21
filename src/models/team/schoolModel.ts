import mongoose, { Schema } from "mongoose";
import {
  ISchool,
  ISchoolPayment,
  IFaculty,
  IDepartment,
  ICourse,
} from "../../utils/teamInterface";

const SchoolSchema: Schema = new Schema(
  {
    longitude: { type: Number, default: 0.0 },
    latitude: { type: Number, default: 0.0 },
    resultPointSystem: { type: Number, default: 0.0 },
    logo: { type: String },
    levels: { type: Array },
    institutions: { type: Array, default: [] },
    name: { type: String, default: "" },
    username: { type: String, default: "" },
    area: { type: String, default: "" },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    continent: { type: String, default: "" },
    placeId: { type: String, default: "" },
    countryFlag: { type: String, default: "" },
    description: { type: String, default: "" },
    media: { type: String, default: "" },
    picture: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const School = mongoose.model<ISchool>("School", SchoolSchema);

const SchoolPaymentSchema: Schema = new Schema(
  {
    amount: { type: Number, default: 0.0 },
    charge: { type: Number, default: 0.0 },
    schoolLogo: { type: String },
    school: { type: String },
    name: { type: String, default: "" },
    schoolId: { type: String, default: "" },
    currency: { type: String, default: "" },
    currencySymbol: { type: String, default: "" },
    country: { type: String, default: "" },
    countrySymbol: { type: String, default: "" },
    placeId: { type: String, default: "" },
    countryFlag: { type: String, default: "" },
    description: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const SchoolPayment = mongoose.model<ISchoolPayment>(
  "SchoolPayment",
  SchoolPaymentSchema
);

const FacultySchema: Schema = new Schema(
  {
    schoolId: { type: String },
    school: { type: String },
    schoolUsername: { type: String },
    name: { type: String, default: "" },
    username: { type: String, default: "" },
    picture: { type: String, default: "" },
    media: { type: String, default: "" },
    description: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const Faculty = mongoose.model<IFaculty>("Faculty", FacultySchema);

const DepartmentSchema: Schema = new Schema(
  {
    period: { type: Number },
    schoolId: { type: String },
    facultyId: { type: String },
    faculty: { type: String },
    facultyUsername: { type: String },
    name: { type: String, default: "" },
    username: { type: String, default: "" },
    picture: { type: String, default: "" },
    media: { type: String, default: "" },
    description: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Department = mongoose.model<IDepartment>(
  "Department",
  DepartmentSchema
);

const CourseSchema: Schema = new Schema(
  {
    level: { type: Number },
    semester: { type: Number },
    load: { type: Number },
    facultyId: { type: String },
    schoolId: { type: String },
    departmentId: { type: String },
    department: { type: String },
    name: { type: String, default: "" },
    courseCode: { type: String, default: "" },
    picture: { type: String, default: "" },
    media: { type: String, default: "" },
    description: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const Course = mongoose.model<ICourse>("Course", CourseSchema);
