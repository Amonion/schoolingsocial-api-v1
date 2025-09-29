import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import { queryData } from '../../utils/query'
import { Office } from '../../models/utility/officeModel'
import {
  IPersonalMessage,
  PersonalMessage,
} from '../../models/message/personalMessageModel'

export const readPersonalMessages = async (req: Request, res: Response) => {
  try {
    const ids = JSON.parse(req.body.ids)
    await PersonalMessage.updateMany(
      { _id: { $in: ids } },
      {
        $set: {
          unread: false,
        },
      }
    )
    const unread = await PersonalMessage.countDocuments({
      receiverUsername: req.query.username,
      unread: true,
    })
    res.status(200).json({
      unread,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getPersonalMessages = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IPersonalMessage>(PersonalMessage, req)

    const unread = await PersonalMessage.countDocuments({
      receiverUsername: req.query.receiverUsername,
      unread: true,
    })

    res.status(200).json({
      page: result.page,
      page_size: result.page_size,
      results: result.results,
      count: result.count,
      unread: unread,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getPersonalMessage = async (req: Request, res: Response) => {
  try {
    const result = await PersonalMessage.findById(req.params.id)

    res.status(200).json({
      data: result,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}
