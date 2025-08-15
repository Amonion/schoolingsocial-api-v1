"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const adController_1 = require("../../controllers/utility/adController");
const router = express_1.default.Router();
router.route('/drafted').get(adController_1.getDraftAd);
router.route('/').get(adController_1.getAd).post(upload.any(), adController_1.createAd);
router.route('/:id').patch(upload.any(), adController_1.updateAd);
exports.default = router;
