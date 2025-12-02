import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  createChatWithFile,
  deleteChats,
  getChats,
  getFriends,
  updateChatWithFile,
} from '../../controllers/message/chatController'

const router = express.Router()

router
  .route('/')
  .get(getChats)
  .post(upload.any(), createChatWithFile)
  .patch(upload.any(), updateChatWithFile)
router.route('/friends').get(getFriends)

router.route('/mass-delete').post(upload.any(), deleteChats)

export default router
