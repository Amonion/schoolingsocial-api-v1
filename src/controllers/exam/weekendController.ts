import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import { queryData, updateItem, createItem, search } from '../../utils/query'
import { IWeekend, Weekend } from '../../models/exam/weekendModel'

export const createWeekend = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Weekend, 'Weekend was created successfully')
}

export const getWeekendById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Weekend.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Weekend not found' })
    }
    res.status(200).json({ data: item })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getWeekends = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IWeekend>(Weekend, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateWeekend = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Weekend,
      ['video', 'picture'],
      ['Weekend not found', 'Weekend was updated successfully']
    )
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

// export const getGiveaways = async (req: Request, res: Response) => {
//   try {
//     const pageSize = Math.max(parseInt(req.query.page_size as string) || 20, 1)
//     const page = Math.max(parseInt(req.query.page as string) || 1, 1)
//     const skip = (page - 1) * pageSize

//     const { country, state, area } = req.query

//     const matchStage: any = {}
//     if (country) matchStage.country = country
//     if (state) matchStage.state = state
//     if (area) matchStage.area = area

//     const pipeline: any[] = [
//       {
//         $addFields: {
//           locationPriority: {
//             $add: [
//               country ? { $cond: [{ $eq: ['$country', country] }, 3, 0] } : 0,
//               state ? { $cond: [{ $eq: ['$state', state] }, 2, 0] } : 0,
//               area ? { $cond: [{ $eq: ['$area', area] }, 1, 0] } : 0,
//             ],
//           },
//         },
//       },
//       {
//         $sort: {
//           isActive: -1,
//           isSubscribed: -1,
//           locationPriority: -1, // 🔥 location match priority
//           isMain: -1,
//           isFeatured: -1,
//           createdAt: -1,
//         },
//       },
//       { $skip: skip },
//       { $limit: pageSize },
//     ]

//     const [results, totalArr] = await Promise.all([
//       Weekend.aggregate(pipeline),
//       Weekend.countDocuments(matchStage),
//     ])

//     res.status(200).json({
//       results,
//       total: totalArr,
//     })
//   } catch (error) {
//     handleError(res, undefined, undefined, error)
//   }
// }

export const getGiveaways = async (req: Request, res: Response) => {
  try {
    const pageSize = Math.max(parseInt(req.query.page_size as string) || 20, 1)
    const page = Math.max(parseInt(req.query.page as string) || 1, 1)
    const skip = (page - 1) * pageSize

    const { country, state, area } = req.query

    // ✅ ONLY hard filter
    const matchStage = { isPublished: true }

    const pipeline: any[] = [
      { $match: matchStage },
      {
        $addFields: {
          locationPriority: {
            $add: [
              country ? { $cond: [{ $eq: ['$country', country] }, 3, 0] } : 0,
              state ? { $cond: [{ $eq: ['$state', state] }, 2, 0] } : 0,
              area ? { $cond: [{ $eq: ['$area', area] }, 1, 0] } : 0,
            ],
          },
        },
      },
      {
        $sort: {
          isActive: -1,
          isSubscribed: -1,
          locationPriority: -1,
          isMain: -1,
          isFeatured: -1,
          createdAt: -1,
        },
      },
      { $skip: skip },
      { $limit: pageSize },
    ]

    const [results, total] = await Promise.all([
      Weekend.aggregate(pipeline),
      Weekend.countDocuments({ isPublished: true }),
    ])

    res.status(200).json({
      results,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const searchWeekends = (req: Request, res: Response) => {
  return search(Weekend, req, res)
}
