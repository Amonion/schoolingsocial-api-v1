import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  createTransaction,
  getAWallets,
  getTransactions,
} from '../../controllers/utility/transactionController'
import { updateAd } from '../../controllers/place/adsController'
const router = express.Router()

router.route('/wallets').get(getAWallets).patch(upload.any(), updateAd)
router.route('/').get(getTransactions).post(upload.any(), createTransaction)

export default router
