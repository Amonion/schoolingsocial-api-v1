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

import {
  getPlaceById,
  getPlaces,
  updatePlace,
  deletePlace,
  createPlace,
  searchPlace,
} from "../../controllers/team/placeController";

const router = express.Router();

router.route("/").get(getPlaces).post(upload.any(), createPlace);
router.route("/search").get(searchPlace);

router.route("/payments").get(getPayments).post(createPayment);

router
  .route("/payments/:id")
  .get(getPaymentById)
  .patch(upload.any(), updatePayment)
  .delete(deletePayment);

router
  .route("/:id")
  .get(getPlaceById) // Fetch a single user
  .patch(upload.any(), updatePlace) // Update a user
  .delete(deletePlace);

export default router;
