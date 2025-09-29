import { Request, Response } from 'express'
import { IWallet } from '../../utils/userInterface'
import { handleError } from '../../utils/errorHandler'
import { queryData } from '../../utils/query'
import { sendEmail } from '../../utils/sendEmail'
import { Wallet } from '../../models/users/walletModel'
import { Transaction } from '../../models/team/paymentModel'
import { ITransaction } from '../../utils/teamInterface'

export const createTransaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const txType = req.body.name
    const tx = req.body
    if (txType === 'top_up') {
      await Wallet.findOneAndUpdate(
        { userId: tx.userId },
        { $inc: { balance: tx.amount, received: tx.amount } },
        { new: true, upsert: false } // options
      )
      req.body.received = true
    }
    const trx = await Transaction.create(req.body)
    await sendEmail('', tx.email, 'top_up')
    const result = await queryData<ITransaction>(Transaction, req)
    res.status(200).json(result)
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const getTransactions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await queryData<ITransaction>(Transaction, req)
    res.status(200).json(result)
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}

export const getAWallets = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await queryData<IWallet>(Wallet, req)
    res.status(200).json({ wallet: result.results[0] })
  } catch (error: any) {
    handleError(res, undefined, undefined, error)
  }
}
