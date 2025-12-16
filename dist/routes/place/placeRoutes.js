"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const placeController_1 = require("../../controllers/place/placeController");
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
router.route('/').get(placeController_1.getPlaces).post(upload.any(), placeController_1.createPlace);
router.route('/all').get(placeController_1.getAllPlaces);
router.route('/search').get(placeController_1.searchPlace);
router.route('/find').get(placeController_1.searchPlaces);
router.route('/countries').get(placeController_1.getUniquePlaces);
router.route('/state').get(placeController_1.getUniquePlaces);
router.route('/state/:id').patch(upload.any(), placeController_1.updateState);
router.route('/area').get(placeController_1.getUniquePlaces);
router.route('/clean').patch(upload.any(), placeController_1.cleanPlaces);
router
    .route('/:id')
    .get(placeController_1.getPlaceById)
    .patch(upload.any(), placeController_1.updatePlace)
    .delete(placeController_1.deletePlace);
exports.default = router;
