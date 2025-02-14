import express from "express";
import multer from "multer";
const upload = multer();

import {
  getPaymentById,
  getPayments,
  updatePayment,
  deletePayment,
  createPayment,
  getDocumentById,
  getDocuments,
  updateDocument,
  deleteDocument,
  createDocument,
  getBankById,
  getBanks,
  updateBank,
  deleteBank,
  createBank,
  getAcademicLevelById,
  getAcademicLevels,
  updateAcademicLevel,
  deleteAcademicLevel,
  createAcademicLevel,
  getPlaceById,
  getPlaces,
  updatePlace,
  deletePlace,
  createPlace,
  searchPlace,
  searchPlaces,
  getUniquePlaces,
  getAdById,
  getAds,
  updateAd,
  deleteAd,
  createAd,
} from "../../controllers/team/placeController";

const router = express.Router();

router.route("/").get(getPlaces).post(upload.any(), createPlace);
router.route("/search").get(searchPlace);
router.route("/find").get(searchPlaces);
router.route("/countries").get(getUniquePlaces);
router.route("/state").get(getUniquePlaces);
router.route("/area").get(getUniquePlaces);
router.route("/payments").get(getPayments).post(upload.any(), createPayment);
router.route("/payments/mass-delete").post(upload.any(), createPayment);
router.route("/ads").get(getAds).post(upload.any(), createAd);
router.route("/ads/mass-delete").post(upload.any(), createAd);
router.route("/banks").get(getBanks).post(upload.any(), createBank);
router.route("/documents").get(getDocuments).post(upload.any(), createDocument);
router.route("/documents/mass-delete").post(upload.any(), createDocument);

router
  .route("/ads/:id")
  .get(getAdById)
  .patch(upload.any(), updateAd)
  .delete(deleteAd);

router
  .route("/banks/:id")
  .get(getBankById)
  .patch(upload.any(), updateBank)
  .delete(deleteBank);

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
  .get(getPlaceById)
  .patch(upload.any(), updatePlace)
  .delete(deletePlace);

export default router;
