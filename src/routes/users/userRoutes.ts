import express from "express";
import multer from "multer";
const upload = multer();
import { loginUser, getAuthUser } from "../../controllers/users/authController";
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
  followUser,
  updateInfo,
  getUserDetails,
  getExistingUsername,
} from "../../controllers/users/userController";
import {
  getStaffById,
  getStaffs,
  updateStaff,
} from "../../controllers/team/staffController";

const router = express.Router();
router.route("/login").post(upload.any(), loginUser);
router.route("/auth/:id").get(getAuthUser);

router.route("/").get(getUsers).post(upload.any(), createUser);

router.route("/follow/:id").patch(upload.any(), followUser);
router.route("/staffs").get(getStaffs);
router.route("/staffs/:id").get(getStaffById).patch(upload.any(), updateStaff);

router.route("/info").get(getStaffs);
router.route("/info/:id").patch(upload.any(), updateInfo);
router.route("/username/:username").get(getExistingUsername);
router.route("/details").get(getUserDetails);
router
  .route("/details/:username")
  .get(getUserDetails)
  .patch(upload.any(), updateUserVerification);
router.route("/people").get(searchUserInfo);
router
  .route("/userinfo/:id")
  .get(getUserInfo)
  .post(upload.any(), updateUserInfo);

router
  .route("/:username")
  .get(getAUser)
  .patch(upload.any(), updateUser)
  .delete(deleteUser);

export default router;
