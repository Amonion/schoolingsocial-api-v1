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
router
    .route("/notifications")
    .get(messageController_1.getNotifications)
    .patch(upload.any(), messageController_1.updateNotification);
router.route("/friends").get(chatController_1.friendsChats);
router.route("/add-searched").get(chatController_1.addSearchedChats);
router.route("/save").patch(upload.any(), chatController_1.saveChats).get(chatController_1.getSaveChats);
router.route("/unsave").patch(upload.any(), chatController_1.unSaveChats);
router.route("/search").get(chatController_1.searchChats);
router.route("/search-fav").get(chatController_1.searchFavChats);
router.route("/user-chats").get(chatController_1.getUserChats);
router.route("/mass-delete").post(chatController_1.deleteChats);
router
    .route("/notifications/:username")
    .patch(upload.any(), messageController_1.updateNotification);
exports.default = router;
