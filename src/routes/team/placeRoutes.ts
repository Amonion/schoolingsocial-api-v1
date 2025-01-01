import express from "express";
import multer from "multer";
const upload = multer();

import {
  getPlaceById,
  getPlaces,
  updatePlace,
  deletePlace,
  createPlace,
} from "../../controllers/team/placeController";

const router = express.Router();

router.route("/").get(getPlaces).post(upload.any(), createPlace);

router
  .route("/:id")
  .get(getPlaceById) // Fetch a single user
  .patch(upload.any(), updatePlace) // Update a user
  .delete(deletePlace);

export default router;
