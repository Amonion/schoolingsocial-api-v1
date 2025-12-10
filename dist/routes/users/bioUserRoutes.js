"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const bioUserController_1 = require("../../controllers/users/bioUserController");
const router = express_1.default.Router();
router.route('/').get(bioUserController_1.getBioUsers);
router.route('/states').get(bioUserController_1.getBioUsersState).patch(upload.any(), bioUserController_1.updateBioUser);
router.route('/states/search').get(bioUserController_1.searchBioUserState);
router.route('/username/:username').get(bioUserController_1.getBioUserByUsername);
router.route('/:id').get(bioUserController_1.getBioUser).patch(upload.any(), bioUserController_1.updateBioUser);
router.route('/settings/:id').patch(upload.any(), bioUserController_1.updateBioUserSettings);
router
    .route('/banks/:id')
    .get(bioUserController_1.getBioUserBank)
    .patch(upload.any(), bioUserController_1.updateBioUserBank);
router.route('/approve-user/:username').patch(upload.any(), bioUserController_1.approveUser);
exports.default = router;
