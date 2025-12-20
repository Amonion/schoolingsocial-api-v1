import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  getBioUserPastSchools,
  getBioUserSchoolByUsername,
  getBioUsersSchool,
  searchBioUserSchoolInfo,
  searchBioUsersSchool,
  updateBioUserSchool,
} from '../../controllers/users/bioUserController'

const router = express.Router()
router.route('/').get(getBioUsersSchool)

router.route('/search').get(searchBioUsersSchool)
router.route('/:username').get(getBioUserSchoolByUsername)
router.route('/').get(searchBioUserSchoolInfo)

router
  .route('/schools/:id')
  .get(getBioUserPastSchools)
  .patch(upload.any(), updateBioUserSchool)

export default router
