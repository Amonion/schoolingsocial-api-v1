import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  createComment,
  getComments,
  toggleHateComment,
  toggleLikeComment,
} from '../../controllers/post/commentController'

const router = express.Router()
router.route('/like').patch(upload.any(), toggleLikeComment)
router.route('/hate').patch(upload.any(), toggleHateComment)

router.route('/').get(getComments).post(upload.any(), createComment)

export default router
