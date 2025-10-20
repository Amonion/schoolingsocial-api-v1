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
  userId: string
  isReadUsernames: string[]
  isSavedUsernames: string[]
  action: string
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
  message: string
  connection: string
  deletedUsername: string
  senderTime: Date
  receiverTime: Date
  createdAt: Date
  time: number
  unreadUser: number
  unreadReceiver: number
  receiverUsername: string
  receiverPicture: string
  receiverId: string
  repliedChat: IRepliedChatContent
  isPinned: boolean
  isRead: boolean
  isFriends: boolean
  isSent: boolean
  senderId: string
}

const ChatSchema: Schema = new Schema(
  {
    username: { type: String },
    userId: { type: String },
    picture: { type: String },
    media: { type: Array },
    day: { type: String },
    connection: { type: String },
    repliedChat: { type: Object, default: {} },
    content: { type: String },
    isSent: { type: Boolean, default: false },
    isSavedUsernames: { type: Array },
    isReadUsernames: { type: Array },
    isPinned: { type: Boolean, default: false },
    isFriends: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
    receiverUsername: { type: String },
    receiverPicture: { type: String },
    receiverId: { type: String },
    from: { type: String },
    time: { type: Number, default: 0 },
    unreadUser: { type: Number, default: 0 },
    unreadReceiver: { type: Number, default: 0 },
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

  senderTime: Date
  receiverTime: Date
  createdAt: Date
  time: number
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
    unreadSender: { type: Number, default: 0 },
    unreadReceiver: { type: Number, default: 0 },
    receiverTime: { type: Date, default: Date.now },
    senderTime: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Friend = mongoose.model<IFriend>('Friend', FriendSchema)
