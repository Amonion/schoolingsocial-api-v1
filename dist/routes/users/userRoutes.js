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
const staffController_1 = require("../../controllers/team/staffController");
const router = express_1.default.Router();
// router.route('/login').post(upload.any(), loginUser)
// router.route('/auth/:id').get(getAuthUser)
// router.route('/').get(getUsers).post(upload.any(), createUser)
// router.route('/follow/:id').patch(upload.any(), followUserAccount)
// // router.route("/followUser/:id").patch(upload.any(), followUser);
// router.route('/staffs').get(getStaffs)
// router.route('/staffs/:id').get(getStaffById).patch(upload.any(), updateStaff)
// router.route('/info').get(getStaffs)
// router.route('/info/:id').patch(upload.any(), updateInfo)
// router.route('/username/:username').get(getExistingUsername)
// router.route('/details').get(getManyUserDetails)
// router
//   .route('/details/:username')
//   .get(getUserDetails)
//   .patch(upload.any(), updateUserVerification)
// router.route('/people').get(searchUserInfo)
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
// router
//   .route('/settings/:id')
//   .get(getUserSettings)
//   .patch(upload.any(), updateUserSettings)
// router.route('/:username').get(getAUser)
// router.route('/:id').patch(upload.any(), updateUser).delete(deleteUser)
// export default router
// ✅ Fixed route ordering
router.route('/login').post(upload.any(), authController_1.loginUser);
router.route('/auth/:id').get(authController_1.getAuthUser);
router.route('/').get(userController_1.getUsers).post(upload.any(), userController_1.createUser);
router.route('/follow/:id').patch(upload.any(), userController_1.followUserAccount);
router.route('/staffs').get(staffController_1.getStaffs);
router.route('/staffs/:id').get(staffController_1.getStaffById).patch(upload.any(), staffController_1.updateStaff);
router.route('/info').get(staffController_1.getStaffs);
router.route('/info/:id').patch(upload.any(), userController_1.updateInfo);
router.route('/username/:username').get(userController_1.getExistingUsername);
router.route('/details').get(userController_1.getManyUserDetails);
router
    .route('/details/:username')
    .get(userController_1.getUserDetails)
    .patch(upload.any(), userController_1.updateUserVerification);
router.route('/people').get(userController_1.searchUserInfo);
router.route('/accounts').get(userController_1.searchAccounts);
router
    .route('/user-bank-account/:id')
    .get(userController_1.getUserAccountInfo)
    .patch(upload.any(), userController_1.updateUserAccountInfo);
router
    .route('/userinfo/:id')
    .get(userController_1.getUserInfo)
    .post(upload.any(), userController_1.updateUserInfo);
router
    .route('/school-app/:id')
    .get(userController_1.getUserSchoolInfo)
    .patch(upload.any(), userController_1.updateUserSchoolInfo);
router
    .route('/userinfo-app/:id')
    .get(userController_1.getUserInfo)
    .patch(upload.any(), userController_1.updateUserInfoApp);
router
    .route('/settings/:id')
    .get(userController_1.getUserSettings)
    .patch(upload.any(), userController_1.updateUserSettings);
// ✅ Place dynamic routes LAST
router.route('/:id').patch(upload.any(), userController_1.updateUser).delete(userController_1.deleteUser);
router.route('/:username').get(userController_1.getAUser);
exports.default = router;
