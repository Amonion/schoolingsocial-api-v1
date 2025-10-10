import { Request, Response } from 'express'
import { Upload } from '../../models/users/uploadModel'

import {
  deleteItem,
  createItem,
  updateItem,
  getItemById,
  getItems,
} from '../../utils/query'

//--------------------UPLOADS-----------------------//
export const createUpload = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Upload, 'Uploads was created successfully')
}

export const createUploadVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Upload, 'Uploads was created successfully')
}

export const getUploadById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  getItemById(req, res, Upload, 'Upload was not found')
}

export const getUploads = async (req: Request, res: Response) => {
  getItems(req, res, Upload)
}

export const updateUpload = async (req: Request, res: Response) => {
  updateItem(
    req,
    res,
    Upload,
    ['media'],
    ['Upload not found', 'Upload was updated successfully']
  )
}

export const deleteUpload = async (req: Request, res: Response) => {
  await deleteItem(req, res, Upload, ['media'], 'Upload not found')
}
