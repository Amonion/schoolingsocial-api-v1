"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const emailController_1 = require("../../controllers/message/emailController");
const chatController_1 = require("../../controllers/message/chatController");
const router = express_1.default.Router();
router.route('/').get(chatController_1.getChats);
router
    .route('/:id')
    .get(emailController_1.getEmailById)
    .patch(upload.any(), emailController_1.updateEmail)
    .delete(emailController_1.deleteEmail);
exports.default = router;
