import express from 'express'
import {
  getStaffs,
  makeStaffUser,
  makeUserStaff,
} from '../../controllers/users/staffController'
import multer from 'multer'
const upload = multer()

const router = express.Router()

router
  .route('/')
  .get(getStaffs)
  .patch(upload.any(), makeStaffUser)
  .post(upload.any(), makeUserStaff)

export default router
