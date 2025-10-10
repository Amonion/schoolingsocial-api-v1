import { Request, Response } from 'express'
import { Document } from '../../models/place/placeModel'
import { IDocument } from '../../utils/teamInterface'
import { handleError } from '../../utils/errorHandler'
import {
  queryData,
  deleteItem,
  createItem,
  updateItem,
} from '../../utils/query'

//-----------------DOCUMENT--------------------//
export const createDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Document, 'Document was created successfully')
}

export const updateDocument = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Document,
      [],
      ['Document  not found', 'Document was updated successfully']
    )
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getDocuments = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IDocument>(Document, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getDocumentById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Document.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Document not found' })
    }
    res.status(200).json(item)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const deleteDocument = async (req: Request, res: Response) => {
  await deleteItem(req, res, Document, [], 'Document not found')
}
