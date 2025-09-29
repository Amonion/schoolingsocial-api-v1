import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  getEmailById,
  getEmails,
  updateEmail,
  deleteEmail,
  createEmail,
} from '../../controllers/message/emailController'

const router = express.Router()

router.route('/').get(getEmails).post(upload.any(), createEmail)

router
  .route('/:id')
  .get(getEmailById)
  .patch(upload.any(), updateEmail)
  .delete(deleteEmail)

export default router
