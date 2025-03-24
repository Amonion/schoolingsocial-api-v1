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
  getUserInfoById,
  searchUserInfo,
} from "../../controllers/users/userController";
import {
  getStaffById,
  getStaffs,
  updateStaff,
} from "../../controllers/team/staffController";

const router = express.Router();
const uploadCert = multer({
  storage: multer.memoryStorage(), // Or diskStorage if saving to a file
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});
router.route("/login").post(upload.any(), loginUser);
router.route("/auth/:id").get(getAuthUser);

router.route("/").get(getUsers).post(upload.any(), createUser);

router.route("/staffs").get(getStaffs);
router.route("/staffs/:id").get(getStaffById).patch(upload.any(), updateStaff);

router.route("/info").get(getStaffs);
router.route("/people").get(searchUserInfo);
router
  .route("/info/:id")
  .get(getUserInfoById)
  .post(upload.any(), updateUserInfo);

router
  .route("/:id")
  .get(getUserById)
  .patch(upload.any(), updateUser)
  .delete(deleteUser);

export default router;
