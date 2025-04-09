import mongoose, { Schema } from "mongoose";
import { IChat } from "../../utils/userInterface";

const ChatSchema: Schema = new Schema(
  {
    username: { type: String },
    userId: { type: String },
    picture: { type: String, default: "" },
    media: { type: Array, default: [] },
    day: { type: String, default: "" },
    connection: { type: String, default: "" },
    content: { type: String, default: "" },
    received: { type: Boolean, default: false },
    isSaved: { type: Boolean, default: false },
    isPinned: { type: Boolean, default: false },
    isFriends: { type: Boolean, default: false },
    receiverUsername: { type: String, default: "" },
    receiverPicture: { type: String, default: "" },
    receiverId: { type: String, default: "" },
    isReceiverDeleted: { type: Boolean, default: false },
    receiverTime: { type: Date, default: Date.now },
    senderTime: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const Chat = mongoose.model<IChat>("Chat", ChatSchema);
