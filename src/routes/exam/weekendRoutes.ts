import express from 'express'
import multer from 'multer'
import {
  createWeekend,
  getGiveaways,
  getWeekendById,
  getWeekends,
  searchWeekends,
  updateWeekend,
} from '../../controllers/exam/weekendController'
const upload = multer()

const router = express.Router()

router.route('/search').get(searchWeekends)
router.route('/giveaway').get(getGiveaways)
router.route('/').get(getWeekends).post(upload.any(), createWeekend)
router.route('/:id').get(getWeekendById).patch(upload.any(), updateWeekend)

export default router
