import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import {
  queryData,
  deleteItem,
  createItem,
  updateItem,
} from '../../utils/query'
import {
  AcademicLevel,
  Activity,
  IAcademicLevel,
  IActivity,
} from '../../models/school/academicLevelModel'

//-----------------ACADEMIC LEVEL--------------------//
export const createAcademicLevel = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, AcademicLevel, 'Academic Level was created successfully')
}

export const updateAcademicLevel = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      AcademicLevel,
      ['logo'],
      ['Academic Level not found', 'Academic Level was updated successfully']
    )
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getAcademicLevelById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await AcademicLevel.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'AcademicLevel not found' })
    }
    res.status(200).json(item)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getAcademicLevels = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IAcademicLevel>(AcademicLevel, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const deleteAcademicLevel = async (req: Request, res: Response) => {
  await deleteItem(req, res, AcademicLevel, ['logo'], 'AcademicLevel not found')
}

//-----------------ACTIVITY--------------------//
export const createActivity = async (
  req: Request,
  res: Response
): Promise<void> => {
  const bd = req.body
  createItem(req, res, Activity, 'Academic Level was created successfully')
}

export const updateActivity = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Activity,
      ['picture'],
      ['Activity  not found', 'Activity was updated successfully']
    )
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getActivities = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IActivity>(Activity, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getActivityById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const data = await Activity.findById(req.params.id)
    if (!data) {
      return res.status(404).json({ message: 'Activity not found' })
    }
    res.status(200).json({ data })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}
