import express from "express";
import multer from "multer";
const upload = multer();

import {
  getNotifications,
  updateNotification,
} from "../../controllers/users/messageController";

const router = express.Router();

router.route("/notifications").get(getNotifications);
router.route("/notifications/:id").patch(upload.any(), updateNotification);

export default router;
