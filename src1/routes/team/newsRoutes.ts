import express from "express";
import multer from "multer";
const upload = multer();

import {
  getNewsById,
  getNews,
  updateNews,
  deleteNews,
  createNews,
} from "../../controllers/team/newsController";

const router = express.Router();

router.route("/").get(getNews).post(upload.any(), createNews);
router
  .route("/:id")
  .get(getNewsById)
  .patch(upload.any(), updateNews)
  .delete(deleteNews);

export default router;
