import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  createAd,
  getAd,
  getAds,
  getAdStats,
  getDraftAd,
  publishAdReview,
  updateAd,
} from '../../controllers/utility/adController'
const router = express.Router()

router.route('/drafted').get(getDraftAd)
router.route('/stats').get(getAdStats)
router.route('/').get(getAds).post(upload.any(), createAd)
router.route('/publish/:id').patch(upload.any(), publishAdReview)
router.route('/:id').get(getAd).patch(upload.any(), updateAd)

export default router
