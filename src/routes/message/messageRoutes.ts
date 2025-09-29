import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  getOfficialMessage,
  getOfficialMessages,
  readOfficeMessages,
  sendOfficesMessage,
} from '../../controllers/message/officialMessageController'
import {
  getPersonalMessage,
  getPersonalMessages,
  readPersonalMessages,
} from '../../controllers/message/personalMessageController'

const router = express.Router()

router.route('/send').patch(upload.any(), sendOfficesMessage)

router.route('/official').get(getOfficialMessages)
router.route('/official/read').patch(upload.any(), readOfficeMessages)
router.route('/official/:id').get(getOfficialMessage)

router.route('/personal').get(getPersonalMessages)
router.route('/personal/read').patch(upload.any(), readPersonalMessages)
router.route('/personal/:id').get(getPersonalMessage)

export default router
