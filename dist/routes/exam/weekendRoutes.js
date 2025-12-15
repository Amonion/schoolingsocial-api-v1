"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const weekendController_1 = require("../../controllers/exam/weekendController");
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
router.route('/search').get(weekendController_1.searchWeekends);
router.route('/giveaway').get(weekendController_1.getGiveaways);
router.route('/').get(weekendController_1.getWeekends).post(upload.any(), weekendController_1.createWeekend);
router.route('/:id').get(weekendController_1.getWeekendById).patch(upload.any(), weekendController_1.updateWeekend);
exports.default = router;
