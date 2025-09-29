import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import { IDepartment } from '../../utils/teamInterface'
import {
  queryData,
  deleteItem,
  updateItem,
  createItem,
} from '../../utils/query'
import { Department } from '../../models/school/departmentModel'

//-----------------DEPARTMENTS--------------------//
export const createDepartment = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Department, 'Department was created successfully')
}

export const getDepartmentById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Department.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Department not found' })
    }
    res.status(200).json(item)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IDepartment>(Department, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Department,
      ['media', 'picture'],
      ['Department not found', 'Department was updated successfully']
    )
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const deleteDepartment = async (req: Request, res: Response) => {
  await deleteItem(
    req,
    res,
    Department,
    ['media', 'picture'],
    'Department not found'
  )
}
