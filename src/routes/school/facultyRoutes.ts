import express from 'express'
import multer from 'multer'
const upload = multer()
import {
  createFaculty,
  deleteFaculty,
  getFaculties,
  getFacultyById,
  updateFaculty,
} from '../../controllers/school/facultyController'

const router = express.Router()
router.route('/').get(getFaculties).post(upload.any(), createFaculty)

router
  .route('/:id')
  .get(getFacultyById)
  .patch(upload.any(), updateFaculty)
  .delete(deleteFaculty)

export default router
