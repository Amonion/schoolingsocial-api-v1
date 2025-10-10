import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  getNewsById,
  getNews,
  updateNews,
  deleteNews,
  createNews,
  getHomeFeed,
  searchNews,
  massDeleteNews,
} from '../../controllers/news/newsController'

const router = express.Router()

router.route('/mass-delete').patch(massDeleteNews)
router.route('/search').get(searchNews)
router.route('/feed').get(getHomeFeed).post(upload.any(), createNews)
router.route('/').get(getNews).post(upload.any(), createNews)
router
  .route('/:id')
  .get(getNewsById)
  .patch(upload.any(), updateNews)
  .delete(deleteNews)

export default router
