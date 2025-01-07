import mongoose, { Schema } from "mongoose";
import { IAcademicLevel } from "../../utils/teamInterface";

const AcademicLevelSchema: Schema = new Schema(
  {
    certificate: { type: String, default: "" },
    certificateName: { type: String, default: "" },
    level: { type: Number, default: 0 },
    maxLevel: { type: Number, default: 0 },
    levelName: { type: String, default: "" },
    country: { type: String, default: "" },
    placeId: { type: String, default: "" },
    countryFlag: { type: String, default: "" },
    description: { type: String, default: "" },
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
