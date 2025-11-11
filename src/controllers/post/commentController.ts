import { Request, Response } from 'express'
import { Post } from '../../models/post/postModel'
import { uploadFilesToS3 } from '../../utils/fileUpload'
import { handleError } from '../../utils/errorHandler'
import { Like, Bookmark, View, Hate } from '../../models/users/statModel'
import { postScore } from '../../utils/computation'
import { User } from '../../models/users/user'
import { queryData } from '../../utils/query'
import { News } from '../../models/place/newsModel'
import { Comment, IComment } from '../../models/post/commentModel'

/////////////////////////////// POST /////////////////////////////////
export const createComment = async (req: Request, res: Response) => {
  try {
    const sender = req.body.sender
    const data = { ...req.body }
    if (data._id) {
      delete data._id
    }

    const uploadedFiles = await uploadFilesToS3(req)
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url
    })

    const form = {
      picture: sender.picture,
      username: sender.username,
      displayName: sender.displayName,
      users: data.users,
      replyTo: data.replyTo,
      uniqueId: data.uniqueId,
      userId: sender._id,
      postId: data.postId,
      level: data.level,
      replyToId: data.replyToId,
      content: data.content,
      createdAt: data.createdAt,
      commentMedia: req.body.commentMedia,
      score: 0.5,
      status: data.status,
      isVerified: sender.isVerified,
    }

    if (data.commentSource && data.commentSource === 'news') {
      const news = await News.findById(data.postId)
      const score = postScore('comments', news.score)
      if (data.replyToId) {
        await News.updateOne(
          { _id: data.replyToId },
          {
            $inc: { replies: 1, score: 3 },
          }
        )
      } else if (data.replyToId !== data.postId) {
        await News.findByIdAndUpdate(data.postId, {
          $inc: { replies: 1 },
          $set: { score: score },
        })
      }
    } else {
      const post = await Post.findById(data.postId)
      const score = postScore('comments', post.score)

      if (data.replyToId) {
        await Post.updateOne(
          { _id: data.replyToId },
          {
            $inc: { replies: 1, score: 3 },
          }
        )
      } else if (data.replyToId !== data.postId) {
        await Post.findByIdAndUpdate(data.postId, {
          $inc: { replies: 1 },
          $set: { score: score },
        })
      }
      await View.create({
        postId: post._id,
        userId: sender._id,
      })
    }

    const comment = await Comment.create(form)
    await User.updateOne(
      { _id: sender._id },
      {
        $inc: { comments: 1 },
      }
    )

    res.status(200).json({
      data: comment,
    })
  } catch (error) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}

export const getComments = async (req: Request, res: Response) => {
  try {
    const followerId = String(req.query.myId)
    delete req.query.myId
    const response = await queryData<IComment>(Comment, req)
    const results = await processComment(response.results, followerId)
    res.status(200).json({ results, count: response.count })
  } catch (error) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}

export const processComment = async (comments: IComment[], userId: string) => {
  const commentsIds = comments.map((item) => item._id)

  const likedComments = await Like.find({
    userId: userId,
    postId: { $in: commentsIds },
  }).select('postId')

  const hatedComments = await Hate.find({
    userId: userId,
    postId: { $in: commentsIds },
  }).select('postId')

  const likedCommentIds = likedComments.map((like) => like.postId.toString())
  const hatedCommentIds = hatedComments.map((like) => like.postId.toString())
  const updateComments = []

  for (let i = 0; i < comments.length; i++) {
    const el = comments[i]

    if (likedCommentIds && likedCommentIds.includes(el._id.toString())) {
      el.liked = true
    }
    if (hatedCommentIds && hatedCommentIds.includes(el._id.toString())) {
      el.liked = true
    }

    updateComments.push(el)
  }

  const results = updateComments
  return results
}

export const toggleLikeComment = async (req: Request, res: Response) => {
  try {
    const { userId, id } = req.body
    let updateQuery: any = {}
    let score = 0

    const comment = await Comment.findById(id)

    if (!comment) {
      return res.status(404).json({ message: 'comment not found' })
    }

    const like = await Like.findOne({ postId: id, userId })
    if (like) {
      updateQuery.$inc = { likes: -1 }
      await Like.deleteOne({ postId: id, userId })
      score = comment.score - 2
    } else {
      score = postScore('likes', comment.score)
      updateQuery.$inc = { likes: 1 }
      await Like.create({ postId: id, userId })
      const hate = await Hate.findOne({ postId: id, userId })
      if (hate) {
        updateQuery.$inc.hates = -1
        await Hate.deleteOne({ postId: id, userId })
      }
    }

    await Comment.findByIdAndUpdate(comment._id, {
      $set: { score: score },
    })

    await Comment.findByIdAndUpdate(id, updateQuery, {
      new: true,
    })
    return res.status(200).json({ message: null })
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const toggleHateComment = async (req: Request, res: Response) => {
  try {
    const { userId, id } = req.body
    let updateQuery: any = { $inc: {}, $set: {} }
    let score = 0

    const comment = await Comment.findById(id)
    if (!comment) {
      return res.status(404).json({ message: 'comment not found' })
    }

    const hate = await Hate.findOne({ postId: id, userId })
    if (hate) {
      // Remove hate
      updateQuery.$inc.hates = -1
      await Hate.deleteOne({ postId: id, userId })
      score = comment.score - 2
    } else {
      // Add hate
      score = postScore('hates', comment.score)
      updateQuery.$inc.hates = 1
      await Hate.create({ postId: id, userId })

      // Remove like if exists
      const like = await Like.findOne({ postId: id, userId })
      if (like) {
        updateQuery.$inc.likes = -1
        await Like.deleteOne({ postId: id, userId })
      }
    }

    // Merge score into one update query
    updateQuery.$set.score = score

    await Comment.findByIdAndUpdate(id, updateQuery, { new: true })

    return res.status(200).json({ message: null })
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}
