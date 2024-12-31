import express from "express";
import multer from "multer";
import { loginUser } from "../controllers/users/authController";
import {
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
  createUser,
} from "../controllers/users/userController";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage }).none();
router.route("/login").post(upload, loginUser);

router
  .route("/")
  .get(getUsers) // Fetch all users
  .post(upload, createUser); // Create a new user

router
  .route("/users/:id")
  .get(getUserById) // Fetch a single user
  .put(updateUser) // Update a user
  .delete(deleteUser);

export default router;
