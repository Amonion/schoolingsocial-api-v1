import express from "express";
import multer from "multer";
const upload = multer();

import {
  getCompanyById,
  getCompanies,
  updateCompany,
  createCompany,
  getExpensesById,
  getExpenses,
  updateExpenses,
  createExpenses,
  getPositionById,
  getPositions,
  updatePosition,
  createPosition,
} from "../../controllers/team/companyController";

const router = express.Router();

router.route("/").get(getCompanies).post(upload.any(), createCompany);
router.route("/expenses").get(getExpenses).post(upload.any(), createExpenses);
router.route("/positions").get(getPositions).post(upload.any(), createPosition);

router
  .route("/positions/:id")
  .get(getPositionById)
  .patch(upload.any(), updatePosition);

router
  .route("/expenses/:id")
  .get(getExpensesById)
  .patch(upload.any(), updateExpenses);

router.route("/:id").get(getCompanyById).patch(upload.any(), updateCompany);

export default router;
