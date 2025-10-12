import express from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
const upload = multer()

import {
  getPosts,
  createPost,
  getPostById,
  deletePost,
  updatePost,
  updatePostStat,
  getPostStat,
  followUser,
  getBookMarkedPosts,
  searchPosts,
  updatePostViews,
  repostPost,
  pinPost,
  muteUser,
  blockUser,
  getFollowings,
  getBlockedUsers,
  getMutedUsers,
  updatePoll,
  getFollowers,
  getUserPosts,
  // checkNudeMedia,
} from '../../controllers/post/postController'

import {
  getUploadById,
  getUploads,
  updateUpload,
  deleteUpload,
  createUpload,
} from '../../controllers/users/uploadController'
import {
  createComment,
  getComments,
} from '../../controllers/post/commentController'
import { getMoments } from '../../controllers/post/momentController'

const router = express.Router()
router.route('/follow/:id').patch(upload.any(), followUser)
router.route('/poll/:id').post(upload.any(), updatePoll)
router.route('/followers').get(getFollowers)
router.route('/uploads').get(getUploads).post(upload.any(), createUpload)
router.route('/stats').get(getPostStat).patch(upload.any(), updatePostStat)
router.route('/repost/:id').post(upload.any(), repostPost)
router.route('/pin/:id').post(upload.any(), pinPost)
router.route('/block/:id').post(upload.any(), blockUser)
router.route('/blocks').get(getBlockedUsers)
router.route('/mutes').get(getMutedUsers)
router.route('/mute/:id').patch(upload.any(), muteUser)
router.route('/view').patch(updatePostViews)
router.route('/user').get(getUserPosts)
router.route('/').get(getPosts).post(upload.any(), createPost)
router.route('/following').get(getFollowings)
router.route('/bookmarks').get(getBookMarkedPosts)
router.route('/search').get(searchPosts)
// router.route('/check-nsfw').post(uploadFile.single('file'), checkNudeMedia)

router.route('/comments').get(getComments).post(upload.any(), createComment)
router.route('/moments').get(getMoments)
router
  .route('/uploads/:id')
  .get(getUploadById)
  .patch(upload.any(), updateUpload)
  .delete(deleteUpload)

router
  .route('/:id')
  .get(getPostById)
  .patch(upload.any(), updatePost)
  .delete(deletePost)

export default router
