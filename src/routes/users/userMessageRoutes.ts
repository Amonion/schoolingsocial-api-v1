import express from "express";
import multer from "multer";
const upload = multer();

import {
  getNotifications,
  updateNotification,
} from "../../controllers/users/messageController";
import {
  searchChats,
  getUserChats,
  deleteChats,
  friendsChats,
  addSearchedChats,
} from "../../controllers/users/chatController";

const router = express.Router();

router.route("/notifications").get(getNotifications);
router.route("/friends").get(friendsChats);
router.route("/add-searched").get(addSearchedChats);
router.route("/search").get(searchChats);
router.route("/user-chats").get(getUserChats);
router.route("/mass-delete").post(deleteChats);
router.route("/notifications/:id").patch(upload.any(), updateNotification);

export default router;
