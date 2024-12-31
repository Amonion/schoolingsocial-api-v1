import express from "express";
import multer from "multer";
import { uploadFileToS3 } from "../../utils/fileUpload";
import {
  getPlaceById,
  getPlaces,
  updatePlace,
  deletePlace,
  createPlace,
} from "../../controllers/team/placeController";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage }).none();

router.route("/").get(getPlaces).post(uploadFileToS3, createPlace);

router
  .route("/:id")
  .get(getPlaceById) // Fetch a single user
  .put(updatePlace) // Update a user
  .delete(deletePlace);

export default router;
