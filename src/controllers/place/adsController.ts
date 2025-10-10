// import { Request, Response } from 'express'
// import { Place } from '../../models/team/placeModel'
// import { handleError } from '../../utils/errorHandler'
// import {
//   queryData,
//   deleteItems,
//   createItem,
//   updateItem,
// } from '../../utils/query'
// import { Ad } from '../../models/utility/adModel'
// import { IAd } from '../../utils/userInterface'

// export const createAd = async (req: Request, res: Response): Promise<void> => {
//   createItem(req, res, Ad, 'Ads was created successfully')
// }

// export const getAdById = async (
//   req: Request,
//   res: Response
// ): Promise<Response | void> => {
//   try {
//     const result = await Ad.findById(req.params.id)
//     if (!result) {
//       return res.status(404).json({ message: 'Ad not found' })
//     }
//     res.status(200).json(result)
//   } catch (error) {
//     handleError(res, undefined, undefined, error)
//   }
// }

// export const getAds = async (req: Request, res: Response) => {
//   try {
//     const result = await queryData<IAd>(Ad, req)
//     res.status(200).json(result)
//   } catch (error) {
//     handleError(res, undefined, undefined, error)
//   }
// }

// export const updateAd = async (req: Request, res: Response) => {
//   try {
//     updateItem(
//       req,
//       res,
//       Ad,
//       ['picture'],
//       ['Ad not found', 'Ad was updated successfully']
//     )
//   } catch (error) {
//     handleError(res, undefined, undefined, error)
//   }
// }

// export const deleteAd = async (req: Request, res: Response) => {
//   await deleteItems(req, res, Place, ['countryFlag'], 'Place not found')
// }

import { Request, Response } from 'express'
import { Place } from '../../models/place/placeModel'
import { handleError } from '../../utils/errorHandler'
import { queryData, deleteItems, createItem } from '../../utils/query'
import { Ad } from '../../models/place/adModel'
import { IAd } from '../../utils/userInterface'
import { uploadFilesToS3 } from '../../utils/fileUpload'
import { User } from '../../models/users/user'
import { getPeriodRange } from '../../utils/computation'

//--------------------ADS-----------------------//
export const getAdById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const result = await Ad.findById(req.params.id)
    if (!result) {
      return res.status(404).json({ message: 'Ad not found' })
    }
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const deleteAd = async (req: Request, res: Response) => {
  await deleteItems(req, res, Place, ['countryFlag'], 'Place not found')
}

export const updateAd = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.body.target) {
      req.body.tags = JSON.parse(req.body.tags)
      req.body.states = JSON.parse(req.body.states)
      req.body.areas = JSON.parse(req.body.areas)
      req.body.countries = JSON.parse(req.body.countries)
    }
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json({
      message: 'Ad was updated successfully',
      data: ad,
    })
  } catch (error: any) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}

export const publishAdReview = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      { onReview: true, status: true },
      {
        new: true,
        runValidators: true,
      }
    )

    res.status(200).json({
      message:
        'Your Ad is on review and you will be notified within 24 hours once approved',
      data: ad,
    })
  } catch (error: any) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}

// export const createAd = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const uploadedFiles = await uploadFilesToS3(req)
//     uploadedFiles.forEach((file) => {
//       req.body[file.fieldName] = file.s3Url
//     })

//     const newUser = new User({
//       userStatus: 'ad',
//       email: `${req.body.username}@smail.com`,
//       username: req.body.username,
//       password: await bcrypt.hash('password', 10),
//     })

//     await newUser.save()

//     req.body.media = JSON.parse(req.body.media)
//     const ad = await Ad.create(req.body, {
//       new: true,
//       runValidators: true,
//     })

//     res.status(200).json({
//       message: 'Ad is created successfully',
//       data: ad,
//     })
//   } catch (error: any) {
//     console.log(error)
//     handleError(res, undefined, undefined, error)
//   }
// }

export const createAd = async (req: Request, res: Response): Promise<void> => {
  createItem(req, res, Ad, 'Ads was created successfully')
}

export const getAds = async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await queryData<IAd>(Ad, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getAd = async (req: Request, res: Response): Promise<void> => {
  try {
    const ad = await Ad.findById(req.params.id)

    res.status(200).json({
      message: 'Post stats retrieved successfully',
      data: ad,
    })
  } catch (error: any) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}

export const getDraftAd = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const ad = await Ad.findOne({ user: req.query.username, status: false })
    res.status(200).json({
      data: ad,
    })
  } catch (error: any) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}

