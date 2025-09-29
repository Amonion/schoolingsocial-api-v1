import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import { IFaculty } from '../../utils/teamInterface'
import {
  queryData,
  deleteItem,
  updateItem,
  createItem,
} from '../../utils/query'
import { Faculty } from '../../models/school/facultyModel'

//-----------------FACULTY--------------------//
export const createFaculty = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Faculty, 'Faculty was created successfully')
}

export const getFacultyById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Faculty.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Faculty not found' })
    }
    res.status(200).json(item)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getFaculties = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IFaculty>(Faculty, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateFaculty = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Faculty,
      ['media', 'picture'],
      ['Faculty not found', 'Faculty was updated successfully']
    )
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const deleteFaculty = async (req: Request, res: Response) => {
  await deleteItem(req, res, Faculty, ['media', 'picture'], 'Faculty not found')
}
