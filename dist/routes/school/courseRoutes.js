"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const courseController_1 = require("../../controllers/school/courseController");
const router = express_1.default.Router();
router.route('/staff-subjects').get(courseController_1.getStaffSubjects);
router
    .route('/staff-subjects/:id')
    .get(courseController_1.getStaffSubjectById)
    .patch(upload.any(), courseController_1.updateStaffSubject);
router.route('/subjects/search').get(courseController_1.searchSubject);
router.route('/subjects').get(courseController_1.getSubjects).post(upload.any(), courseController_1.createSubject);
router.route('/').get(courseController_1.getCourses).post(upload.any(), courseController_1.createCourse);
router
    .route('/subjects/:id')
    .get(courseController_1.getSubjectById)
    .patch(upload.any(), courseController_1.updateSubject)
    .delete(courseController_1.deleteSubject);
router
    .route('/:id')
    .get(courseController_1.getCourseById)
    .patch(upload.any(), courseController_1.updateCourse)
    .delete(courseController_1.deleteCourse);
exports.default = router;
