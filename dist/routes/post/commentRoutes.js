"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const commentController_1 = require("../../controllers/post/commentController");
const router = express_1.default.Router();
router.route('/like').patch(upload.any(), commentController_1.toggleLikeComment);
router.route('/hate').patch(upload.any(), commentController_1.toggleHateComment);
router.route('/').get(commentController_1.getComments).post(upload.any(), commentController_1.createComment);
exports.default = router;
