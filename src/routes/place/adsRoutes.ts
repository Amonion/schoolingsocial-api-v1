import express from 'express'
import multer from 'multer'
import {
  createAd,
  deleteAd,
  getAd,
  getAdById,
  getAds,
  getAdStats,
  getDraftAd,
  publishAdReview,
  updateAd,
} from '../../controllers/place/adsController'

const upload = multer()

const router = express.Router()

router.route('/mass-delete').post(upload.any(), createAd)

router.route('/drafted').get(getDraftAd)
router.route('/stats').get(getAdStats)
router.route('/').get(getAds).post(upload.any(), createAd)
router.route('/publish/:id').patch(upload.any(), publishAdReview)
router.route('/:id').get(getAd).patch(upload.any(), updateAd)

router
  .route('/:id')
  .get(getAdById)
  .patch(upload.any(), updateAd)
  .delete(deleteAd)

export default router
