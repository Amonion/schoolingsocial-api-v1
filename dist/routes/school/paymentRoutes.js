"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const schoolPaymentController_1 = require("../../controllers/school/schoolPaymentController");
const router = express_1.default.Router();
router
    .route('/payments')
    .get(schoolPaymentController_1.getSchoolPayments)
    .post(upload.any(), schoolPaymentController_1.createSchoolPayment);
router
    .route('/payments/:id')
    .get(schoolPaymentController_1.getSchoolPaymentById)
    .patch(upload.any(), schoolPaymentController_1.updateSchoolPayment)
    .delete(schoolPaymentController_1.deleteSchoolPayment);
exports.default = router;
