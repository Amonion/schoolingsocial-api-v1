import { Request, Response } from 'express'
import { io } from '../../app'
import { IMoment, Moment } from '../../models/post/momentModel'
import { handleError } from '../../utils/errorHandler'
import { queryData } from '../../utils/query'

export const createMoment = async (data: IMoment) => {
  try {
    const moment = await Moment.create(data)
    io.emit(`moment_${data.username}`, {
      message: 'Your moment was created successfully',
      data: moment,
    })
  } catch (error) {
    console.log(error)
  }
}

export const getMoments = async (req: Request, res: Response) => {
  try {
    const followerId = req.query.myId
    delete req.query.myId
    const result = await queryData<IMoment>(Moment, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}
