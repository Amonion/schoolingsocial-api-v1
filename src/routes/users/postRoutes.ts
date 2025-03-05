import express from "express";
import multer from "multer";
const upload = multer();

import {
  getAccountById,
  getAccounts,
  updateAccount,
  deleteAccount,
  createAccount,
  getPosts,
  createPost,
  getPostById,
  deletePost,
  updatePost,
  getComments,
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
router.route("/comments").get(getComments);
router.route("/").get(getPosts).post(upload.any(), createPost);
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

router
  .route("/:id")
  .get(getPostById)
  .patch(upload.any(), updatePost)
  .delete(deletePost);

export default router;
