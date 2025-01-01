import express from "express";
import multer from "multer";
const upload = multer();

import {
  getPaymentById,
  getPayments,
  updatePayment,
  deletePayment,
  createPayment,
} from "../../controllers/team/paymentController";

const router = express.Router();

router.route("/").get(getPayments).post(upload.any(), createPayment);

router
  .route("/:id")
  .get(getPaymentById) // Fetch a single user
  .patch(upload.any(), updatePayment) // Update a user
  .delete(deletePayment);

export default router;
