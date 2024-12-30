import mongoose, { Schema, Document } from "mongoose";

export interface IUsers extends Document {
  username: string;
  email: string;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { collection: "Users" }
);

export default mongoose.model<IUsers>("Users", UserSchema);
