"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const placePaymentController_1 = require("../../controllers/place/placePaymentController");
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
router.route('/').get(placePaymentController_1.getPayments).post(upload.any(), placePaymentController_1.createPayment);
router
    .route('/:id')
    .get(placePaymentController_1.getPaymentById)
    .patch(upload.any(), placePaymentController_1.updatePayment)
    .delete(placePaymentController_1.deletePayment);
exports.default = router;
