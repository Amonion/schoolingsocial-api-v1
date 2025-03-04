"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const placeController_1 = require("../../controllers/team/placeController");
const router = express_1.default.Router();
router.route("/").get(placeController_1.getPlaces).post(upload.any(), placeController_1.createPlace);
router.route("/search").get(placeController_1.searchPlace);
router.route("/find").get(placeController_1.searchPlaces);
router.route("/countries").get(placeController_1.getUniquePlaces);
router.route("/state").get(placeController_1.getUniquePlaces);
router.route("/area").get(placeController_1.getUniquePlaces);
router.route("/payments").get(placeController_1.getPayments).post(upload.any(), placeController_1.createPayment);
router.route("/payments/mass-delete").post(upload.any(), placeController_1.createPayment);
router.route("/ads").get(placeController_1.getAds).post(upload.any(), placeController_1.createAd);
router.route("/ads/mass-delete").post(upload.any(), placeController_1.createAd);
router.route("/banks").get(placeController_1.getBanks).post(upload.any(), placeController_1.createBank);
router.route("/documents").get(placeController_1.getDocuments).post(upload.any(), placeController_1.createDocument);
router.route("/documents/mass-delete").post(upload.any(), placeController_1.createDocument);
router
    .route("/ads/:id")
    .get(placeController_1.getAdById)
    .patch(upload.any(), placeController_1.updateAd)
    .delete(placeController_1.deleteAd);
router
    .route("/banks/:id")
    .get(placeController_1.getBankById)
    .patch(upload.any(), placeController_1.updateBank)
    .delete(placeController_1.deleteBank);
router
    .route("/documents/:id")
    .get(placeController_1.getDocumentById)
    .patch(upload.any(), placeController_1.updateDocument)
    .delete(placeController_1.deleteDocument);
router
    .route("/academic-levels")
    .get(placeController_1.getAcademicLevels)
    .post(upload.any(), placeController_1.createAcademicLevel);
router
    .route("/academic-levels/:id")
    .get(placeController_1.getAcademicLevelById)
    .patch(upload.any(), placeController_1.updateAcademicLevel)
    .delete(placeController_1.deleteAcademicLevel);
router
    .route("/payments/:id")
    .get(placeController_1.getPaymentById)
    .patch(upload.any(), placeController_1.updatePayment)
    .delete(placeController_1.deletePayment);
router
    .route("/:id")
    .get(placeController_1.getPlaceById)
    .patch(upload.any(), placeController_1.updatePlace)
    .delete(placeController_1.deletePlace);
exports.default = router;
