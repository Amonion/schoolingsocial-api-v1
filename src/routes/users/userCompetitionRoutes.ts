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
  submitTest,
} from '../../controllers/users/competitionController'

const router = express.Router()

router.route('/exams/submit').post(upload.any(), submitTest)
router.route('/exams').get(getUserExam).post(upload.any(), initExam)
router.route('/table').get(getExams)
router.route('/exams/find').get(searchExamInfo)

router.route('/exams/:id').get(getExamById).patch(upload.any(), initExam)

export default router
