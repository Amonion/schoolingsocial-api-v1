import mongoose, { Schema } from "mongoose";
import { IUpload } from "../../utils/userInterface";

const UploadSchema: Schema = new Schema(
  {
    media: { type: String, default: "" },
    mediaName: { type: String, default: "" },
    username: { type: String, default: "" },
    userStatus: { type: String, default: "User" },
    staffPosition: { type: String, default: "" },
    userId: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Upload = mongoose.model<IUpload>("Upload", UploadSchema);
