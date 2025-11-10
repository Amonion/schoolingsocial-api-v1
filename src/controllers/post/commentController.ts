import { Request, Response } from 'express'
import { IPost, Post } from '../../models/post/postModel'
import { uploadFilesToS3 } from '../../utils/fileUpload'
import { handleError } from '../../utils/errorHandler'
import { View } from '../../models/users/statModel'
import { postScore } from '../../utils/computation'
import { User } from '../../models/users/user'
import { queryData } from '../../utils/query'
import { processPosts } from './postController'
import { News } from '../../models/place/newsModel'

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
      polls: data.polls,
      users: data.users,
      replyTo: data.replyTo,
      uniqueId: data.uniqueId,
      userId: sender._id,
      postId: data.postId,
      level: data.level,
      replyToId: data.replyToId,
      postType: 'comment',
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

    const comment = await Post.create(form)
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
    const response = await queryData<IPost>(Post, req)
    const results = await processPosts(response.results, followerId, 'user')
    res.status(200).json({ results, count: response.count })
  } catch (error) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}
