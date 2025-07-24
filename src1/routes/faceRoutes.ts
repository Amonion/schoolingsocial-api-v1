import express from 'express'
import multer from 'multer'
const upload = multer()

import { detectFace } from '../controllers/faceController'

const router = express.Router()

router.route('/').post(upload.any(), detectFace)

export default router
