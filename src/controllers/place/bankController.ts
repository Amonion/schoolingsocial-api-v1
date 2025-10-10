import { Request, Response } from 'express'
import { Bank } from '../../models/place/placeModel'
import { IBank } from '../../utils/teamInterface'
import { handleError } from '../../utils/errorHandler'
import {
  queryData,
  deleteItem,
  createItem,
  updateItem,
} from '../../utils/query'

//-----------------BANK--------------------//
export const createBank = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Bank, 'Bank was created successfully')
}

export const updateBank = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Bank,
      [],
      ['Bank  not found', 'Bank was updated successfully']
    )
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getBanks = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IBank>(Bank, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getBankById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Bank.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Bank not found' })
    }
    res.status(200).json(item)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const deleteBank = async (req: Request, res: Response) => {
  await deleteItem(req, res, Bank, [], 'Bank not found')
}
