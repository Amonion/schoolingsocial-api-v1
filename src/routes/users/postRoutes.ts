import express from "express";
import multer from "multer";
const upload = multer();

import {
  getAccountById,
  getAccounts,
  updateAccount,
  deleteAccount,
  createAccount,
} from "../../controllers/users/postController";

import {
  getUploadById,
  getUploads,
  updateUpload,
  deleteUpload,
  createUpload,
} from "../../controllers/users/uploadController";

const router = express.Router();

router.route("/uploads").get(getUploads).post(upload.any(), createUpload);
router.route("/accounts").get(getAccounts).post(upload.any(), createAccount);
router
  .route("/uploads/:id")
  .get(getUploadById)
  .patch(upload.any(), updateUpload)
  .delete(deleteUpload);

router
  .route("/accounts/:id")
  .get(getAccountById)
  .patch(upload.any(), updateAccount)
  .delete(deleteAccount);

export default router;
