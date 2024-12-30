import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../../utils/userInterface";
// Define an interface for the User document

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
      required: [true, "Username is required"],
      unique: [true, "A user with this username already exists"],
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [50, "Username cannot exceed 50 characters"],
    },
    phone: {
      type: String,
      match: [/^\d{10,15}$/, "Phone number must be between 10 and 15 digits"],
    },
    picture: { type: String, default: "" },
    role: { type: String, default: null },
    signupIp: { type: String, default: "" },
    userStatus: { type: String, default: "User" },
    residentCountry: { type: String, default: "" },
    postVisibility: { type: String, default: "" },
    commentAbility: { type: String, default: "" },
    residentState: { type: String, default: "" },
    originCountry: { type: String, default: "" },
    origintState: { type: String, default: "" },
    signupCountry: { type: String, default: "" },
    signupCountryFlag: { type: String, default: "" },
    level: { type: Number, default: 11 },
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
    isFirstTime: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    passwordResetToken: { type: String, default: null },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    passwordExpiresAt: { type: Date, default: null },
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt
  }
);

export const User = mongoose.model<IUser>("User", UserSchema);
