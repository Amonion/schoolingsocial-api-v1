import express from 'express'
import multer from 'multer'
import {
  cleanPlaces,
  createPlace,
  deletePlace,
  getAllPlaces,
  getPlaceById,
  getPlaces,
  getUniquePlaces,
  searchPlace,
  searchPlaces,
  updatePlace,
} from '../../controllers/place/placeController'
const upload = multer()

const router = express.Router()

router.route('/').get(getPlaces).post(upload.any(), createPlace)
router.route('/all').get(getAllPlaces)
router.route('/search').get(searchPlace)
router.route('/find').get(searchPlaces)
router.route('/countries').get(getUniquePlaces)
router.route('/state').get(getUniquePlaces)
router.route('/area').get(getUniquePlaces)
router.route('/clean').patch(upload.any(), cleanPlaces)
router
  .route('/:id')
  .get(getPlaceById)
  .patch(upload.any(), updatePlace)
  .delete(deletePlace)

export default router
