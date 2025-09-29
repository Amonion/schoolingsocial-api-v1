import express from 'express'
import multer from 'multer'
const upload = multer()
import {
  getSchoolByUsername,
  getSchools,
  updateSchool,
  deleteSchool,
  createSchool,
  searchSchools,
  searchSchool,
  updateLevels,
  recordAll,
  approveSchool,
  schoolApplication,
  cancelApplication,
  getStaff,
  getSchoolById,
  approveSchoolApplication,
  getSchoolStaffs,
  getSchoolNotifications,
} from '../../controllers/school/schoolController'

const router = express.Router()

router.route('/search').get(searchSchools)
router.route('/find').get(searchSchool)
router.route('/record-all').get(recordAll)
router.route('/').get(getSchools).post(upload.any(), createSchool)

router.route('/update-levels').post(upload.any(), updateLevels)
router.route('/approve/:username').patch(upload.any(), approveSchool)
router
  .route('/approve-application/:username')
  .patch(upload.any(), approveSchoolApplication)
router.route('/staffs/').get(getSchoolStaffs)

router.route('/notifications').get(getSchoolNotifications)
router.route('/:username').get(getSchoolByUsername).delete(deleteSchool)
router.route('/apply/:id').patch(schoolApplication)
router.route('/cancel/:id').patch(cancelApplication)
router.route('/staff/:id').get(getStaff)
router
  .route('/:id')
  .get(getSchoolById)
  .patch(upload.any(), updateSchool)
  .delete(deleteSchool)

export default router
