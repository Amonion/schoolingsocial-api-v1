import mongoose, { Schema } from 'mongoose'
import { INews } from '../../utils/teamInterface'

const NewsSchema: Schema = new Schema(
  {
    placeId: { type: String, default: '' },
    title: { type: String, default: '' },
    content: { type: String, default: '' },
    author: { type: String, default: '' },
    priority: { type: String, default: '' },
    priorityIndex: { type: Number, default: 1 },
    publishedAt: { type: Date },
    status: { type: String, default: 'Draft' },
    state: { type: String, default: '' },
    level: { type: String, default: '' },
    country: { type: String, default: '' },
    tags: { type: String, default: '' },
    continent: { type: String, default: '' },
    comments: { type: Number, default: 0 },
    interests: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    picture: { type: String, default: '' },
    video: { type: String, default: '' },
    videoUrl: { type: String, default: '' },
    category: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    source: { type: String, default: '' },
    isFeatured: { type: Boolean, default: '' },
    seoTitle: { type: String, default: '' },
    seoDescription: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
)
export const News = mongoose.model<INews>('News', NewsSchema)
