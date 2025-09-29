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
    picture: { type: String, default: '' },
    media: { type: Array, default: [] },
    day: { type: String, default: '' },
    connection: { type: String, default: '' },
    repliedChat: { type: Object, default: {} },
    content: { type: String, default: '' },
    isSent: { type: Boolean, default: false },
    isSavedUsernames: { type: Array, default: [] },
    isReadUsernames: { type: Array, default: [] },
    isPinned: { type: Boolean, default: false },
    isFriends: { type: Boolean, default: false },
    isRead: { type: Boolean, default: false },
    receiverUsername: { type: String, default: '' },
    receiverPicture: { type: String, default: '' },
    receiverId: { type: String, default: '' },
    from: { type: String, default: '' },
    time: { type: Number, default: 0 },
    unreadUser: { type: Number, default: 0 },
    unreadReceiver: { type: Number, default: 0 },
    deletedUsername: { type: String, default: '' },
    receiverTime: { type: Date, default: Date.now },
    senderTime: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const Chat = mongoose.model<IChat>('Chat', ChatSchema)
