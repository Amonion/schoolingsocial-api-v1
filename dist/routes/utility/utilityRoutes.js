"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const competitionController_1 = require("../../controllers/users/competitionController");
const postStatController_1 = require("../../controllers/post/postStatController");
const router = express_1.default.Router();
router.route('/exams').get(competitionController_1.getUserExam);
router.route('/init').post(upload.any(), competitionController_1.initExam);
router.route('/table').get(competitionController_1.getExams);
router.route('/exams/find').get(competitionController_1.searchExamInfo);
router.route('/dashboard').get(postStatController_1.getPostStats);
exports.default = router;
