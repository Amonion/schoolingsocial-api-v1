import mongoose, { Schema } from "mongoose";
import { ISchool } from "../../utils/teamInterface";

const SchoolSchema: Schema = new Schema(
  {
    longitude: { type: Number, default: 0.0 },
    latitude: { type: Number, default: 0.0 },
    logo: { type: String },
    types: { type: Array },
    typesIds: { type: Array },
    maxLevels: { type: Array },
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
