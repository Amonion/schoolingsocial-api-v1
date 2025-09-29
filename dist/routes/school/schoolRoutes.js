"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const schoolController_1 = require("../../controllers/school/schoolController");
const router = express_1.default.Router();
router.route('/search').get(schoolController_1.searchSchools);
router.route('/find').get(schoolController_1.searchSchool);
router.route('/record-all').get(schoolController_1.recordAll);
router.route('/').get(schoolController_1.getSchools).post(upload.any(), schoolController_1.createSchool);
router.route('/update-levels').post(upload.any(), schoolController_1.updateLevels);
router.route('/approve/:username').patch(upload.any(), schoolController_1.approveSchool);
router
    .route('/approve-application/:username')
    .patch(upload.any(), schoolController_1.approveSchoolApplication);
router.route('/staffs/').get(schoolController_1.getSchoolStaffs);
router.route('/notifications').get(schoolController_1.getSchoolNotifications);
router.route('/:username').get(schoolController_1.getSchoolByUsername).delete(schoolController_1.deleteSchool);
router.route('/apply/:id').patch(schoolController_1.schoolApplication);
router.route('/cancel/:id').patch(schoolController_1.cancelApplication);
router.route('/staff/:id').get(schoolController_1.getStaff);
router
    .route('/:id')
    .get(schoolController_1.getSchoolById)
    .patch(upload.any(), schoolController_1.updateSchool)
    .delete(schoolController_1.deleteSchool);
exports.default = router;
