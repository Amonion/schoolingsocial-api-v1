import express from 'express'
import multer from 'multer'
const upload = multer()
import {
  loginUser,
  getAuthUser,
  getCurrentUser,
} from '../../controllers/users/authController'
import {
  getAUser,
  getUsers,
  updateUser,
  deleteUser,
  createUser,
  getUserInfo,
  // followUser,
  getUserDetails,
  getExistingUsername,
  getManyUserDetails,
  searchAccounts,
  followUserAccount,
  updateUserSettings,
  getUserSettings,
  getUserAccountInfo,
  updateUserAccountInfo,
  getUserSchoolInfo,
  deleteMyData,
  createUserAccount,
} from '../../controllers/users/userController'

import {
  approveUser,
  getBioUser,
  getBioUserBank,
  getBioUserByUsername,
  getBioUsers,
  getBioUserSchoolByUsername,
  getBioUsersState,
  searchBioUserSchoolInfo,
  searchBioUsersSchool,
  updateBioUser,
  updateBioUserBank,
  updateBioUserSchool,
  updateBioUserSettings,
} from '../../controllers/users/bioUserController'

const router = express.Router()
router.route('/create-account').post(upload.any(), createUserAccount)
router.route('/username/:username').get(getExistingUsername)
router.route('/login').post(upload.any(), loginUser)

router.route('/auth').get(getCurrentUser)
router.route('/bio-user').get(getBioUsers)

router
  .route('/bio-user/states')
  .get(getBioUsersState)
  .patch(upload.any(), updateBioUser)

router.route('/bio-user/username/:username').get(getBioUserByUsername)
router.route('/biouser-school/search').get(searchBioUsersSchool)
router.route('/biouser-school/:username').get(getBioUserSchoolByUsername)
router.route('/biouser-school').get(searchBioUserSchoolInfo)
router.route('/bio-user/:id').get(getBioUser).patch(upload.any(), updateBioUser)

router
  .route('/bio-user/school/:id')
  .get(getUserInfo)
  .patch(upload.any(), updateBioUserSchool)

router
  .route('/bio-user/settings/:id')
  .patch(upload.any(), updateBioUserSettings)

router
  .route('/bio-user/banks/:id')
  .get(getBioUserBank)
  .patch(upload.any(), updateBioUserBank)

router.route('/approve-user/:username').patch(upload.any(), approveUser)

router
  .route('/settings/:id')
  .get(getUserSettings)
  .patch(upload.any(), updateUserSettings)

router.route('/accounts').get(searchAccounts)
router.route('/:username').get(getAUser).patch(upload.any(), updateUser)
router.route('/').get(getUsers).post(upload.any(), createUser)
///////////// NEW USER ROUTES ////////////////

// router.route('/auth/:id').get(getAuthUser)

// router.route('/follow/:id').patch(upload.any(), followUserAccount)
// router.route('/staffs').get(getStaffs)
// router.route('/staffs/:id').get(getStaffById).patch(upload.any(), updateStaff)

// router.route('/info').get(getStaffs)
// router.route('/delete/:id').post(deleteMyData)
// router.route('/info/:id').patch(upload.any(), updateInfo)
// router.route('/username/:username').get(getExistingUsername)
// router.route('/details').get(getManyUserDetails)
// router
//   .route('/details/:username')
//   .get(getUserDetails)
//   .patch(upload.any(), updateUserVerification)
// router.route('/accounts').get(searchAccounts)
// router
//   .route('/user-bank-account/:id')
//   .get(getUserAccountInfo)
//   .patch(upload.any(), updateUserAccountInfo)

// router
//   .route('/userinfo/:id')
//   .get(getUserInfo)
//   .post(upload.any(), updateUserInfo)

// router
//   .route('/school-app/:id')
//   .get(getUserSchoolInfo)
//   .patch(upload.any(), updateUserSchoolInfo)

// router
//   .route('/userinfo-app/:id')
//   .get(getUserInfo)
//   .patch(upload.any(), updateUserInfoApp)
//   .post(upload.any(), updateUserInfoApp)

// router
//   .route('/settings/:id')
//   .get(getUserSettings)
//   .patch(upload.any(), updateUserSettings)

// router.route('/:username').get(getAUser)

// router.route('/:id').patch(upload.any(), updateUser).delete(deleteUser)

export default router
