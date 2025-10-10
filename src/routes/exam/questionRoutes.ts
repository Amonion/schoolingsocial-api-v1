import express from 'express'
import multer from 'multer'
import {
  assignSchoolQuestionPaper,
  createObjectives,
  createSchoolQuestionPaper,
  deleteSchoolQuestionPaper,
  getObjectives,
  getSchoolQuestionPaperById,
  getSchoolQuestionPapers,
  searchSchoolQuestionPapers,
  StartSchoolQuestionPapersCountDown,
  updateSchoolQuestionPaper,
} from '../../controllers/exam/questionController'

const upload = multer()

const router = express.Router()

router.route('/assign').patch(upload.any(), assignSchoolQuestionPaper)
router.route('/search').get(searchSchoolQuestionPapers)
router
  .route('/')
  .get(StartSchoolQuestionPapersCountDown, getSchoolQuestionPapers)
  .post(
    upload.any(),
    StartSchoolQuestionPapersCountDown,
    createSchoolQuestionPaper
  )

router
  .route('/objectives')
  .get(getObjectives)
  .post(upload.any(), createObjectives)

router
  .route('/:id')
  .get(StartSchoolQuestionPapersCountDown, getSchoolQuestionPaperById)
  .patch(
    upload.any(),
    StartSchoolQuestionPapersCountDown,
    updateSchoolQuestionPaper
  )
  .delete(deleteSchoolQuestionPaper)

export default router
