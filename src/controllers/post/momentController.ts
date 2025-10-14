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

export const updateMoment = async (data: IMoment) => {
  try {
    const moment = await Moment.findByIdAndUpdate(
      data.id,
      {
        media: data.media,
      },
      { new: true }
    )
    io.emit(`update_moment_${data.username}`, {
      message: 'Your moment was updated successfully',
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

export const deleteMoment = async (req: Request, res: Response) => {
  try {
    const mediaIndex = Number(req.query.mediaIndex)
    const mediaLength = Number(req.query.mediaLength)

    if (isNaN(mediaIndex) || isNaN(mediaLength)) {
      return res.status(400).json({ message: 'Invalid media index or length' })
    }

    if (mediaLength === 1) {
      const deletedMoment = await Moment.findByIdAndDelete(req.params.id)
      if (!deletedMoment) {
        return res.status(404).json({ message: 'Moment not found' })
      }
      return res.status(200).json({
        message: 'Moment deleted successfully.',
        id: req.params.id,
      })
    }

    await Moment.findByIdAndUpdate(req.params.id, {
      $unset: { [`media.${mediaIndex}`]: 1 },
    })

    const updatedMoment = await Moment.findByIdAndUpdate(
      req.params.id,
      { $pull: { media: null } },
      { new: true }
    )

    if (!updatedMoment) {
      return res.status(404).json({ message: 'Moment not found' })
    }

    res.status(200).json({
      moment: updatedMoment,
      id: req.params.id,
      message: 'Media deleted successfully.',
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}
