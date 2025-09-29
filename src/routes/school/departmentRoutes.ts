import express from 'express'
import multer from 'multer'
const upload = multer()
import {
  createDepartment,
  deleteDepartment,
  getDepartmentById,
  getDepartments,
  updateDepartment,
} from '../../controllers/school/departmentController'

const router = express.Router()

router.route('/').get(getDepartments).post(upload.any(), createDepartment)

router
  .route('/:id')
  .get(getDepartmentById)
  .patch(upload.any(), updateDepartment)
  .delete(deleteDepartment)

export default router
