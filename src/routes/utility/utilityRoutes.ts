import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  getExamById,
  getExams,
  getUserExam,
  updateExam,
  searchExamInfo,
  initExam,
} from '../../controllers/users/competitionController'
import { getPostStats } from '../../controllers/post/postStatController'

const router = express.Router()

router.route('/exams').get(getUserExam)
router.route('/init').post(upload.any(), initExam)
router.route('/table').get(getExams)
router.route('/exams/find').get(searchExamInfo)

router.route('/dashboard').get(getPostStats)

export default router
