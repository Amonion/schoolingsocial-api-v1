import express from 'express'
import multer from 'multer'
const upload = multer()
import { loginUser, getAuthUser } from '../../controllers/users/authController'
import {
  getAUser,
  getUsers,
  updateUser,
  deleteUser,
  createUser,
  updateUserInfo,
  getUserInfo,
  searchUserInfo,
  updateUserVerification,
  // followUser,
  updateInfo,
  getUserDetails,
  getExistingUsername,
  getManyUserDetails,
  searchAccounts,
  followUserAccount,
  updateUserSettings,
  getUserSettings,
  getUserAccountInfo,
  updateUserAccountInfo,
  updateUserInfoApp,
  updateUserSchoolInfo,
  getUserSchoolInfo,
} from '../../controllers/users/userController'
import {
  getStaffById,
  getStaffs,
  updateStaff,
} from '../../controllers/team/staffController'

const router = express.Router()

console.log('✅ User Routes Loaded')
router.stack.forEach((layer: any) => {
  if (layer.route) {
    console.log('Route:', layer.route.path, 'Methods:', layer.route.methods)
  }
})

router.route('/login').post(upload.any(), loginUser)
router.route('/auth/:id').get(getAuthUser)

router.route('/').get(getUsers).post(upload.any(), createUser)

router.route('/follow/:id').patch(upload.any(), followUserAccount)
// router.route("/followUser/:id").patch(upload.any(), followUser);
router.route('/staffs').get(getStaffs)
router.route('/staffs/:id').get(getStaffById).patch(upload.any(), updateStaff)

router.route('/info').get(getStaffs)
router.route('/info/:id').patch(upload.any(), updateInfo)
router.route('/username/:username').get(getExistingUsername)
router.route('/details').get(getManyUserDetails)
router
  .route('/details/:username')
  .get(getUserDetails)
  .patch(upload.any(), updateUserVerification)
router.route('/people').get(searchUserInfo)
router.route('/accounts').get(searchAccounts)
router
  .route('/user-bank-account/:id')
  .get(getUserAccountInfo)
  .patch(upload.any(), updateUserAccountInfo)

router
  .route('/userinfo/:id')
  .get(getUserInfo)
  .post(upload.any(), updateUserInfo)

router
  .route('/school-app/:id')
  .get(getUserSchoolInfo)
  .patch(upload.any(), updateUserSchoolInfo)

router
  .route('/userinfo-app/:id')
  .get(getUserInfo)
  .patch(upload.any(), updateUserInfoApp)

router
  .route('/settings/:id')
  .get(getUserSettings)
  .patch(upload.any(), updateUserSettings)

router.route('/:username').get(getAUser)

router.route('/:id').patch(upload.any(), updateUser).delete(deleteUser)

console.log('✅ User Routes Loaded')
router.stack.forEach((layer: any) => {
  if (layer.route) {
    console.log('Route:', layer.route.path, 'Methods:', layer.route.methods)
  }
})

export default router
