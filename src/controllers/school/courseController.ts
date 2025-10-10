import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import {
  queryData,
  deleteItem,
  updateItem,
  createItem,
  search,
} from '../../utils/query'
import {
  Course,
  ICourse,
  ISubject,
  Subject,
} from '../../models/school/courseModel'
import {
  IStaffSubject,
  StaffSubject,
} from '../../models/school/academicLevelModel'
import {
  IStaffPosition,
  StaffPosition,
} from '../../models/school/staffPositionModel'

//-----------------COURSES--------------------//
export const createCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Course, 'Course was created successfully')
}

export const getCourseById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Course.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Course not found' })
    }
    res.status(200).json(item)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getCourses = async (req: Request, res: Response) => {
  try {
    const result = await queryData<ICourse>(Course, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateCourse = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Course,
      ['media', 'picture'],
      ['Course not found', 'Course was updated successfully']
    )
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const deleteCourse = async (req: Request, res: Response) => {
  await deleteItem(req, res, Course, ['media', 'picture'], 'Course not found')
}

//-----------------SUBJECTS--------------------//
export const createSubject = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Subject, 'Subject was created successfully')
}

export const getSubjectById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const data = await Subject.findById(req.params.id)
    if (!data) {
      return res.status(404).json({ message: 'Subject not found' })
    }
    res.status(200).json({ data })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getPositions = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IStaffPosition>(StaffPosition, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getSubjects = async (req: Request, res: Response) => {
  try {
    const result = await queryData<ISubject>(Subject, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getStaffSubjects = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IStaffSubject>(StaffSubject, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getStaffSubjectById = async (req: Request, res: Response) => {
  try {
    const data = await StaffSubject.findById(req.params.id)
    res.status(200).json({ data })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateStaffSubject = async (req: Request, res: Response) => {
  try {
    const subject = await StaffSubject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!subject) {
      return res.status(400).json({ message: 'Subject not found' })
    }
    const result = await queryData<IStaffSubject>(StaffSubject, req)
    res
      .status(200)
      .json({ ...result, message: 'Subject is updated successfully.' })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateSubject = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Subject,
      ['media', 'picture'],
      ['Subject not found', 'Subject was updated successfully']
    )
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const deleteSubject = async (req: Request, res: Response) => {
  await deleteItem(req, res, Subject, ['media', 'picture'], 'Subject not found')
}

export const searchSubject = (req: Request, res: Response) => {
  return search(Subject, req, res)
}
