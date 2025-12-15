import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  getExamById,
  getExams,
  updateExam,
  createExam,
  searchExamInfo,
  getLeagueById,
  getLeagues,
  updateLeague,
  createLeague,
  getPaperById,
  getPapers,
  updatePaper,
  createPaper,
  getObjectives,
  createObjective,
} from '../../controllers/exam/competitionController'

const router = express.Router()

router.route('/leagues/papers').get(getPapers).post(upload.any(), createPaper)
router
  .route('/leagues/objectives')
  .get(getObjectives)
  .post(upload.any(), createObjective)
router.route('/leagues').get(getLeagues).post(upload.any(), createLeague)
router.route('/exams').get(getExams).post(upload.any(), createExam)
router.route('/exams/find').get(searchExamInfo)

router
  .route('/leagues/papers/:id')
  .get(getPaperById)
  .patch(upload.any(), updatePaper)

router
  .route('/leagues/:id')
  .get(getLeagueById)
  .patch(upload.any(), updateLeague)

router.route('/exams/:id').get(getExamById).patch(upload.any(), updateExam)

export default router
