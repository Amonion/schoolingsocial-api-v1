"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const dashboardController_1 = require("../../controllers/team/dashboardController");
const router = express_1.default.Router();
router.route('/ad-stats').get(dashboardController_1.getAdStats).post(upload.any());
exports.default = router;
