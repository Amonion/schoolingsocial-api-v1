import express from 'express'
import multer from 'multer'
import {
  createAcademicLevel,
  createActivity,
  deleteAcademicLevel,
  getAcademicLevelById,
  getAcademicLevels,
  getActivities,
  getActivityById,
  updateAcademicLevel,
  updateActivity,
} from '../../controllers/place/academicLevelController'
const upload = multer()

const router = express.Router()

router
  .route('/activities')
  .get(getActivities)
  .post(upload.any(), createActivity)
router
  .route('/activities/:id')
  .get(getActivityById)
  .patch(upload.any(), updateActivity)

router.route('/').get(getAcademicLevels).post(upload.any(), createAcademicLevel)
router
  .route('/:id')
  .get(getAcademicLevelById)
  .patch(upload.any(), updateAcademicLevel)
  .delete(deleteAcademicLevel)
export default router
