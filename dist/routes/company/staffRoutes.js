"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const staffController_1 = require("../../controllers/users/staffController");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const router = express_1.default.Router();
router
    .route('/')
    .get(staffController_1.getStaffs)
    .patch(upload.any(), staffController_1.makeStaffUser)
    .post(upload.any(), staffController_1.makeUserStaff);
router.route('/:id').patch(upload.any(), staffController_1.updateStaff);
exports.default = router;
