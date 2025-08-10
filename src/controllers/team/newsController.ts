import e, { Request, Response } from 'express'
import { News } from '../../models/team/newsModel'

import {
  deleteItem,
  updateItem,
  createItem,
  getItemById,
  getItems,
} from '../../utils/query'
import { Exam, Objective } from '../../models/team/competitionModel'

export const createNews = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, News, 'News was created successfully')
}

export const getNewsById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  getItemById(req, res, News, 'News was not found')
}

export const updateExams = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const waecLogo = await News.find({ tags: 'JAMBLogo' })
    await Exam.updateMany({ name: 'JAMB' }, { logo: waecLogo[0].picture })

    const waecNews = await News.find({ tags: { $in: ['JAMB', 'WAEC'] } })
    const waecExams = await Exam.find({ name: 'JAMB' })
    let x = 0
    for (let i = 0; i < waecExams.length; i++) {
      const el = waecExams[i]
      await Exam.findByIdAndUpdate(el._id, { picture: waecNews[x].picture })
      if (x === waecNews.length - 1) {
        x = 0
      } else {
        x++
      }
    }

    res.status(200).json({ message: 'News updated successfully.' })
  } catch (error) {
    console.log(error)
  }
}

export const updateExamQuestions = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const exams = await Exam.find().select('_id')
    for (let i = 0; i < exams.length; i++) {
      const el = exams[i]
      const questions = await Objective.countDocuments({ paperId: el._id })
      await Exam.findByIdAndUpdate(el, { questions: questions })
    }

    res.status(200).json({ message: 'News updated successfully.' })
  } catch (error) {
    console.log(error)
  }
}

export const getNews = async (req: Request, res: Response) => {
  getItems(req, res, News)
}

export const updateNews = async (req: Request, res: Response) => {
  updateItem(
    req,
    res,
    News,
    ['picture', 'video'],
    ['News not found', 'News was updated successfully']
  )
}

export const deleteNews = async (req: Request, res: Response) => {
  await deleteItem(req, res, News, ['picture', 'video'], 'News not found')
}
