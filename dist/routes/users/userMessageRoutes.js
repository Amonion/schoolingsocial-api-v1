"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const messageController_1 = require("../../controllers/users/messageController");
const chatController_1 = require("../../controllers/users/chatController");
const router = express_1.default.Router();
router.route("/notifications").get(messageController_1.getNotifications);
router.route("/chats").get(chatController_1.getChats);
router.route("/notifications/:id").patch(upload.any(), messageController_1.updateNotification);
exports.default = router;
