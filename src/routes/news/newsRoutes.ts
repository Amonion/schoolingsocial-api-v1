import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  getNewsById,
  updateNews,
  deleteNews,
  createNews,
  getInitialNews,
  searchNews,
  massDeleteNews,
  updateNewsViews,
  toggleSaveNews,
  toggleLikeNews,
  getNews,
} from '../../controllers/news/newsController'

const router = express.Router()

router.route('/mass-delete').patch(massDeleteNews)
router.route('/search').get(searchNews)
router.route('/feed').get(getInitialNews).post(upload.any(), createNews)
router.route('/').get(getNews).post(upload.any(), createNews)
router.route('/views').patch(upload.any(), updateNewsViews)
router.route('/bookmark').patch(upload.any(), toggleSaveNews)
router.route('/like').patch(upload.any(), toggleLikeNews)
router
  .route('/:id')
  .get(getNewsById)
  .patch(upload.any(), updateNews)
  .delete(deleteNews)

export default router
