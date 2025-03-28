import mongoose, { Schema } from "mongoose";
import { IAcademicLevel } from "../../utils/teamInterface";

const AcademicLevelSchema: Schema = new Schema(
  {
    certificate: { type: String, default: "" },
    certificateName: { type: String, default: "" },
    level: { type: Number, default: 0 },
    maxLevel: { type: Number, default: 0 },
    maxLevelName: { type: String, default: "" },
    levelName: { type: String, default: "" },
    institution: { type: String, default: "" },
    country: { type: String, default: "" },
    placeId: { type: String, default: "" },
    countryFlag: { type: String, default: "" },
    description: { type: String, default: "" },
    inSchool: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const AcademicLevel = mongoose.model<IAcademicLevel>(
  "AcademicLevel",
  AcademicLevelSchema
);
