import express from "express";
import multer from "multer";
const upload = multer();
import { loginUser, getAuthUser } from "../../controllers/users/authController";
import {
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
  createUser,
  updateUserInfo,
  getUserInfo,
  searchUserInfo,
  followUser,
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
router.route("/people").get(searchUserInfo);
router
  .route("/userinfo/:username")
  .get(getUserInfo)
  .post(upload.any(), updateUserInfo)
  .patch(upload.any(), updateUser);

router
  .route("/:id")
  .get(getUserById)
  .patch(upload.any(), updateUser)
  .delete(deleteUser);

export default router;
