import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  getCompanyById,
  getCompanies,
  updateCompany,
  createCompany,
  getExpensesById,
  getExpenses,
  updateExpenses,
  createExpenses,
  getPositionById,
  getPositions,
  updatePosition,
  createPosition,
  getInterests,
  updateInterest,
  createInterest,
  createPolicy,
  getPolcies,
  updatePolicy,
  getPolicyById,
  deletePolicy,
} from '../../controllers/team/companyController'

const router = express.Router()

router.route('/').get(getCompanies).post(upload.any(), createCompany)
router.route('/policy').get(getPolcies).post(upload.any(), createPolicy)
router.route('/expenses').get(getExpenses).post(upload.any(), createExpenses)
router.route('/positions').get(getPositions).post(upload.any(), createPosition)
router.route('/interests').get(getInterests).post(upload.any(), createInterest)

router.route('/interests/:id').patch(upload.any(), updatePosition)

router
  .route('/positions/:id')
  .get(getPositionById)
  .patch(upload.any(), updatePosition)
router
  .route('/policy/:id')
  .get(getPolicyById)
  .patch(upload.any(), updatePolicy)
  .delete(deletePolicy)

router
  .route('/expenses/:id')
  .get(getExpensesById)
  .patch(upload.any(), updateExpenses)

router.route('/:id').get(getCompanyById).patch(upload.any(), updateCompany)

export default router
