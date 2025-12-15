import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  getCompanyById,
  getCompany,
  updateCompany,
  getExpensesById,
  getExpenses,
  updateExpenses,
  createExpenses,
  createPolicy,
  getPolcies,
  updatePolicy,
  getPolicyById,
  deletePolicy,
  searchExpenses,
} from '../../controllers/company/companyController'
import {
  createPosition,
  deletePositions,
  getPositionById,
  getPositions,
  searchPositions,
  updatePosition,
} from '../../controllers/company/positionController'

const router = express.Router()

router.route('/').get(getCompany).patch(upload.any(), updateCompany)
router.route('/policy').get(getPolcies).post(upload.any(), createPolicy)
router.route('/expenses').get(getExpenses).post(upload.any(), createExpenses)
router.route('/expenses/search').get(searchExpenses)
router.route('/positions').get(getPositions).post(upload.any(), createPosition)
router.route('/positions/mass-delete').patch(deletePositions)
router.route('/positions/search').get(searchPositions)

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

export default router
