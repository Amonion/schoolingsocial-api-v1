import express from 'express'
import multer from 'multer'
const upload = multer()

import { updateAd } from '../../controllers/utility/adController'
import {
  createTransaction,
  getAWallets,
  getTransactions,
} from '../../controllers/utility/transactionController'
import { getPayments } from '../../controllers/team/placeController'
const router = express.Router()

router.route('/wallets').get(getAWallets).patch(upload.any(), updateAd)
router.route('/').get(getTransactions).post(upload.any(), createTransaction)
router.route('/payments').get(getPayments)

export default router
