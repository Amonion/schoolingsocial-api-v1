import express from 'express'
import multer from 'multer'
import {
  createDocument,
  deleteDocument,
  getDocumentById,
  getDocuments,
  updateDocument,
} from '../../controllers/place/placeDocumentController'
const upload = multer()

const router = express.Router()

router.route('/').get(getDocuments).post(upload.any(), createDocument)
router.route('/mass-delete').post(upload.any(), createDocument)
router
  .route('/:id')
  .get(getDocumentById)
  .patch(upload.any(), updateDocument)
  .delete(deleteDocument)

export default router
