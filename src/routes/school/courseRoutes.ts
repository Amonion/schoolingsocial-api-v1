import express from 'express'
import multer from 'multer'
const upload = multer()
import {
  createCourse,
  createSubject,
  deleteCourse,
  deleteSubject,
  getCourseById,
  getCourses,
  getStaffSubjectById,
  getStaffSubjects,
  getSubjectById,
  getSubjects,
  updateCourse,
  updateStaffSubject,
  updateSubject,
} from '../../controllers/school/courseController'

const router = express.Router()

router.route('/staff-subjects').get(getStaffSubjects)
router
  .route('/staff-subjects/:id')
  .get(getStaffSubjectById)
  .patch(upload.any(), updateStaffSubject)
router.route('/subjects').get(getSubjects).post(upload.any(), createSubject)
router.route('/').get(getCourses).post(upload.any(), createCourse)

router
  .route('/subjects/:id')
  .get(getSubjectById)
  .patch(upload.any(), updateSubject)
  .delete(deleteSubject)

router
  .route('/:id')
  .get(getCourseById)
  .patch(upload.any(), updateCourse)
  .delete(deleteCourse)

export default router