export const getAdStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const period = (req.query.period as string) || 'all'
    const username = req.query.username || null
    const country = (req.query.country as string) || 'Nigeria'

    const currency = await Place.findOne({
      country: new RegExp(`^${country.trim()}\\s*$`, 'i'),
    }).select('currencySymbol')

    const { startDate, prevStartDate, prevEndDate } =
      period !== 'all'
        ? getPeriodRange(period)
        : { startDate: null, prevStartDate: null, prevEndDate: null }

    //--------------AD STATS--------------//
    const matchStage: any = {}
    if (startDate) matchStage.createdAt = { $gte: startDate }
    if (username) matchStage.username = username

    const adStats = await Ad.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalAds: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalDuration: { $sum: '$duration' },
        },
      },
      { $project: { _id: 0 } },
    ])

    let percentageChange = 0
    if (startDate && prevStartDate && prevEndDate) {
      const prevMatch: any = {
        createdAt: { $gte: prevStartDate, $lt: prevEndDate },
      }
      const prevStats = await Ad.aggregate([
        { $match: prevMatch },
        {
          $group: {
            _id: null,
            totalAds: { $sum: 1 },
          },
        },
        { $project: { _id: 0 } },
      ])

      const currentAds = adStats[0]?.totalAds || 0
      const prevAds = prevStats[0]?.totalAds || 0

      if (prevAds > 0) {
        percentageChange = ((currentAds - prevAds) / prevAds) * 100
      } else if (currentAds > 0) {
        percentageChange = 100
      } else {
        percentageChange = 0
      }
    }

    const adStatTimeSeries = await Ad.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            day: {
              $dateToString: {
                format: '%Y-%m-%d', // group by day
                date: '$createdAt',
              },
            },
          },
          totalAds: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalDuration: { $sum: '$duration' },
        },
      },
      { $sort: { '_id.day': 1 } },
      {
        $project: {
          _id: 0,
          day: '$_id.day',
          totalAds: 1,
          totalAmount: 1,
          totalDuration: 1,
        },
      },
    ])

    //--------------REVIEW STATS--------------//
    const onReviewStage: any = { onReview: true }
    if (startDate) onReviewStage.createdAt = { $gte: startDate }
    if (username) onReviewStage.username = username
    const onReviewStats = await Ad.aggregate([
      { $match: onReviewStage },
      {
        $group: {
          _id: null,
          totalAds: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalDuration: { $sum: '$duration' },
        },
      },
      { $project: { _id: 0 } },
    ])

    let reviewPercentageChange = 0
    if (startDate && prevStartDate && prevEndDate) {
      const prevReviewMatch: any = {
        onReview: true,
        createdAt: { $gte: prevStartDate, $lt: prevEndDate },
      }

      const prevOnReviewStats = await Ad.aggregate([
        { $match: prevReviewMatch },
        {
          $group: {
            _id: null,
            totalAds: { $sum: 1 },
          },
        },
        { $project: { _id: 0 } },
      ])

      const currentOnReviews = onReviewStats[0]?.totalAds || 0
      const prevOnReviews = prevOnReviewStats[0]?.totalAds || 0

      if (prevOnReviews > 0) {
        reviewPercentageChange =
          ((currentOnReviews - prevOnReviews) / prevOnReviews) * 100
      } else if (currentOnReviews > 0) {
        reviewPercentageChange = 100
      } else {
        reviewPercentageChange = 0
      }
    }

    const reviewStatTimeSeries = await Ad.aggregate([
      { $match: onReviewStage },
      {
        $group: {
          _id: {
            day: {
              $dateToString: {
                format: '%Y-%m-%d', // group by day
                date: '$createdAt',
              },
            },
          },
          totalAds: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalDuration: { $sum: '$duration' },
        },
      },
      { $sort: { '_id.day': 1 } },
      {
        $project: {
          _id: 0,
          day: '$_id.day',
          totalAds: 1,
          totalAmount: 1,
          totalDuration: 1,
        },
      },
    ])
    //--------------EDITING STATS--------------//
    const isEditingStage: any = { isEditing: true, onReview: false }
    if (startDate) isEditingStage.createdAt = { $gte: startDate }
    if (username) isEditingStage.username = username
    const isEditingStats = await Ad.aggregate([
      { $match: isEditingStage },
      {
        $group: {
          _id: null,
          totalAds: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalDuration: { $sum: '$duration' },
        },
      },
      { $project: { _id: 0 } },
    ])

    let editingPercentageChange = 0
    if (startDate && prevStartDate && prevEndDate) {
      const prevEditMatch: any = {
        isEditing: true,
        createdAt: { $gte: prevStartDate, $lt: prevEndDate },
      }

      const prevIsEditingStats = await Ad.aggregate([
        { $match: prevEditMatch },
        {
          $group: {
            _id: null,
            totalAds: { $sum: 1 },
          },
        },
        { $project: { _id: 0 } },
      ])

      const currentIsEditing = isEditingStats[0]?.totalAds || 0
      const prevIsEditing = prevIsEditingStats[0]?.totalAds || 0

      if (prevIsEditing > 0) {
        editingPercentageChange =
          ((currentIsEditing - prevIsEditing) / prevIsEditing) * 100
      } else if (currentIsEditing > 0) {
        editingPercentageChange = 100
      } else {
        editingPercentageChange = 0
      }
    }

    const editingStatTimeSeries = await Ad.aggregate([
      { $match: isEditingStage },
      {
        $group: {
          _id: {
            day: {
              $dateToString: {
                format: '%Y-%m-%d', // group by day
                date: '$createdAt',
              },
            },
          },
          totalAds: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalDuration: { $sum: '$duration' },
        },
      },
      { $sort: { '_id.day': 1 } },
      {
        $project: {
          _id: 0,
          day: '$_id.day',
          totalAds: 1,
          totalAmount: 1,
          totalDuration: 1,
        },
      },
    ])
    //--------------ONLINE STATS--------------//
    const onlineStage: any = { online: true }
    if (startDate) onlineStage.createdAt = { $gte: startDate }
    if (username) onlineStage.username = username
    const onlineStats = await Ad.aggregate([
      { $match: onlineStage },
      {
        $group: {
          _id: null,
          totalAds: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalDuration: { $sum: '$duration' },
        },
      },
      { $project: { _id: 0 } },
    ])

    let onlinePercentageChange = 0
    if (startDate && prevStartDate && prevEndDate) {
      const prevEditMatch: any = {
        online: true,
        createdAt: { $gte: prevStartDate, $lt: prevEndDate },
      }

      const prevOnlineStats = await Ad.aggregate([
        { $match: prevEditMatch },
        {
          $group: {
            _id: null,
            totalAds: { $sum: 1 },
          },
        },
        { $project: { _id: 0 } },
      ])

      const currentOnline = onlineStats[0]?.totalAds || 0
      const prevOnline = prevOnlineStats[0]?.totalAds || 0

      if (prevOnline > 0) {
        onlinePercentageChange =
          ((currentOnline - prevOnline) / prevOnline) * 100
      } else if (currentOnline > 0) {
        onlinePercentageChange = 100
      } else {
        onlinePercentageChange = 0
      }
    }

    const onlineStatTimeSeries = await Ad.aggregate([
      { $match: onlineStage },
      {
        $group: {
          _id: {
            day: {
              $dateToString: {
                format: '%Y-%m-%d', // group by day
                date: '$createdAt',
              },
            },
          },
          totalAds: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          totalDuration: { $sum: '$duration' },
        },
      },
      { $sort: { '_id.day': 1 } },
      {
        $project: {
          _id: 0,
          day: '$_id.day',
          totalAds: 1,
          totalAmount: 1,
          totalDuration: 1,
        },
      },
    ])
    //--------------RESPONSE--------------//

    const mergedGraph = mergeTimeSeries(
      adStatTimeSeries,
      reviewStatTimeSeries,
      editingStatTimeSeries,
      onlineStatTimeSeries
    )
    res.status(200).json({
      result: {
        adStats: adStats[0] || {},
        onReview: onReviewStats[0] || {},
        isEditing: isEditingStats[0] || {},
        online: onlineStats[0] || {},
        adPercentageChange: percentageChange,
        reviewPercentageChange: reviewPercentageChange,
        editingPercentageChange: editingPercentageChange,
        onlinePercentageChange: onlinePercentageChange,
        currency: currency.currencySymbol,
        lineData: mergedGraph,
      },
    })
  } catch (error: any) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}

function mergeTimeSeries(ad, review, editing, online) {
  const map: Record<string, any> = {}

  ad.forEach(({ day, totalAds }) => {
    map[day] = { ...(map[day] || { day }), ads: totalAds }
  })

  review.forEach(({ day, totalAds }) => {
    map[day] = { ...(map[day] || { day }), reviews: totalAds }
  })

  editing.forEach(({ day, totalAds }) => {
    map[day] = { ...(map[day] || { day }), editing: totalAds }
  })

  online.forEach(({ day, totalAds }) => {
    map[day] = { ...(map[day] || { day }), online: totalAds }
  })

  // Fill missing series with 0
  Object.values(map).forEach((d: any) => {
    d.ads = d.ads || 0
    d.reviews = d.reviews || 0
    d.editing = d.editing || 0
    d.online = d.online || 0
  })

  return Object.values(map).sort(
    (a: any, b: any) => new Date(a.day).getTime() - new Date(b.day).getTime()
  )
}
