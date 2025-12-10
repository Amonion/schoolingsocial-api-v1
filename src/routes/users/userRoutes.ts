import express from 'express'
import multer from 'multer'
const upload = multer()
import {
  loginUser,
  getCurrentUser,
} from '../../controllers/users/authController'
import {
  getAUser,
  getUsers,
  updateUser,
  createUser,
  getExistingUsername,
  searchAccounts,
  followUserAccount,
  updateUserSettings,
  getUserSettings,
  createUserAccount,
  getChatUser,
  suspendUsers,
  unSuspendUsers,
} from '../../controllers/users/userController'

const router = express.Router()
router.route('/create-account').post(upload.any(), createUserAccount)
router.route('/chat/:username').get(getChatUser)
router.route('/username/:username').get(getExistingUsername)
router.route('/login').post(upload.any(), loginUser)
router.route('/suspend').patch(upload.any(), suspendUsers)
router.route('/unsuspend').patch(upload.any(), unSuspendUsers)
router.route('/auth').get(getCurrentUser)
router.route('/follow/:id').patch(upload.any(), followUserAccount)

router
  .route('/settings/:id')
  .get(getUserSettings)
  .patch(upload.any(), updateUserSettings)

router.route('/accounts').get(searchAccounts)
router.route('/:username').get(getAUser).patch(upload.any(), updateUser)
router.route('/').get(getUsers).post(upload.any(), createUser)
///////////// NEW USER ROUTES ////////////////

export default router
