"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const faceController_1 = require("../controllers/faceController");
const router = express_1.default.Router();
router.route('/').post(upload.any(), faceController_1.detectFace);
exports.default = router;
