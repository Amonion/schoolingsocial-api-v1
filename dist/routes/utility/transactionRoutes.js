"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const adController_1 = require("../../controllers/utility/adController");
const transactionController_1 = require("../../controllers/utility/transactionController");
const placeController_1 = require("../../controllers/team/placeController");
const router = express_1.default.Router();
router.route('/wallets').get(transactionController_1.getAWallets).patch(upload.any(), adController_1.updateAd);
router.route('/').get(transactionController_1.getTransactions).post(upload.any(), transactionController_1.createTransaction);
router.route('/payments').get(placeController_1.getPayments);
exports.default = router;
