import express from 'express'
import multer from 'multer'
const upload = multer()
import {
  createSchoolPayment,
  deleteSchoolPayment,
  getSchoolPaymentById,
  getSchoolPayments,
  updateSchoolPayment,
} from '../../controllers/school/schoolPaymentController'

const router = express.Router()

router
  .route('/payments')
  .get(getSchoolPayments)
  .post(upload.any(), createSchoolPayment)

router
  .route('/payments/:id')
  .get(getSchoolPaymentById)
  .patch(upload.any(), updateSchoolPayment)
  .delete(deleteSchoolPayment)
export default router
