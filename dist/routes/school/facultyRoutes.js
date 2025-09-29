"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const facultyController_1 = require("../../controllers/school/facultyController");
const router = express_1.default.Router();
router.route('/').get(facultyController_1.getFaculties).post(upload.any(), facultyController_1.createFaculty);
router
    .route('/:id')
    .get(facultyController_1.getFacultyById)
    .patch(upload.any(), facultyController_1.updateFaculty)
    .delete(facultyController_1.deleteFaculty);
exports.default = router;
