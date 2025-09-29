"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const authController_1 = require("../../controllers/users/authController");
const userController_1 = require("../../controllers/users/userController");
const bioUserController_1 = require("../../controllers/users/bioUserController");
const router = express_1.default.Router();
router.route('/create-account').post(upload.any(), userController_1.createUserAccount);
router.route('/username/:username').get(userController_1.getExistingUsername);
router.route('/login').post(upload.any(), authController_1.loginUser);
router.route('/auth').get(authController_1.getCurrentUser);
router.route('/bio-user').get(bioUserController_1.getBioUsers);
router
    .route('/bio-user/states')
    .get(bioUserController_1.getBioUsersState)
    .patch(upload.any(), bioUserController_1.updateBioUser);
router.route('/bio-user/username/:username').get(bioUserController_1.getBioUserByUsername);
router.route('/biouser-school/:username').get(bioUserController_1.getBioUserSchoolByUsername);
router.route('/biouser-school').get(bioUserController_1.searchBioUserSchoolInfo);
router.route('/bio-user/:id').get(bioUserController_1.getBioUser).patch(upload.any(), bioUserController_1.updateBioUser);
router
    .route('/bio-user/school/:id')
    .get(userController_1.getUserInfo)
    .patch(upload.any(), bioUserController_1.updateBioUserSchool);
router
    .route('/bio-user/settings/:id')
    .patch(upload.any(), bioUserController_1.updateBioUserSettings);
router
    .route('/bio-user/banks/:id')
    .get(bioUserController_1.getBioUserBank)
    .patch(upload.any(), bioUserController_1.updateBioUserBank);
router.route('/approve-user/:username').patch(upload.any(), bioUserController_1.approveUser);
router
    .route('/settings/:id')
    .get(userController_1.getUserSettings)
    .patch(upload.any(), userController_1.updateUserSettings);
router.route('/accounts').get(userController_1.searchAccounts);
router.route('/:username').get(userController_1.getAUser).patch(upload.any(), userController_1.updateUser);
router.route('/').get(userController_1.getUsers).post(upload.any(), userController_1.createUser);
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
exports.default = router;
