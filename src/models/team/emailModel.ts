import mongoose, { Schema } from "mongoose";
import { IEmail, INotification, ISms } from "../../utils/teamInterface";

const EmailSchema: Schema = new Schema(
  {
    content: { type: String, default: "" },
    title: { type: String },
    name: { type: String, default: "" },
    picture: { type: String, default: "" },
    greetings: { type: String, default: "" },
    note: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const Email = mongoose.model<IEmail>("Email", EmailSchema);

const NotificationSchema: Schema = new Schema(
  {
    content: { type: String, default: "" },
    title: { type: String },
    name: { type: String, default: "" },
    greetings: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);

const SmsSchema: Schema = new Schema(
  {
    content: { type: String, default: "" },
    title: { type: String },
    name: { type: String, default: "" },
    greetings: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const Sms = mongoose.model<ISms>("Sms", SmsSchema);
