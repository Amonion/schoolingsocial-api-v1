"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const authController_1 = require("../../controllers/users/authController");
const userController_1 = require("../../controllers/users/userController");
const staffController_1 = require("../../controllers/team/staffController");
const router = express_1.default.Router();
const uploadCert = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(), // Or diskStorage if saving to a file
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});
router.route("/login").post(upload.any(), authController_1.loginUser);
router.route("/auth/:id").get(authController_1.getAuthUser);
router.route("/").get(userController_1.getUsers).post(upload.any(), userController_1.createUser);
router.route("/staffs").get(staffController_1.getStaffs);
router.route("/staffs/:id").get(staffController_1.getStaffById).patch(upload.any(), staffController_1.updateStaff);
router.route("/info").get(staffController_1.getStaffs);
router.route("/people").get(userController_1.searchUserInfo);
router
    .route("/info/:id")
    .get(userController_1.getUserInfoById)
    .post(upload.any(), userController_1.updateUserInfo);
router
    .route("/:id")
    .get(userController_1.getUserById)
    .patch(upload.any(), userController_1.updateUser)
    .delete(userController_1.deleteUser);
exports.default = router;
