import express from "express";
import multer from "multer";
import { loginUser, getAuthUser } from "../../controllers/users/authController";
import {
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
  createUser,
} from "../../controllers/users/userController";
import {
  getStaffById,
  getStaffs,
  updateStaff,
} from "../../controllers/team/staffController";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage }).none();
router.route("/login").post(upload, loginUser);
router.route("/auth/:id").get(getAuthUser);

router
  .route("/")
  .get(getUsers) // Fetch all users
  .post(upload, createUser); // Create a new user

router.route("/staffs").get(getStaffs);
router.route("/staffs/:id").get(getStaffById).patch(updateStaff);

router.route("/:id").get(getUserById).patch(updateUser).delete(deleteUser);

export default router;
