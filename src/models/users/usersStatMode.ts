import mongoose, { Schema } from "mongoose";
import { IUserStat } from "../../utils/userInterface";

const UserStatSchema: Schema = new Schema(
  {
    country: { type: String },
    countryCode: { type: String },
    ips: [{ type: String }],
    username: { type: String },
    bioId: { type: String },
    online: { type: Boolean, default: false },
    leftAt: { type: Date, default: Date.now },
    visitedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const UserStat = mongoose.model<IUserStat>("UserStat", UserStatSchema);
