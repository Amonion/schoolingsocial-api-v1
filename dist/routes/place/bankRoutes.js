"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const bankController_1 = require("../../controllers/place/bankController");
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
router.route('/').get(bankController_1.getBanks).post(upload.any(), bankController_1.createBank);
router
    .route('/:id')
    .get(bankController_1.getBankById)
    .patch(upload.any(), bankController_1.updateBank)
    .delete(bankController_1.deleteBank);
exports.default = router;
