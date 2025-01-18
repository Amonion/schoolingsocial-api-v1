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

const router = express.Router();

router.route("/accounts").get(getAccounts).post(upload.any(), createAccount);
router
  .route("/accounts/:id")
  .get(getAccountById)
  .patch(upload.any(), updateAccount)
  .delete(deleteAccount);

export default router;
