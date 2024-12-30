import express from "express";
import {
  getUserById,
  getUsers,
  updateUser,
  deleteUser,
  createUser,
} from "../controllers/userController";

const router = express.Router();

router
  .route("/users")
  .get(getUsers) // Fetch all users
  .post(createUser); // Create a new user

router
  .route("/users/:id")
  .get(getUserById) // Fetch a single user
  .put(updateUser) // Update a user
  .delete(deleteUser);

export default router;
