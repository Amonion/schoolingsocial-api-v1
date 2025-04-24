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
    repliedChat: { type: Object, default: {} },
    content: { type: String, default: "" },
    isSent: { type: Boolean, default: false },
    isSavedUsernames: { type: Array, default: [] },
    isReadUsernames: { type: Array, default: [] },
    isPinned: { type: Boolean, default: false },
    isFriends: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
    receiverUsername: { type: String, default: "" },
    receiverPicture: { type: String, default: "" },
    receiverId: { type: String, default: "" },
    time: { type: Number, default: 0 },
    unreadUser: { type: Number, default: 0 },
    unreadReceiver: { type: Number, default: 0 },
    deletedUsername: { type: String, default: "" },
    receiverTime: { type: Date, default: Date.now },
    senderTime: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);
export const Chat = mongoose.model<IChat>("Chat", ChatSchema);
