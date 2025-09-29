"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const officialMessageController_1 = require("../../controllers/message/officialMessageController");
const personalMessageController_1 = require("../../controllers/message/personalMessageController");
const router = express_1.default.Router();
router.route('/send').patch(upload.any(), officialMessageController_1.sendOfficesMessage);
router.route('/official').get(officialMessageController_1.getOfficialMessages);
router.route('/official/read').patch(upload.any(), officialMessageController_1.readOfficeMessages);
router.route('/official/:id').get(officialMessageController_1.getOfficialMessage);
router.route('/personal').get(personalMessageController_1.getPersonalMessages);
router.route('/personal/read').patch(upload.any(), personalMessageController_1.readPersonalMessages);
router.route('/personal/:id').get(personalMessageController_1.getPersonalMessage);
exports.default = router;
