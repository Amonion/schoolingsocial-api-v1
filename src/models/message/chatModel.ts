import mongoose, { Schema } from 'mongoose'

export interface IRepliedChatContent extends Document {
  _id: string
  content: string
  received: boolean
  userId: string
  username: string
  picture: string
  media: [
    {
      source: string
      name: string
      duration: number
      size: number
    }
  ]
  receiverUsername: string
  receiverPicture: string
  receiverId: string
  createdAt: Date | null
}

export interface IChat extends Document {
  _id: string
  from: string
  content: string
  status: string
  isReadUsernames: string[]
  isSavedUsernames: string[]
  action: string
  senderUsername: string
  senderPicture: string
  media: [
    {
      source: string
      name: string
      duration: number
      size: number
    }
  ]
  message: string
  connection: string
  deletedUsername: string
  senderTime: Date
  receiverTime: Date
  createdAt: Date
  time: number
  timeNumber: number
  unreadUser: number
  unreadReceiver: number
  receiverUsername: string
  receiverPicture: string
  repliedChat: IRepliedChatContent
  isFriends: boolean
  isPinned: boolean
  isRead: boolean
}

const ChatSchema: Schema = new Schema(
  {
    senderUsername: { type: String },
    media: { type: Array },
    day: { type: String },
    connection: { type: String },
    status: { type: String },
    repliedChat: { type: Object, default: {} },
    content: { type: String },
    isSavedUsernames: { type: Array },
    isReadUsernames: { type: Array },
    isPinned: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
    receiverUsername: { type: String },
    timeNumber: { type: Number, default: 0 },
    deletedUsername: { type: String },
    receiverTime: { type: Date, default: Date.now },
    senderTime: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Chat = mongoose.model<IChat>('Chat', ChatSchema)

interface UnreadMessage {
  username: string
  unread: number
}

export interface IFriend extends Document {
  _id: string
  content: string
  senderUsername: string
  senderDisplayName: string
  senderPicture: string
  receiverDisplayName: string
  receiverUsername: string
  receiverPicture: string
  isFriends: boolean
  senderOnline: boolean
  receiverOnline: boolean
  connection: string
  status: string
  contentType: string
  senderTime: Date
  receiverTime: Date
  createdAt: Date
  updatedAt: Date
  timeNumber: number
  unreadMessages: UnreadMessage[]
  totalUnread: number
  unreadSender: number
  unreadReceiver: number
}

const FriendSchema: Schema = new Schema(
  {
    senderUsername: { type: String },
    senderDisplayName: { type: String },
    senderPicture: { type: String },
    receiverDisplayName: { type: String },
    receiverUsername: { type: String },
    receiverPicture: { type: String },
    isFriends: { type: Boolean, default: false },
    senderOnline: { type: Boolean, default: false },
    receiverOnline: { type: Boolean, default: false },
    connection: { type: String },
    status: { type: String },
    content: { type: String },
    contentType: { type: String },
    timeNumber: { type: Number },
    unreadMessages: { type: Array },
    receiverTime: { type: Date, default: Date.now },
    senderTime: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Friend = mongoose.model<IFriend>('Friend', FriendSchema)
