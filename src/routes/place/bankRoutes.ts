import express from 'express'
import multer from 'multer'
import {
  createBank,
  deleteBank,
  getBankById,
  getBanks,
  updateBank,
} from '../../controllers/place/bankController'
const upload = multer()

const router = express.Router()

router.route('/').get(getBanks).post(upload.any(), createBank)
router
  .route('/:id')
  .get(getBankById)
  .patch(upload.any(), updateBank)
  .delete(deleteBank)
export default router
