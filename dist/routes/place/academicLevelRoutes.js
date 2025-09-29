"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const academicLevelController_1 = require("../../controllers/place/academicLevelController");
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
router
    .route('/activities')
    .get(academicLevelController_1.getActivities)
    .post(upload.any(), academicLevelController_1.createActivity);
router
    .route('/activities/:id')
    .get(academicLevelController_1.getActivityById)
    .patch(upload.any(), academicLevelController_1.updateActivity);
router.route('/').get(academicLevelController_1.getAcademicLevels).post(upload.any(), academicLevelController_1.createAcademicLevel);
router
    .route('/:id')
    .get(academicLevelController_1.getAcademicLevelById)
    .patch(upload.any(), academicLevelController_1.updateAcademicLevel)
    .delete(academicLevelController_1.deleteAcademicLevel);
exports.default = router;
