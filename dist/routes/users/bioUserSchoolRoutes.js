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
router.route('/').get(bioUserController_1.getBioUsersSchool);
router.route('/search').get(bioUserController_1.searchBioUsersSchool);
router.route('/:username').get(bioUserController_1.getBioUserSchoolByUsername);
router.route('/').get(bioUserController_1.searchBioUserSchoolInfo);
router
    .route('/schools/:id')
    .get(bioUserController_1.getBioUserPastSchools)
    .patch(upload.any(), bioUserController_1.updateBioUserSchool);
exports.default = router;
