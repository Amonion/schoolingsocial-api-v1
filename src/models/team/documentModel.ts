import mongoose, { Schema } from "mongoose";
import { IDocument } from "../../utils/teamInterface";

const DocumentSchema: Schema = new Schema(
  {
    name: { type: String, default: "" },
    picture: { type: String, default: "" },
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

export const Document = mongoose.model<IDocument>("Document", DocumentSchema);
