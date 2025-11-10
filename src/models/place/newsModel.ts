import mongoose, { Schema } from 'mongoose'

export interface INews extends Document {
  _id: string
  title: string
  content: string
  author: string
  publishedAt: Date
  isPublished: boolean
  state: string
  level: string
  country: string
  views: number
  bookmarks: number
  score: number
  likes: number
  replies: number
  tags: string[]
  picture: string
  video: string
  category: string
  subtitle: string
  source: string
  isFeatured: boolean
  liked: boolean
  viewed: boolean
  bookmarked: boolean
  isMain: boolean
  isRead: boolean
  seoDescription: string
}

const NewsSchema: Schema = new Schema(
  {
    title: { type: String },
    content: { type: String },
    author: { type: String },
    priority: { type: String },
    publishedAt: { type: Date },
    isPublished: { type: Boolean },
    state: { type: String },
    country: { type: String },
    tags: { type: Array },
    replies: { type: Number },
    views: { type: Number },
    likes: { type: Number },
    bookmarks: { type: Number },
    score: { type: Number, default: 1 },
    picture: { type: String },
    video: { type: String },
    category: { type: String },
    subtitle: { type: String },
    source: { type: String },
    isFeatured: { type: Boolean },
    isMain: { type: Boolean },
    isRead: { type: Boolean },
    seoDescription: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)

NewsSchema.index({ priority: 1, createdAt: -1 })
NewsSchema.index({ priority: 1, country: 1, createdAt: -1 })
NewsSchema.index({ priority: 1, state: 1, createdAt: -1 })
NewsSchema.index({ category: 1, createdAt: -1 })
NewsSchema.index({ tags: 1, createdAt: -1 })

export const News = mongoose.model<INews>('News', NewsSchema)
