import mongoose, { Schema } from "mongoose";
import { IPayment } from "../../utils/teamInterface";

const PaymentSchema: Schema = new Schema(
  {
    amount: { type: Number, default: 0.0 },
    charge: { type: Number, default: 0.0 },
    logo: { type: String },
    name: { type: String, default: "" },
    country: { type: String, default: "" },
    placeId: { type: String, default: "" },
    countryFlag: { type: String, default: "" },
    description: { type: String, default: "" },
    countrySymbol: { type: String, default: "" },
    currency: { type: String, default: "" },
    currencySymbol: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Payment = mongoose.model<IPayment>("Payment", PaymentSchema);
