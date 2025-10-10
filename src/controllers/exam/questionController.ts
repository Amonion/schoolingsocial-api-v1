import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import { queryData, updateItem, createItem, search } from '../../utils/query'
import {
  ISchoolQuestion,
  SchoolQuestion,
} from '../../models/exam/questionPaperModel'
import { IObjective, Objective } from '../../models/exam/objectiveModel'

//-----------------PAPER--------------------//
export const createSchoolQuestionPaper = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(
    req,
    res,
    SchoolQuestion,
    'Question Paper was created successfully'
  )
}

export const getSchoolQuestionPaperById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await SchoolQuestion.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Question Paper not found' })
    }
    res.status(200).json({ data: item })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getSchoolQuestionPapers = async (req: Request, res: Response) => {
  try {
    const result = await queryData<ISchoolQuestion>(SchoolQuestion, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const searchSchoolQuestionPapers = async (
  req: Request,
  res: Response
) => {
  return search(SchoolQuestion, req, res)
}

export const updateSchoolQuestionPaper = async (
  req: Request,
  res: Response
) => {
  try {
    updateItem(
      req,
      res,
      SchoolQuestion,
      [],
      ['Question Paper not found', 'Question Paper was updated successfully']
    )
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const deleteSchoolQuestionPaper = async (
  req: Request,
  res: Response
) => {
  try {
    await SchoolQuestion.findByIdAndDelete(req.params.id)
    await Objective.deleteMany({ paperId: req.params.id })
    const result = await queryData<ISchoolQuestion>(SchoolQuestion, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const assignSchoolQuestionPaper = async (
  req: Request,
  res: Response
) => {
  try {
    const papers = req.body.selectedQuestions
    const selectedClass = req.body.selectedClass
    for (let i = 0; i < papers.length; i++) {
      const el = papers[i]
      for (let x = 0; x < selectedClass.length; x++) {
        const item = selectedClass[x]
        await SchoolQuestion.findByIdAndUpdate(el._id, {
          arm: item.arm,
          level: item.level,
          levelName: item.levelName,
        })
      }
    }
    const result = await queryData<ISchoolQuestion>(SchoolQuestion, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const StartSchoolQuestionPapersCountDown = async (
  req: Request,
  res: Response,
  next
) => {
  req.query.isExpired = 'false'
  req.query.isOn = 'false'
  const { results } = await queryData<ISchoolQuestion>(SchoolQuestion, req)
  for (let i = 0; i < results.length; i++) {
    const el = results[i]
    const timeDiff =
      new Date().getTime() -
      new Date(el.questionDate).getTime() +
      el.startingTime
    if (timeDiff <= 0) {
      await SchoolQuestion.findByIdAndUpdate(el._id, {
        $set: { isOn: false, startingTime: 0, isExpired: true },
      })
    }
  }
  delete req.query.isExpired
  delete req.query.isOn
  next()
}
//-----------------OBJECTIVE--------------------//
export const createObjectives = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const questions = JSON.parse(req.body.questions)
    const deletedIDs = JSON.parse(req.body.deletedIDs)
    for (let i = 0; i < deletedIDs.length; i++) {
      const id = deletedIDs[i]
      await Objective.findByIdAndDelete(id)
    }

    for (let i = 0; i < questions.length; i++) {
      const el = questions[i]
      if (el._id) {
        await Objective.findByIdAndUpdate(
          el._id,
          {
            $set: {
              question: el.question,
              options: el.options,
              index: el.index,
              paperId: req.query.paperId,
            },
          },
          { upsert: true }
        )
      } else {
        await Objective.create({
          question: el.question,
          options: el.options,
          paperId: el.paperId,
          index: el.index,
        })
      }
    }

    const result = await queryData(Objective, req)
    const numberOfQuestions = await Objective.countDocuments({
      paperId: req.query.paperId,
    })
    await SchoolQuestion.findOneAndUpdate(
      { _id: req.query.paperId },
      {
        totalQuestions: numberOfQuestions,
      }
    )
    res.status(200).json({
      message: 'The question was saved successfully',
      count: result.count,
      results: result.results,
    })
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getObjectives = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IObjective>(Objective, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}
