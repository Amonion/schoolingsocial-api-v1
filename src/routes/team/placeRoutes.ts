import express from "express";
import multer from "multer";
const upload = multer();
import {
  getDocumentById,
  getDocuments,
  updateDocument,
  deleteDocument,
  createDocument,
} from "../../controllers/team/academicLevelController";

import {
  getAcademicLevelById,
  getAcademicLevels,
  updateAcademicLevel,
  deleteAcademicLevel,
  createAcademicLevel,
} from "../../controllers/team/academicLevelController";

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

router.route("/payments").get(getPayments).post(upload.any(), createPayment);
router.route("/documents").get(getDocuments).post(upload.any(), createDocument);

router
  .route("/documents/:id")
  .get(getDocumentById)
  .patch(upload.any(), updateDocument)
  .delete(deleteDocument);

router
  .route("/academic-levels")
  .get(getAcademicLevels)
  .post(upload.any(), createAcademicLevel);

router
  .route("/academic-levels/:id")
  .get(getAcademicLevelById)
  .patch(upload.any(), updateAcademicLevel)
  .delete(deleteAcademicLevel);

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
