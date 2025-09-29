"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const adsController_1 = require("../../controllers/place/adsController");
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
router.route('/mass-delete').post(upload.any(), adsController_1.createAd);
router.route('/drafted').get(adsController_1.getDraftAd);
router.route('/stats').get(adsController_1.getAdStats);
router.route('/').get(adsController_1.getAds).post(upload.any(), adsController_1.createAd);
router.route('/publish/:id').patch(upload.any(), adsController_1.publishAdReview);
router.route('/:id').get(adsController_1.getAd).patch(upload.any(), adsController_1.updateAd);
router
    .route('/:id')
    .get(adsController_1.getAdById)
    .patch(upload.any(), adsController_1.updateAd)
    .delete(adsController_1.deleteAd);
exports.default = router;
