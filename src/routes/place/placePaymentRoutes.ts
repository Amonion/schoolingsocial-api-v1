import express from 'express'
import multer from 'multer'
import {
  createPayment,
  deletePayment,
  getPaymentById,
  getPayments,
  updatePayment,
} from '../../controllers/place/placePaymentController'
const upload = multer()

const router = express.Router()

router.route('/').get(getPayments).post(upload.any(), createPayment)

router
  .route('/:id')
  .get(getPaymentById)
  .patch(upload.any(), updatePayment)
  .delete(deletePayment)

export default router
