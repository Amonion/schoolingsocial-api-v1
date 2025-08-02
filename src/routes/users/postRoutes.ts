import express from 'express'
import multer from 'multer'
const upload = multer()
import path from 'path'
import fs from 'fs'

import {
  getAccountById,
  getAccounts,
  updateAccount,
  deleteAccount,
  createAccount,
  getPosts,
  makePost,
  createPost,
  getPostById,
  deletePost,
  updatePost,
  updatePostStat,
  getPostStat,
  followUser,
  getFollowingPosts,
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
  checkNudeMedia,
} from '../../controllers/users/postController'

import {
  getUploadById,
  getUploads,
  updateUpload,
  deleteUpload,
  createUpload,
  multiSearch,
} from '../../controllers/users/uploadController'

const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`)
  },
})

const uploadFile = multer({ storage })
const router = express.Router()
router.route('/follow/:id').patch(upload.any(), followUser)
router.route('/poll/:id').post(upload.any(), updatePoll)
router.route('/followers').get(getFollowings)
router.route('/uploads').get(getUploads).post(upload.any(), createUpload)
router.route('/accounts').get(getAccounts).post(upload.any(), createAccount)
router.route('/stats').get(getPostStat).patch(upload.any(), updatePostStat)
router.route('/repost/:id').post(upload.any(), repostPost)
router.route('/pin/:id').post(upload.any(), pinPost)
router.route('/block/:id').post(upload.any(), blockUser)
router.route('/blocks').get(getBlockedUsers)
router.route('/mutes').get(getMutedUsers)
router.route('/mute/:id').patch(upload.any(), muteUser)
router.route('/view').patch(updatePostViews)
router.route('/general').get(multiSearch)
router.route('/').get(getPosts).post(upload.any(), createPost)
router.route('/create').get(getPosts).post(upload.any(), makePost)
router.route('/following').get(getFollowingPosts)
router.route('/bookmarks').get(getBookMarkedPosts)
router.route('/search').get(searchPosts)
router.route('/check-nsfw').post(uploadFile.single('file'), checkNudeMedia)
router
  .route('/uploads/:id')
  .get(getUploadById)
  .patch(upload.any(), updateUpload)
  .delete(deleteUpload)

router
  .route('/accounts/:id')
  .get(getAccountById)
  .patch(upload.any(), updateAccount)
  .delete(deleteAccount)

router
  .route('/:id')
  .get(getPostById)
  .patch(upload.any(), updatePost)
  .delete(deletePost)

export default router
