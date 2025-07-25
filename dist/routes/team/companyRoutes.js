"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const companyController_1 = require("../../controllers/team/companyController");
const router = express_1.default.Router();
router.route('/').get(companyController_1.getCompanies).post(upload.any(), companyController_1.createCompany);
router.route('/policy').get(companyController_1.getPolcies).post(upload.any(), companyController_1.createPolicy);
router.route('/expenses').get(companyController_1.getExpenses).post(upload.any(), companyController_1.createExpenses);
router.route('/positions').get(companyController_1.getPositions).post(upload.any(), companyController_1.createPosition);
router.route('/interests').get(companyController_1.getInterests).post(upload.any(), companyController_1.createInterest);
router.route('/interests/:id').patch(upload.any(), companyController_1.updatePosition);
router
    .route('/positions/:id')
    .get(companyController_1.getPositionById)
    .patch(upload.any(), companyController_1.updatePosition);
router
    .route('/policy/:id')
    .get(companyController_1.getPolicyById)
    .patch(upload.any(), companyController_1.updatePolicy)
    .delete(companyController_1.deletePolicy);
router
    .route('/expenses/:id')
    .get(companyController_1.getExpensesById)
    .patch(upload.any(), companyController_1.updateExpenses);
router.route('/:id').get(companyController_1.getCompanyById).patch(upload.any(), companyController_1.updateCompany);
exports.default = router;
