"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const competitionController_1 = require("../../controllers/users/competitionController");
const router = express_1.default.Router();
router.route("/").get(competitionController_1.getWeekends).post(upload.any(), competitionController_1.createWeekend);
router.route("/leagues/papers").get(competitionController_1.getPapers).post(upload.any(), competitionController_1.createPaper);
router
    .route("/leagues/objectives")
    .get(competitionController_1.getObjectives)
    .post(upload.any(), competitionController_1.createObjective);
router.route("/leagues").get(competitionController_1.getLeagues).post(upload.any(), competitionController_1.createLeague);
router.route("/exams").get(competitionController_1.getUserExam).post(upload.any(), competitionController_1.createExam);
router.route("/table").get(competitionController_1.getExams);
router.route("/exams/find").get(competitionController_1.searchExamInfo);
router
    .route("/leagues/papers/:id")
    .get(competitionController_1.getPaperById)
    .patch(upload.any(), competitionController_1.updatePaper);
router
    .route("/leagues/:id")
    .get(competitionController_1.getLeagueById)
    .patch(upload.any(), competitionController_1.updateLeague);
router.route("/exams/:id").get(competitionController_1.getExamById).patch(upload.any(), competitionController_1.updateExam);
router.route("/:id").get(competitionController_1.getWeekendById).patch(upload.any(), competitionController_1.updateWeekend);
exports.default = router;
