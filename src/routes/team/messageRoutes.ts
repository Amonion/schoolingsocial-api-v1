import express from "express";
import multer from "multer";
const upload = multer();

import {
  getEmailById,
  getEmails,
  updateEmail,
  deleteEmail,
  createEmail,
} from "../../controllers/team/emailController";

const router = express.Router();

router.route("/").get(getEmails).post(upload.any(), createEmail);

router
  .route("/:id")
  .get(getEmailById)
  .patch(upload.any(), updateEmail) // Update a user
  .delete(deleteEmail);

export default router;
