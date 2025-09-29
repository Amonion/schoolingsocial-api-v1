"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const officeController_1 = require("../../controllers/utility/officeController");
const courseController_1 = require("../../controllers/school/courseController");
const router = express_1.default.Router();
router.route('/search').get(officeController_1.searchOffice);
router.route('/positions').get(courseController_1.getPositions);
router.route('/assign-class').patch(upload.any(), officeController_1.assignClass);
router.route('/assign-subjects').patch(upload.any(), officeController_1.assignSubjects);
router.route('/').get(officeController_1.getOffices).patch(upload.any(), officeController_1.assignStaffRole);
router
    .route('/notification-templates')
    .get(officeController_1.getOfficeMessageTemplates)
    .post(upload.any(), officeController_1.createOfficeMessageTemplate);
router
    .route('/notification-templates/:id')
    .get(officeController_1.getOfficeMessageTemplateById)
    .patch(upload.any(), officeController_1.updateOfficeMessageTemplateById);
router.route('/:username').get(officeController_1.getOfficeByUsername);
exports.default = router;
