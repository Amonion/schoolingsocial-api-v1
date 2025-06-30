import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import {
  Weekend,
  Exam,
  League,
  Paper,
  Objective,
} from '../../models/team/competitionModel'
import {
  IWeekend,
  IExam,
  ILeague,
  IPaper,
  IObjective,
} from '../../utils/teamInterface'
import { queryData, updateItem, createItem, search } from '../../utils/query'
import {
  Attempt,
  UserTest,
  UserTestExam,
} from '../../models/users/competitionModel'
import { IUserTest, IUserTestExam } from '../../utils/userInterface'
import { UserInfo } from '../../models/users/userInfoModel'
import { User } from '../../models/users/userModel'

export const createWeekend = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Weekend, 'Weekend was created successfully')
}

export const getWeekendById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Weekend.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Weekend not found' })
    }
    res.status(200).json(item)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getWeekends = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IWeekend>(Weekend, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateWeekend = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Weekend,
      ['video', 'picture'],
      ['Weekend not found', 'Weekend was updated successfully']
    )
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

//-----------------Exam--------------------//
export const createExam = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const paperId = req.body.paperId
    const userId = req.body.userId
    const username = req.body.username
    const picture = req.body.picture
    const started = Number(req.body.started)
    const ended = Number(req.body.ended)
    // const attempts = Number(req.body.attempts);
    const instruction = req.body.instruction
    const questions = req.body.questions ? JSON.parse(req.body.questions) : []

    const rate = (1000 * questions.length) / (ended - started)
    let mainObjective = await Objective.find({ paperId: paperId })
    let participant = await UserTestExam.find({
      paperId: paperId,
      userId: userId,
    })

    const paper = await UserTestExam.findOne({ paperId: paperId })
    const attempts = paper ? Number(paper?.attempts) + 1 : 1
    let correctAnswer = 0
    for (let i = 0; i < questions.length; i++) {
      const el = questions[i]
      for (let x = 0; x < el.options.length; x++) {
        const opt = el.options[x]
        if (
          opt.isSelected === opt.isClicked &&
          opt.isSelected &&
          opt.isClicked
        ) {
          correctAnswer++
        }
      }
    }

    const accuracy = correctAnswer / mainObjective.length
    const metric = accuracy * rate
    const updatedQuestions: IUserTest[] = []
    for (let i = 0; i < mainObjective.length; i++) {
      const el = mainObjective[i]
      const objIndex = questions.findIndex(
        (obj: IObjective) => obj._id == el._id
      )

      if (objIndex !== -1) {
        const obj = {
          isClicked: questions[objIndex].isClicked,
          paperId: paperId,
          userId: userId,
          question: el.question,
          options: questions[objIndex].options,
        } as IUserTest
        updatedQuestions.push(obj)
      } else {
        const obj = {
          isClicked: false,
          paperId: paperId,
          userId: userId,
          question: el.question,
          options: el.options,
        } as IUserTest
        updatedQuestions.push(obj)
      }
    }

    const exam = await UserTestExam.findOneAndUpdate(
      {
        paperId,
        userId,
      },
      {
        $set: {
          paperId,
          userId,
          username,
          picture,
          started,
          ended,
          attempts,
          rate,
          accuracy,
          metric,
          instruction,
          questions: mainObjective.length,
          attemptedQuestions: questions.length,
          totalCorrectAnswer: correctAnswer,
        },
      },
      {
        new: true,
        upsert: true,
      }
    )
    const user = await UserInfo.findByIdAndUpdate(
      userId,
      { $inc: { attempts: 1 } },
      { new: true }
    )
    await User.updateMany({ userId: userId }, { $inc: { totalAttempts: 1 } })
    await UserTest.deleteMany({ userId: userId, paperId: paperId })
    await UserTest.insertMany(updatedQuestions)
    const attempt = await Attempt.findOne({ userId: userId, paperId: paperId })
    if (participant.length === 0) {
      await Exam.updateOne(
        { _id: paperId },
        {
          $inc: {
            participants: 1,
          },
        }
      )
    }
    if (attempt) {
      await Attempt.findByIdAndUpdate(attempt._id, {
        $inc: {
          attempts: 1,
        },
      })
    } else {
      await Attempt.create({ paperId: paperId, userId: userId, attempts: 1 })
    }

    const result = await queryData<IUserTest>(UserTest, req)
    const newAttempt = await Attempt.findOne({
      userId: userId,
      paperId: paperId,
    })

    const data = {
      exam,
      attempt: Number(newAttempt?.attempts),
      results: result.results,
      totalAttempts: user?.attempts,
      message: 'Exam submitted successfull',
    }

    res.status(200).json(data)
  } catch (error) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}

export const getExamById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Exam.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Exam not found' })
    }
    res.status(200).json(item)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getUserExam = async (req: Request, res: Response) => {
  try {
    const exam = await UserTestExam.findOne({
      userId: req.query.userId,
      paperId: req.query.paperId,
    })
    const result = await queryData<IUserTest>(UserTest, req)
    const data = {
      exam,
      results: result.results,
    }
    res.status(200).json(data)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getExams = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IUserTestExam>(UserTestExam, req)

    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateExam = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Exam,
      [],
      ['Exam not found', 'Exam was updated successfully']
    )
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

//-------------------LEAGUE--------------------//
export const createLeague = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, League, 'League was created successfully')
}

export const getLeagueById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await League.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'League not found' })
    }
    res.status(200).json(item)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getLeagues = async (req: Request, res: Response) => {
  try {
    const result = await queryData<ILeague>(League, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updateLeague = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Paper,
      ['media', 'picture'],
      ['Paper not found', 'Paper was updated successfully']
    )
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

//-----------------PAPER--------------------//
export const createPaper = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Paper, 'Paper was created successfully')
}

export const getPaperById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Paper.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Paper not found' })
    }
    res.status(200).json(item)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const getPapers = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IPaper>(Paper, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const updatePaper = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Paper,
      [],
      ['Paper not found', 'Paper was updated successfully']
    )
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

//-----------------OBJECTIVE--------------------//
export const createObjective = async (
  req: Request,
  res: Response
): Promise<void> => {
  const questions = JSON.parse(req.body.questions)
  const deletedIDs = JSON.parse(req.body.deletedIDs)
  for (let i = 0; i < deletedIDs.length; i++) {
    const id = deletedIDs[i]
    await Objective.findByIdAndDelete(id)
  }

  for (let i = 0; i < questions.length; i++) {
    const el = questions[i]
    if (el._id && el._id !== undefined && el._id !== '') {
      await Objective.updateOne(
        { _id: el._id },
        {
          $set: {
            question: el.question,
            options: el.options,
            index: el.index,
            paperId: el.paperId,
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
  await Exam.findOneAndUpdate(
    { _id: result.results[0].paperId },
    {
      questions: result.count,
    }
  )
  res.status(200).json({
    message: 'The question was saved successfully',
    count: result.count,
    results: result.results,
    page_size: result.page_size,
  })
}

export const getObjectives = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IObjective>(Objective, req)
    res.status(200).json(result)
  } catch (error) {
    handleError(res, undefined, undefined, error)
  }
}

export const searchExamInfo = (req: Request, res: Response) => {
  return search(Exam, req, res)
}
