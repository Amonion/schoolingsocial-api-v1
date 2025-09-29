"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const departmentController_1 = require("../../controllers/school/departmentController");
const router = express_1.default.Router();
router.route('/').get(departmentController_1.getDepartments).post(upload.any(), departmentController_1.createDepartment);
router
    .route('/:id')
    .get(departmentController_1.getDepartmentById)
    .patch(upload.any(), departmentController_1.updateDepartment)
    .delete(departmentController_1.deleteDepartment);
exports.default = router;
