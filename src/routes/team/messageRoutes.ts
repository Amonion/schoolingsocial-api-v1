import express from "express";
import multer from "multer";
const upload = multer();

import {
  getEmailById,
  getEmails,
  updateEmail,
  deleteEmail,
  createEmail,
  getNotificationById,
  getNotifications,
  updateNotification,
  deleteNotification,
  createNotification,
} from "../../controllers/team/emailController";

const router = express.Router();

router.route("/").get(getEmails).post(upload.any(), createEmail);
router
  .route("/notifications")
  .get(getNotifications)
  .post(upload.any(), createNotification);

router
  .route("/notifications/:id")
  .get(getNotificationById)
  .patch(upload.any(), updateNotification)
  .delete(deleteNotification);

router
  .route("/:id")
  .get(getEmailById)
  .patch(upload.any(), updateEmail)
  .delete(deleteEmail);

export default router;
