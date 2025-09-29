import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import { ISchoolPayment } from '../../utils/teamInterface'
import {
  queryData,
  deleteItem,
  updateItem,
  createItem,
} from '../../utils/query'
import { SchoolPayment } from '../../models/school/departmentModel'

//-----------------PAYMENT--------------------//
export const createSchoolPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, SchoolPayment, 'School payment was created successfully')
}

export const getSchoolPaymentById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await SchoolPayment.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'School payment not found' })
    }
    res.status(200).json(item)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getSchoolPayments = async (req: Request, res: Response) => {
  try {
    const result = await queryData<ISchoolPayment>(SchoolPayment, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateSchoolPayment = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      SchoolPayment,
      [],
      ['School payment not found', 'School payment was updated successfully']
    )
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const deleteSchoolPayment = async (req: Request, res: Response) => {
  await deleteItem(req, res, SchoolPayment, [], 'School payment not found')
}
