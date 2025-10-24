import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  getEmailById,
  updateEmail,
  deleteEmail,
} from '../../controllers/message/emailController'
import { getChats, getFriends } from '../../controllers/message/chatController'

const router = express.Router()

router.route('/').get(getChats)
router.route('/friends').get(getFriends)

router
  .route('/:id')
  .get(getEmailById)
  .patch(upload.any(), updateEmail)
  .delete(deleteEmail)

export default router
