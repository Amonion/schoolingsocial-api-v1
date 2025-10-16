import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import { Exam } from '../../models/exam/competitionModel'
import { queryData, search, updateItem } from '../../utils/query'
import {
  Attempt,
  IUserObjective,
  IUserTestExam,
  UserObjective,
  UserTestExam,
} from '../../models/users/competitionModel'
import { User } from '../../models/users/user'
import { IObjective, Objective } from '../../models/exam/objectiveModel'
import { BioUserState } from '../../models/users/bioUserState'

//-----------------Exam--------------------//
export const submitTest = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const paperId = req.body.paperId
    const bioUserId = req.body.bioUserId
    const username = req.body.username
    const picture = req.body.picture
    const displayName = req.body.displayName
    const started = Number(req.body.started)
    const ended = Number(req.body.ended)
    // const attempts = Number(req.body.attempts);
    const instruction = req.body.instruction
    const questions = req.body.questions ? JSON.parse(req.body.questions) : []

    const rate = (1000 * questions.length) / (ended - started)
    let mainObjective = await Objective.find({ paperId: paperId })

    const paper = await UserTestExam.findOne({
      paperId: paperId,
      bioUserId: bioUserId,
    })
    const attempts =
      !paper || paper?.isFirstTime ? 1 : Number(paper?.attempts) + 1

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
    const updatedQuestions: IUserObjective[] = []
    for (let i = 0; i < mainObjective.length; i++) {
      const el = mainObjective[i]
      const objIndex = questions.findIndex(
        (obj: IObjective) => obj._id == el._id
      )

      if (objIndex !== -1) {
        const obj = {
          isClicked: questions[objIndex].isClicked,
          paperId: paperId,
          bioUserId: bioUserId,
          question: el.question,
          options: questions[objIndex].options,
        } as IUserObjective
        updatedQuestions.push(obj)
      } else {
        const obj = {
          isClicked: false,
          paperId: paperId,
          bioUserId: bioUserId,
          question: el.question,
          options: el.options,
        } as IUserObjective
        updatedQuestions.push(obj)
      }
    }

    const exam = await UserTestExam.findOneAndUpdate(
      {
        paperId,
        bioUserId,
      },
      {
        $set: {
          paperId,
          bioUserId,
          username,
          displayName,
          picture,
          started,
          ended,
          attempts,
          rate,
          accuracy,
          metric,
          instruction,
          isFirstTime: false,
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

    const bioUserState = await BioUserState.findOneAndUpdate(
      { bioUserId: bioUserId },
      { $inc: { examAttempts: paper?.isFirstTime ? 0 : 1 } },
      { new: true, upsert: true }
    )

    await UserObjective.deleteMany({ bioUserId: bioUserId, paperId: paperId })
    await UserObjective.insertMany(updatedQuestions)
    if (!paper) {
      await Exam.updateOne(
        { _id: paperId },
        {
          $inc: {
            participants: 1,
          },
        }
      )
    }

    const result = await queryData<IUserObjective>(UserObjective, req)

    const data = {
      exam,
      bioUserState,
      attempt: Number(exam?.attempts),
      results: result.results,
      message: 'Exam submitted successfull',
    }

    res.status(200).json(data)
  } catch (error) {
    console.log(error)
    handleError(res, undefined, undefined, error)
  }
}

export const initExam = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const paperId = req.body.paperId
    const userId = req.body.userId
    const username = req.body.username
    const picture = req.body.picture
    const displayName = req.body.displayName
    const started = Number(req.body.started)
    const instruction = req.body.instruction

    let questions = await Objective.countDocuments({ paperId: paperId })
    await UserTestExam.findOneAndUpdate(
      {
        paperId,
        userId,
      },
      {
        $set: {
          paperId,
          userId,
          username,
          displayName,
          picture,
          started,
          attempts: 1,
          isFirstTime: true,
          rate: 0,
          accuracy: 0,
          instruction,
          questions: questions,
          attemptedQuestions: 0,
          totalCorrectAnswer: 0,
        },
      },
      {
        new: true,
        upsert: true,
      }
    )

    await Exam.updateOne(
      { _id: paperId },
      {
        $inc: {
          participants: 1,
        },
      }
    )
    await BioUserState.findByIdAndUpdate(
      userId,
      { $inc: { examAttempts: 1 } },
      { new: true, upsert: true }
    )

    await User.updateMany({ userId: userId }, { $inc: { totalAttempts: 1 } })

    res.status(200).json({ message: 'Exam is initialized' })
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
    const result = await queryData<IUserObjective>(UserObjective, req)
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

export const searchExamInfo = (req: Request, res: Response) => {
  return search(Exam, req, res)
}
