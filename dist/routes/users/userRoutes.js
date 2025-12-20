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
const userStatController_1 = require("../../controllers/users/userStatController");
const router = express_1.default.Router();
router.route('/create-account').post(upload.any(), userController_1.createUserAccount);
router.route('/chat/:username').get(userController_1.getChatUser);
router.route('/username/:username').get(userController_1.getExistingUsername);
router.route('/login').post(upload.any(), authController_1.loginUser);
router.route('/suspend').patch(upload.any(), userController_1.suspendUsers);
router.route('/unsuspend').patch(upload.any(), userController_1.unSuspendUsers);
router.route('/auth').get(authController_1.getCurrentUser);
router.route('/follow/:id').patch(upload.any(), userController_1.followUserAccount);
router
    .route('/settings/:id')
    .get(userController_1.getUserSettings)
    .patch(upload.any(), userController_1.updateUserSettings);
router.route('/details/:id').get(userStatController_1.getUserDetails);
router.route('/accounts').get(userController_1.searchAccounts);
router.route('/:username').get(userController_1.getAUser).patch(upload.any(), userController_1.updateUser);
router.route('/').get(userController_1.getUsers).post(upload.any(), userController_1.createUser);
///////////// NEW USER ROUTES ////////////////
exports.default = router;
