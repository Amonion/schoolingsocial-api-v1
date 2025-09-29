"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const placeDocumentController_1 = require("../../controllers/place/placeDocumentController");
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
router.route('/').get(placeDocumentController_1.getDocuments).post(upload.any(), placeDocumentController_1.createDocument);
router.route('/mass-delete').post(upload.any(), placeDocumentController_1.createDocument);
router
    .route('/:id')
    .get(placeDocumentController_1.getDocumentById)
    .patch(upload.any(), placeDocumentController_1.updateDocument)
    .delete(placeDocumentController_1.deleteDocument);
exports.default = router;
