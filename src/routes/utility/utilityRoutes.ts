import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  getWeekendById,
  getWeekends,
  updateWeekend,
  createWeekend,
  getExamById,
  getExams,
  getUserExam,
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
  initExam,
} from '../../controllers/users/competitionController'
import { getPostStats } from '../../controllers/utility/dashboardController'

const router = express.Router()

router.route('/').get(getWeekends).post(upload.any(), createWeekend)
router.route('/leagues/papers').get(getPapers).post(upload.any(), createPaper)
router
  .route('/leagues/objectives')
  .get(getObjectives)
  .post(upload.any(), createObjective)
router.route('/leagues').get(getLeagues).post(upload.any(), createLeague)
router.route('/exams').get(getUserExam).post(upload.any(), createExam)
router.route('/init').post(upload.any(), initExam)
router.route('/table').get(getExams)
router.route('/exams/find').get(searchExamInfo)

router
  .route('/leagues/papers/:id')
  .get(getPaperById)
  .patch(upload.any(), updatePaper)

router
  .route('/leagues/:id')
  .get(getLeagueById)
  .patch(upload.any(), updateLeague)

router.route('/dashboard').get(getPostStats)

export default router
