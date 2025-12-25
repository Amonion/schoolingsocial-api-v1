import { Request, Response } from 'express'
import { handleError } from '../../utils/errorHandler'
import { Exam } from '../../models/exam/competitionModel'
import { queryData, search, updateItem } from '../../utils/query'
import {
  IUserObjective,
  IUserTestExam,
  LastUserObjective,
  UserObjective,
  UserTestExam,
} from '../../models/users/competitionModel'
import { User } from '../../models/users/user'
import { Objective } from '../../models/exam/objectiveModel'
import { BioUserState } from '../../models/users/bioUserState'
import { io } from '../../app'

export interface IOption {
  index: number
  value: string
  isSelected: boolean
  isClicked: boolean
}

interface OptionBody {
  option: IOption
  bioUserId: string
  questionId: string
}

//-----------------Exam--------------------//
export const submitTest = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const paperId = req.body.paperId
    const bioUserId = req.body.bioUserId
    const ended = Number(req.body.ended)
    const started = Number(req.body.started)

    const questions = await UserObjective.find({ paperId, bioUserId })
    const rate = (1000 * questions.length) / (ended - started)

    const paper = await UserTestExam.findOne({
      paperId: paperId,
      bioUserId: bioUserId,
    })
    const attempts =
      !paper || paper?.isFirstTime ? 1 : Number(paper?.attempts) + 1
    const correctAnswer = questions.filter((item) => item.isCorrect).length

    const accuracy = correctAnswer / questions.length
    const metric = accuracy * rate
    const exam = await UserTestExam.findOneAndUpdate(
      {
        paperId,
        bioUserId,
      },
      {
        $set: {
          ended,
          attempts,
          rate,
          accuracy,
          metric,
          attemptedQuestions: questions.length,
          totalCorrectAnswer: correctAnswer,
        },
      },
      {
        new: true,
        upsert: true,
      }
    )

    const docs = await UserObjective.find({ paperId, bioUserId })
    if (docs.length) {
      const bulk = docs.map((doc) => {
        const newQuestions = doc.options.map((q) => ({
          ...q,
          isClicked: false,
          isSelected: false,
        }))

        return {
          updateOne: {
            filter: { _id: doc._id },
            update: { $set: { questions: newQuestions } },
          },
        }
      })

      await UserObjective.bulkWrite(bulk)
    }

    await LastUserObjective.deleteMany({
      bioUserId: bioUserId,
      paperId: paperId,
    })
    await LastUserObjective.insertMany(questions)
    const result = await queryData<IUserObjective>(LastUserObjective, req)

    const data = {
      exam,
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

export const selectAnswer = async (
  body: OptionBody
): Promise<Response | void> => {
  try {
    let mainObjective = await Objective.findById(body.questionId)

    if (mainObjective) {
      let selectedOption = body.option
      const options = mainObjective.options.map((item) =>
        item.index === selectedOption.index
          ? {
              ...selectedOption,
              isSelected: item.isSelected,
              isClicked: item.value === selectedOption.value,
              objectiveId: body.questionId,
            }
          : item
      )

      const paper = await UserObjective.findOneAndUpdate(
        { objectiveId: body.questionId },
        { $set: { options: options } },
        { new: true, upsert: true }
      )
      io.emit(`test_${body.bioUserId}`, {
        paper,
      })
    }
  } catch (error) {
    console.log(error)
  }
}

export const initExam = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const paperId = req.body.paperId
    const bioUserId = req.body.bioUserId
    const questions = await Objective.find({ paperId })
    const ops = questions.map((el) => ({
      updateOne: {
        filter: { paperId, bioUserId, objectiveId: el._id },
        update: {
          $set: {
            ...el.toObject(),
            bioUserId: bioUserId,
            objectiveId: el._id,
          },
        },
        upsert: true,
      },
    }))

    await UserObjective.bulkWrite(ops)

    const exam = await UserTestExam.findOneAndUpdate(
      {
        paperId,
        bioUserId,
      },
      {
        $set: req.body,
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
      { bioUserId: bioUserId },
      { $inc: { examAttempts: 1 } },
      { new: true, upsert: true }
    )

    await User.updateMany(
      { bioUserId: bioUserId },
      { $inc: { totalAttempts: 1 } }
    )
    res.status(200).json({ exam })
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
      bioUserId: req.query.bioUserId,
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
