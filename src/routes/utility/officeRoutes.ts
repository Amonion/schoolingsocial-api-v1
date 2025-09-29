import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  assignClass,
  assignStaffRole,
  assignSubjects,
  createOfficeMessageTemplate,
  getOfficeByUsername,
  getOfficeMessageTemplateById,
  getOfficeMessageTemplates,
  getOffices,
  searchOffice,
  updateOfficeMessageTemplateById,
} from '../../controllers/utility/officeController'
import { getPositions } from '../../controllers/school/courseController'

const router = express.Router()
router.route('/search').get(searchOffice)
router.route('/positions').get(getPositions)
router.route('/assign-class').patch(upload.any(), assignClass)
router.route('/assign-subjects').patch(upload.any(), assignSubjects)
router.route('/').get(getOffices).patch(upload.any(), assignStaffRole)

router
  .route('/notification-templates')
  .get(getOfficeMessageTemplates)
  .post(upload.any(), createOfficeMessageTemplate)

router
  .route('/notification-templates/:id')
  .get(getOfficeMessageTemplateById)
  .patch(upload.any(), updateOfficeMessageTemplateById)

router.route('/:username').get(getOfficeByUsername)

export default router
