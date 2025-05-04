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
router.route("/login").post(upload.any(), authController_1.loginUser);
router.route("/auth/:id").get(authController_1.getAuthUser);
router.route("/").get(userController_1.getUsers).post(upload.any(), userController_1.createUser);
router.route("/follow/:id").patch(upload.any(), userController_1.followUserAccount);
// router.route("/followUser/:id").patch(upload.any(), followUser);
router.route("/staffs").get(staffController_1.getStaffs);
router.route("/staffs/:id").get(staffController_1.getStaffById).patch(upload.any(), staffController_1.updateStaff);
router.route("/info").get(staffController_1.getStaffs);
router.route("/info/:id").patch(upload.any(), userController_1.updateInfo);
router.route("/username/:username").get(userController_1.getExistingUsername);
router.route("/details").get(userController_1.getManyUserDetails);
router
    .route("/details/:username")
    .get(userController_1.getUserDetails)
    .patch(upload.any(), userController_1.updateUserVerification);
router.route("/people").get(userController_1.searchUserInfo);
router.route("/accounts").get(userController_1.searchAccounts);
router
    .route("/userinfo/:id")
    .get(userController_1.getUserInfo)
    .post(upload.any(), userController_1.updateUserInfo);
router
    .route("/:username")
    .get(userController_1.getAUser)
    .patch(upload.any(), userController_1.updateUser)
    .delete(userController_1.deleteUser);
exports.default = router;
