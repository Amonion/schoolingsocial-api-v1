import { Request, Response } from 'express'
import { Payment } from '../../models/team/paymentModel'
import {
  deleteItem,
  createItem,
  updateItem,
  getItemById,
  getItems,
} from '../../utils/query'

//--------------------PAYMENTS-----------------------//
export const createPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Payment, 'Payments was created successfully')
}

export const getPaymentById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  getItemById(req, res, Payment, 'Payment was not found')
}

export const getPayments = async (req: Request, res: Response) => {
  getItems(req, res, Payment)
}

export const updatePayment = async (req: Request, res: Response) => {
  updateItem(
    req,
    res,
    Payment,
    ['logo'],
    ['Payment not found', 'Payment was updated successfully']
  )
}

export const deletePayment = async (req: Request, res: Response) => {
  await deleteItem(req, res, Payment, ['logo'], 'Payment not found')
}
