import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import { getPeriodRange } from '../../utils/computation'
import { Ad } from '../../models/utility/adModel'

export const getAdStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const period = (req.query.period as string) || 'all'
    const { startDate, prevStartDate, prevEndDate } =
      period !== 'all'
        ? getPeriodRange(period)
        : { startDate: null, prevStartDate: null, prevEndDate: null }

    //--------------AD STATS--------------//
    const matchStage: any = {}
    if (startDate) matchStage.createdAt = { $gte: startDate }

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

    let percentageChange = null
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

    //--------------REVIEW STATS--------------//
    const onReviewStage: any = { onReview: true }
    if (startDate) onReviewStage.createdAt = { $gte: startDate }
    const onReviewStats = await Ad.aggregate([
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

    let reviewPercentageChange = null
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

    //--------------EDITING STATS--------------//
    const isEditingStage: any = { isEditing: true }
    if (startDate) isEditingStage.createdAt = { $gte: startDate }
    const isEditingStats = await Ad.aggregate([
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

    let editingPercentageChange = null
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

    //--------------ONLINE STATS--------------//
    const onlineStage: any = { online: true }
    if (startDate) onlineStage.createdAt = { $gte: startDate }
    const onlineStats = await Ad.aggregate([
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

    let onlinePercentageChange = null
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

    //--------------RESPONSE--------------//
    res.status(200).json({
      result: {
        ads: adStats[0] || {},
        onReview: onReviewStats[0] || {},
        isEditing: isEditingStats[0] || {},
        online: onlineStats[0] || {},
        adPercentageChange: percentageChange,
        reviewPercentageChange: reviewPercentageChange,
        editingPercentageChange: editingPercentageChange,
        onlinePercentageChange: onlinePercentageChange,
      },
    })
  } catch (error: any) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}
