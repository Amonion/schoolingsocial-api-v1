import express from 'express'
import multer from 'multer'
const upload = multer()

import { getAdStats } from '../../controllers/company/dashboardController'

const router = express.Router()

router.route('/ad-stats').get(getAdStats).post(upload.any())

export default router
