import { Request, Response } from 'express'
import { News } from '../../models/place/newsModel'
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
    const result = await queryData(News, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

// export const getFeaturedNews = async (
//   country: string,
//   state: string,
//   limitPerCategory = 20
// ) => {
//   const pipeline: PipelineStage[] = [
//     {
//       $facet: {
//         international: [
//           {
//             $match: {
//               priority: { $regex: /^international$/i },
//               isPublished: true,
//             },
//           },
//           { $sort: { createdAt: -1 } },
//           { $limit: limitPerCategory },
//         ],
//         national: [
//           {
//             $match: {
//               priority: { $regex: /^national$/i },
//               country: { $regex: new RegExp(`^${country}$`, 'i') },
//               isPublished: true,
//             },
//           },
//           { $sort: { createdAt: -1 } },
//           { $limit: limitPerCategory },
//         ],
//         local: [
//           {
//             $match: {
//               priority: { $regex: /^local$/i },
//               state: { $regex: new RegExp(`^${state}$`, 'i') },
//               isPublished: true,
//             },
//           },
//           { $sort: { createdAt: -1 } },
//           { $limit: limitPerCategory },
//         ],
//       },
//     },
//     {
//       $project: {
//         all: { $concatArrays: ['$international', '$national', '$local'] },
//       },
//     },
//     { $unwind: '$all' },
//     { $replaceRoot: { newRoot: '$all' } },
//     { $sort: { createdAt: -1 } },
//     {
//       $addFields: {
//         isFeatured: true,
//         isPublished: true,
//       },
//     },
//   ]

//   const news = await News.aggregate(pipeline)
//   return news
// }

export const getFeaturedNews = async (
  country?: string,
  state?: string,
  limitPerCategory = 20
) => {
  const facets: Record<string, PipelineStage.FacetPipelineStage[]> = {
    international: [
      {
        $match: {
          priority: { $regex: /^international$/i },
          isPublished: true,
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: limitPerCategory },
    ],
  }

  if (country) {
    facets.national = [
      {
        $match: {
          priority: { $regex: /^national$/i },
          country: { $regex: new RegExp(`^${country}$`, 'i') },
          isPublished: true,
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: limitPerCategory },
    ]
  }
  if (state) {
    facets.local = [
      {
        $match: {
          priority: { $regex: /^local$/i },
          state: { $regex: new RegExp(`^${state}$`, 'i') },
          isPublished: true,
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: limitPerCategory },
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
    {
      $addFields: {
        isFeatured: true,
        isPublished: true,
      },
    },
  ]

  const news = await News.aggregate(pipeline)
  return news
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

export const deleteNews = async (req: Request, res: Response) => {
  await deleteItem(req, res, News, ['picture', 'video'], 'News not found')
}

export const getHomeFeed = async (req: Request, res: Response) => {
  try {
    const country = String(req.query.country)
    const state = String(req.query.state)
    const results = await getFeaturedNews(country, state)
    res.status(200).json({ results })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Server error' })
  }
}

export const searchNews = (req: Request, res: Response) => {
  return search(News, req, res)
}
