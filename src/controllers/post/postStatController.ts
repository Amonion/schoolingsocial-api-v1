import { Request, Response } from 'express'
import { Post } from '../../models/post/postModel'
import { handleError } from '../../utils/errorHandler'
import { getPeriodRange } from '../../utils/computation'
import { Ad } from '../../models/place/adModel'

export const getPostStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const period = (req.query.period as string) || 'all'
    const username = req.query.username || null

    const { startDate, prevStartDate, prevEndDate } =
      period !== 'all'
        ? getPeriodRange(period)
        : { startDate: null, prevStartDate: null, prevEndDate: null }

    //--------------POST STATS--------------//
    const matchStage: any = {}
    if (startDate) matchStage.createdAt = { $gte: startDate }
    if (username) matchStage.username = username
    matchStage.postType = 'main'

    const postStats = await Post.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalPosts: { $sum: 1 },
          totalLikes: { $sum: '$likes' },
          totalReplies: { $sum: '$replies' },
          totalBookmarks: { $sum: '$bookmarks' },
          totalViews: { $sum: '$views' },
          totalShares: { $sum: '$shares' },
        },
      },
      { $project: { _id: 0 } },
    ])

    let percentageChange = 0
    if (startDate && prevStartDate && prevEndDate) {
      const prevMatch: any = {
        createdAt: { $gte: prevStartDate, $lt: prevEndDate },
      }
      if (username) prevMatch.username = username

      const prevStats = await Post.aggregate([
        { $match: prevMatch },
        {
          $group: {
            _id: null,
            totalPosts: { $sum: 1 },
          },
        },
        { $project: { _id: 0 } },
      ])

      const currentPosts = postStats[0]?.totalPosts || 0
      const prevPosts = prevStats[0]?.totalPosts || 0

      if (prevPosts > 0) {
        percentageChange = ((currentPosts - prevPosts) / prevPosts) * 100
      } else if (currentPosts > 0) {
        percentageChange = 100
      } else {
        percentageChange = 0
      }
    }

    //--------------COMMENT STATS--------------//
    const commentMatchStage: any = { postType: 'comment' }
    if (startDate) commentMatchStage.createdAt = { $gte: startDate }
    if (username) commentMatchStage.username = username

    const commentStats = await Post.aggregate([
      { $match: commentMatchStage },
      {
        $group: {
          _id: null,
          totalComments: { $sum: 1 },
          totalLikes: { $sum: '$likes' },
          totalHates: { $sum: '$hates' },
          totalReplies: { $sum: '$replies' },
        },
      },
      { $project: { _id: 0 } },
    ])

    let commentPercentageChange = 0
    if (startDate && prevStartDate && prevEndDate) {
      const prevCommentMatch: any = {
        postType: 'comment',
        createdAt: { $gte: prevStartDate, $lt: prevEndDate },
      }
      if (username) prevCommentMatch.username = username

      const prevCommentStats = await Post.aggregate([
        { $match: prevCommentMatch },
        {
          $group: {
            _id: null,
            totalComments: { $sum: 1 },
          },
        },
        { $project: { _id: 0 } },
      ])

      const currentComments = commentStats[0]?.totalComments || 0
      const prevComments = prevCommentStats[0]?.totalComments || 0

      if (prevComments > 0) {
        commentPercentageChange =
          ((currentComments - prevComments) / prevComments) * 100
      } else if (currentComments > 0) {
        commentPercentageChange = 100
      } else {
        commentPercentageChange = 0
      }
    }

    //--------------RESPONSE--------------//
    res.status(200).json({
      message: 'Post stats retrieved successfully',
      result: {
        post: postStats[0] || {},
        comment: commentStats[0] || {},
        postChangePercentage: percentageChange,
        commentPercentageChange: commentPercentageChange,
      },
    })
  } catch (error: any) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}

export const getAdStats1 = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const period = (req.query.period as string) || 'all'
    const username = req.query.username || null

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

    let percentageChange = null
    if (startDate && prevStartDate && prevEndDate) {
      const prevMatch: any = {
        createdAt: { $gte: prevStartDate, $lt: prevEndDate },
      }
      if (username) prevMatch.username = username

      const prevStats = await Post.aggregate([
        { $match: prevMatch },
        {
          $group: {
            _id: null,
            totalAds: { $sum: 1 },
          },
        },
        { $project: { _id: 0 } },
      ])

      const currentPosts = adStats[0]?.totalAds || 0
      const prevAds = prevStats[0]?.totalAds || 0

      if (prevAds > 0) {
        percentageChange = ((currentPosts - prevAds) / prevAds) * 100
      } else if (currentPosts > 0) {
        percentageChange = 100
      } else {
        percentageChange = 0
      }
    }

    //--------------COMMENT STATS--------------//
    const onReviewStage: any = { onReview: true }
    if (startDate) onReviewStage.createdAt = { $gte: startDate }
    if (username) onReviewStage.username = username

    const commentStats = await Post.aggregate([
      { $match: onReviewStage },
      {
        $group: {
          _id: null,
          totalComments: { $sum: 1 },
          totalLikes: { $sum: '$likes' },
          totalHates: { $sum: '$hates' },
          totalReplies: { $sum: '$replies' },
        },
      },
      { $project: { _id: 0 } },
    ])

    let commentPercentageChange = null
    if (startDate && prevStartDate && prevEndDate) {
      const prevCommentMatch: any = {
        postType: 'comment',
        createdAt: { $gte: prevStartDate, $lt: prevEndDate },
      }
      if (username) prevCommentMatch.username = username

      const prevCommentStats = await Post.aggregate([
        { $match: prevCommentMatch },
        {
          $group: {
            _id: null,
            totalComments: { $sum: 1 },
          },
        },
        { $project: { _id: 0 } },
      ])

      const currentComments = commentStats[0]?.totalComments || 0
      const prevComments = prevCommentStats[0]?.totalComments || 0

      if (prevComments > 0) {
        commentPercentageChange =
          ((currentComments - prevComments) / prevComments) * 100
      } else if (currentComments > 0) {
        commentPercentageChange = 100
      } else {
        commentPercentageChange = 0
      }
    }

    //--------------RESPONSE--------------//
    res.status(200).json({
      message: 'Post stats retrieved successfully',
      result: {
        post: adStats[0] || {},
        comment: commentStats[0] || {},
        postChangePercentage: percentageChange,
        commentPercentageChange: commentPercentageChange,
      },
    })
  } catch (error: any) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}
