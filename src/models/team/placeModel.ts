import mongoose, { Schema } from "mongoose";
import { IPlace, IAd } from "../../utils/teamInterface";

const PlaceSchema: Schema = new Schema(
  {
    landmark: { type: String, default: "" },
    area: { type: String },
    state: { type: String, default: "" },
    country: { type: String, default: "" },
    stateCapital: { type: String, default: "" },
    stateLogo: { type: String, default: "" },
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
    timestamps: true,
  }
);
export const Place = mongoose.model<IPlace>("Place", PlaceSchema);

const AdSchema: Schema = new Schema(
  {
    category: { type: String, default: "" },
    picture: { type: String, default: "" },
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    price: { type: Number, default: 0 },
    duration: { type: Number, default: 0 },
    postNumber: { type: Number, default: 0 },
    continent: { type: String, default: "" },
    country: { type: String, default: "" },
    currency: { type: String, default: "" },
    currencySymbol: { type: String, default: "" },
    countrySymbol: { type: String, default: "" },
    placeId: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const Ad = mongoose.model<IAd>("Ad", AdSchema);
