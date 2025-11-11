"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const newsController_1 = require("../../controllers/news/newsController");
const router = express_1.default.Router();
router.route('/mass-delete').patch(newsController_1.massDeleteNews);
router.route('/search').get(newsController_1.searchNews);
router.route('/feed').get(newsController_1.getInitialNews).post(upload.any(), newsController_1.createNews);
router.route('/').get(newsController_1.getNews).post(upload.any(), newsController_1.createNews);
router.route('/views').patch(upload.any(), newsController_1.updateNewsViews);
router.route('/bookmark').patch(upload.any(), newsController_1.toggleSaveNews);
router.route('/like').patch(upload.any(), newsController_1.toggleLikeNews);
router
    .route('/:id')
    .get(newsController_1.getNewsById)
    .patch(upload.any(), newsController_1.updateNews)
    .delete(newsController_1.deleteNews);
exports.default = router;
