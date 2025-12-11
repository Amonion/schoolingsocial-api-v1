import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import { Position } from '../../models/team/companyModel'
import { IPosition } from '../../utils/teamInterface'
import { queryData, updateItem, createItem } from '../../utils/query'

//-----------------POSITION--------------------//
export const createPosition = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Position, 'Position was created successfully')
}

export const getPositionById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Position.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Position not found' })
    }
    res.status(200).json(item)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getPositions = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IPosition>(Position, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updatePosition = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Position,
      [],
      ['Position not found', 'Position was updated successfully']
    )
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const deletePositions = async (req: Request, res: Response) => {
  try {
    await Position.deleteMany({ _id: { $in: req.body.positionIds } })
    const result = await queryData<IPosition>(Position, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}
