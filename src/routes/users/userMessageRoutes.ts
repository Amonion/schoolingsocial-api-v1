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
} from "../../controllers/users/chatController";

const router = express.Router();

router.route("/notifications").get(getNotifications);
router.route("/search").get(searchChats);
router.route("/user-chats").get(getUserChats);
router.route("/notifications/:id").patch(upload.any(), updateNotification);

export default router;
