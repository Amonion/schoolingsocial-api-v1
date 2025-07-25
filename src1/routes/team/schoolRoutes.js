"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const schoolController_1 = require("../../controllers/team/schoolController");
const router = express_1.default.Router();
router.route("/search").get(schoolController_1.searchSchools);
router.route("/find").get(schoolController_1.searchSchool);
router.route("/record-all").get(schoolController_1.recordAll);
router.route("/").get(schoolController_1.getSchools).post(upload.any(), schoolController_1.createSchool);
router
    .route("/payments")
    .get(schoolController_1.getSchoolPayments)
    .post(upload.any(), schoolController_1.createSchoolPayment);
router.route("/courses").get(schoolController_1.getCourses).post(upload.any(), schoolController_1.createCourse);
router
    .route("/departments")
    .get(schoolController_1.getDepartments)
    .post(upload.any(), schoolController_1.createDepartment);
router.route("/faculties").get(schoolController_1.getFaculties).post(upload.any(), schoolController_1.createFaculty);
router.route("/update-levels").post(upload.any(), schoolController_1.updateLevels);
router
    .route("/faculties/:id")
    .get(schoolController_1.getFacultyById)
    .patch(upload.any(), schoolController_1.updateFaculty)
    .delete(schoolController_1.deleteFaculty);
router
    .route("/departments/:id")
    .get(schoolController_1.getDepartmentById)
    .patch(upload.any(), schoolController_1.updateDepartment)
    .delete(schoolController_1.deleteDepartment);
router
    .route("/courses/:id")
    .get(schoolController_1.getCourseById)
    .patch(upload.any(), schoolController_1.updateCourse)
    .delete(schoolController_1.deleteCourse);
router
    .route("/payments/:id")
    .get(schoolController_1.getSchoolPaymentById)
    .patch(upload.any(), schoolController_1.updateSchoolPayment)
    .delete(schoolController_1.deleteSchoolPayment);
router
    .route("/:id")
    .get(schoolController_1.getSchoolById)
    .patch(upload.any(), schoolController_1.updateSchool)
    .delete(schoolController_1.deleteSchool);
exports.default = router;
