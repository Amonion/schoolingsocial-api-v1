import mongoose, { Schema } from "mongoose";
import { IPlace } from "../../utils/teamInterface";

const PlaceSchema: Schema = new Schema(
  {
    landmark: { type: String, default: "" },
    area: { type: String },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    continent: { type: String, default: "" },
    countryFlag: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    countryCode: { type: String, default: "" },
    countrySymbol: { type: String, default: "" },
    currency: { type: String, default: "" },
    currencySymbol: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt
  }
);

export const Place = mongoose.model<IPlace>("Place", PlaceSchema);
