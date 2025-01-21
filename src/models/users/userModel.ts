import mongoose, { Schema } from "mongoose";
import { IUser } from "../../utils/userInterface";

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "A user with this email already exists"],
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },
    username: {
      type: String,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10,15}$/, "Phone number must be between 10 and 15 digits"],
      unique: [true, "A user with this phone number already exists"],
    },
    picture: { type: String, default: "" },
    displayName: { type: String, default: "" },
    role: { type: String, default: null },
    signupIp: { type: String, default: "" },
    interests: { type: Array, default: [] },
    userStatus: { type: String, default: "User" },
    staffPositions: { type: String, default: "" },
    residentCountry: { type: String, default: "" },
    postVisibility: { type: String, default: "" },
    commentAbility: { type: String, default: "" },
    residentState: { type: String, default: "" },
    originCountry: { type: String, default: "" },
    origintState: { type: String, default: "" },
    signupCountry: { type: String, default: "" },
    signupCountryFlag: { type: String, default: "" },
    level: { type: Number, default: 1 },
    isDocument: { type: Boolean, default: false },
    isOrigin: { type: Boolean, default: false },
    isContact: { type: Boolean, default: false },
    isBio: { type: Boolean, default: false },
    isEducationDocument: { type: Boolean, default: false },
    isEducationHistory: { type: Boolean, default: false },
    isEducation: { type: Boolean, default: false },
    isFinancial: { type: Boolean, default: false },
    isSuspendeded: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isFirstTime: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    passwordResetToken: { type: String, default: null },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    passwordExpiresAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", UserSchema);
