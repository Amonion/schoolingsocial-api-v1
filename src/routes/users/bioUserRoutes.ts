import express from 'express'
import multer from 'multer'
const upload = multer()

import {
  approveUser,
  getBioUser,
  getBioUserBank,
  getBioUserByUsername,
  getBioUsers,
  getBioUsersState,
  searchBioUserState,
  updateBioUser,
  updateBioUserBank,
  updateBioUserSettings,
} from '../../controllers/users/bioUserController'

const router = express.Router()
router.route('/').get(getBioUsers)

router.route('/states').get(getBioUsersState).patch(upload.any(), updateBioUser)
router.route('/states/search').get(searchBioUserState)

router.route('/username/:username').get(getBioUserByUsername)
router.route('/:id').get(getBioUser).patch(upload.any(), updateBioUser)

router.route('/settings/:id').patch(upload.any(), updateBioUserSettings)

router
  .route('/banks/:id')
  .get(getBioUserBank)
  .patch(upload.any(), updateBioUserBank)

router.route('/approve-user/:username').patch(upload.any(), approveUser)

export default router
