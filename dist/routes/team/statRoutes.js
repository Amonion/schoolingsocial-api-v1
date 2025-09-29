"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userStatController_1 = require("../../controllers/users/userStatController");
const router = express_1.default.Router();
router.route('/').get(userStatController_1.getUsersStat);
router.route('/schools').get(userStatController_1.getSchoolStat);
exports.default = router;
