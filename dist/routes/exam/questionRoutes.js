"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const questionController_1 = require("../../controllers/exam/questionController");
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
router.route('/assign').patch(upload.any(), questionController_1.assignSchoolQuestionPaper);
router.route('/search').get(questionController_1.searchSchoolQuestionPapers);
router
    .route('/')
    .get(questionController_1.StartSchoolQuestionPapersCountDown, questionController_1.getSchoolQuestionPapers)
    .post(upload.any(), questionController_1.StartSchoolQuestionPapersCountDown, questionController_1.createSchoolQuestionPaper);
router
    .route('/objectives')
    .get(questionController_1.getObjectives)
    .post(upload.any(), questionController_1.createObjectives);
router
    .route('/:id')
    .get(questionController_1.StartSchoolQuestionPapersCountDown, questionController_1.getSchoolQuestionPaperById)
    .patch(upload.any(), questionController_1.StartSchoolQuestionPapersCountDown, questionController_1.updateSchoolQuestionPaper)
    .delete(questionController_1.deleteSchoolQuestionPaper);
exports.default = router;
