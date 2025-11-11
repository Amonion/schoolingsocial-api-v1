import { Request, Response } from 'express'
import { INews, News } from '../../models/place/newsModel'
import {
  deleteItem,
  updateItem,
  createItem,
  getItemById,
  queryData,
  search,
} from '../../utils/query'
import { handleError } from '../../utils/errorHandler'
import { PipelineStage } from 'mongoose'
import { postScore } from '../../utils/computation'
import { Bookmark, Hate, Like, View } from '../../models/users/statModel'

interface GetNewsOptions {
  country?: string
  state?: string
  limit?: number
  isFeatured?: boolean
  isMain?: boolean
  skip?: number
}

export const createNews = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (req.body.tags) {
    req.body.tags = JSON.parse(req.body.tags)
  }
  createItem(req, res, News, 'News was created successfully')
}

export const getNewsById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  getItemById(req, res, News, 'News was not found')
}

export const massDeleteNews = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    await News.deleteMany({ _id: { $in: req.body.ids } })
    const result = await queryData(News, req)
    res.status(200).json({
      message: 'The selected news have been deleted successfully',
      count: result.count,
      results: result.results,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getNews = async (req: Request, res: Response) => {
  try {
    const result = await queryData<INews>(News, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getNewsFeed = async ({
  country,
  state,
  limit = 20,
  isFeatured,
  isMain,
  skip = 0,
}: GetNewsOptions) => {
  const buildMatch = (priority: string, extra?: Record<string, any>) => {
    const baseMatch: Record<string, any> = {
      priority: { $regex: new RegExp(`^${priority}$`, 'i') },
      isPublished: true,
      ...extra,
    }

    if (isFeatured || isMain) {
      const orConditions: Record<string, boolean>[] = []
      if (isFeatured) orConditions.push({ isFeatured: true })
      if (isMain) orConditions.push({ isMain: true })
      baseMatch.$or = orConditions
    }

    return baseMatch
  }

  const facets: Record<string, PipelineStage.FacetPipelineStage[]> = {
    international: [
      { $match: buildMatch('international') },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ],
  }

  if (country) {
    facets.national = [
      {
        $match: buildMatch('national', {
          country: { $regex: new RegExp(`^${country}$`, 'i') },
        }),
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]
  }

  if (state) {
    facets.local = [
      {
        $match: buildMatch('local', {
          state: { $regex: new RegExp(`^${state}$`, 'i') },
        }),
      },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
    ]
  }

  const pipeline: PipelineStage[] = [
    { $facet: facets },
    {
      $project: {
        all: {
          $concatArrays: Object.keys(facets).map((key) => `$${key}`),
        },
      },
    },
    { $unwind: '$all' },
    { $replaceRoot: { newRoot: '$all' } },
    { $sort: { createdAt: -1 } },
  ]

  const news = await News.aggregate(pipeline)
  return news
}

export const toggleLikeNews = async (req: Request, res: Response) => {
  try {
    const { userId, id } = req.body
    let score = 0

    const news = await News.findById(id)

    if (!news) {
      return res.status(404).json({ message: 'news not found' })
    }

    const like = await Like.findOne({ postId: id, userId })
    if (like) {
      await Like.deleteOne({ postId: id, userId })
      score = Math.max(0, news.score - 2)

      await News.updateOne({ _id: id }, [
        {
          $set: {
            likes: { $max: [{ $subtract: ['$likes', 1] }, 0] },
            score: score,
          },
        },
      ])
    } else {
      score = postScore('likes', news.score)

      await Like.create({ postId: id, userId })
      await News.updateOne({ _id: id }, [
        {
          $set: {
            likes: { $add: ['$likes', 1] },
            score: score,
          },
        },
      ])
    }

    await News.updateOne(
      { _id: news._id },
      {
        $set: { score: score },
      }
    )
    return res.status(200).json({ message: null })
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const toggleSaveNews = async (req: Request, res: Response) => {
  try {
    const { userId, id } = req.body
    let score = 0

    const news = await News.findById(id)

    if (!news) {
      return res.status(404).json({ message: 'news not found' })
    }

    const save = await Bookmark.findOne({ postId: id, userId })
    if (save) {
      await Bookmark.deleteOne({ postId: id, userId })
      score = Math.max(0, news.score - 5)

      await News.updateOne({ _id: id }, [
        {
          $set: {
            bookmarks: { $max: [{ $subtract: ['$bookmarks', 1] }, 0] },
            score: score,
          },
        },
      ])
    } else {
      score = postScore('bookmarks', news.score)

      await Bookmark.create({ postId: id, userId })
      await News.updateOne({ _id: id }, [
        {
          $set: {
            bookmarks: { $add: ['$bookmarks', 1] },
            score: score,
          },
        },
      ])
    }

    await News.updateOne(
      { _id: news._id },
      {
        $set: { score: score },
      }
    )

    return res.status(200).json({ message: null })
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateNews = async (req: Request, res: Response) => {
  updateItem(
    req,
    res,
    News,
    ['picture', 'video'],
    ['News not found', 'News was updated successfully']
  )
}

export const updateNewsViews = async (req: Request, res: Response) => {
  try {
    const { userId, id } = req.body
    let updateQuery: any = {}

    const view = await View.findOne({ userId: userId, postId: id })
    if (view) {
      return res.status(200).json()
    }

    const news = await News.findOne({
      _id: id,
    })
    if (!news) {
      return res.status(200).json()
    }
    const score = postScore('views', news.score)

    await News.updateOne(
      { _id: news._id },
      {
        $set: { score: score },
      }
    )
    if (!view) {
      updateQuery.$inc = { views: 1 }
      await View.create({ userId: userId, postId: news._id })
      await News.findByIdAndUpdate(news._id, updateQuery, {
        new: true,
      })
    }

    return res.status(200).json({ message: null })
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const deleteNews = async (req: Request, res: Response) => {
  await deleteItem(req, res, News, ['picture', 'video'], 'News not found')
}

export const getInitialNews = async (req: Request, res: Response) => {
  try {
    const country = String(req.query.country || '')
    const state = String(req.query.state || '')
    const limit = parseInt(req.query.page_size as string, 10) || 20
    const skip = parseInt(req.query.page as string, 10) || 0

    const news = await getNewsFeed({ country, state, limit, skip })

    const results = await processNews(news, String(req.query.userId))
    // console.log(results)
    res.status(200).json({ results })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
}

export const searchNews = (req: Request, res: Response) => {
  return search(News, req, res)
}

export const processNews = async (news: INews[], userId: string) => {
  const newsIds = news.map((item) => item._id)

  const likedNews = await Like.find({
    userId: userId,
    postId: { $in: newsIds },
  }).select('postId')

  const bookmarkedPosts = await Bookmark.find({
    bookmarkUserId: userId,
    postId: { $in: newsIds },
  }).select('postId')

  const viewedNews = await View.find({
    userId: userId,
    postId: { $in: newsIds },
  }).select('postId')

  const likedPostIds = likedNews.map((like) => like.postId.toString())
  const bookmarkedPostIds = bookmarkedPosts.map((bookmark) =>
    bookmark.postId.toString()
  )
  const viewedPostIds = viewedNews.map((view) => view.postId.toString())
  const updatedPosts = []

  for (let i = 0; i < news.length; i++) {
    const el = news[i]

    if (likedPostIds && likedPostIds.includes(el._id.toString())) {
      el.liked = true
    }

    if (bookmarkedPostIds && bookmarkedPostIds.includes(el._id.toString())) {
      el.bookmarked = true
    }

    if (viewedPostIds && viewedPostIds.includes(el._id.toString())) {
      el.viewed = true
    }
    updatedPosts.push(el)
  }

  const results = updatedPosts
  return results
}
