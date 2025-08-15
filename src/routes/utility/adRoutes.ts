import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  createAd,
  getAd,
  getDraftAd,
  updateAd,
} from '../../controllers/utility/adController'
const router = express.Router()

router.route('/drafted').get(getDraftAd)
router.route('/').get(getAd).post(upload.any(), createAd)
router.route('/:id').patch(upload.any(), updateAd)

export default router
