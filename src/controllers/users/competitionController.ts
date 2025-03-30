import { Request, Response } from "express";
import { handleError } from "../../utils/errorHandler";
import {
  Weekend,
  Exam,
  League,
  Paper,
  Objective,
} from "../../models/team/competitionModel";
import {
  IWeekend,
  IExam,
  ILeague,
  IPaper,
  IObjective,
} from "../../utils/teamInterface";
import { queryData, updateItem, createItem, search } from "../../utils/query";
import { UserTest } from "../../models/users/competitionModel";
import { IUserTest } from "../../utils/userInterface";

export const createWeekend = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Weekend, "Weekend was created successfully");
};

export const getWeekendById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Weekend.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Weekend not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getWeekends = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IWeekend>(Weekend, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateWeekend = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Weekend,
      ["video", "picture"],
      ["Weekend not found", "Weekend was updated successfully"]
    );
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

//-----------------Exam--------------------//
export const createExam = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const paperId = req.body.paperId;
    const attempted = req.body.attemptedQuestions;
    const answeredQuestions = req.body.questions
      ? JSON.parse(req.body.questions)
      : [];

    const exam = await Exam.findById(paperId);

    const processQuestions = (questions: IObjective[]) => {
      const updatedQuestions = questions.map((question) => {
        const hasMatchingSelection = question.options.some(
          (option) => option.isSelected && option.isClicked
        );

        return {
          ...question,
          isValid: hasMatchingSelection, // Mark the question as valid or not
          options: question.options.map((option) => ({
            ...option,
            isSelected: option.isClicked, // Sync isSelected with isClicked
          })),
        };
      });

      const totalCorrect = updatedQuestions.filter((q) => q.isValid).length;

      return { updatedQuestions, totalCorrect };
    };

    const result = processQuestions(answeredQuestions);
    const duration = exam?.duration ? exam.duration : 1;
    const questions = exam?.questions ? exam?.questions : 1;
    const rate = attempted / duration;
    const accuracy = result.totalCorrect / questions;

    const form = {
      username: req.body.username,
      userId: req.body.userId,
      paperId: req.body.paperId,
      picture: req.body.picture,
      started: req.body.started,
      ended: req.body.ended,
      title: exam?.title,
      type: exam?.type,
      name: exam?.name,
      questionLen: exam?.questions,
      rate: rate,
      accuracy: accuracy,
      metric: rate * accuracy,
      questions: answeredQuestions,
      attemptedQuestions: attempted,
      attempts: req.body.attempts,
      totalCorrectAnswer: result.totalCorrect,
    };

    const item = await UserTest.findOneAndUpdate({ paperId: paperId }, form, {
      new: true,
      upsert: true,
    });

    res
      .status(200)
      .json({ message: "Exam submitted successfully", data: item });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getExamById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  console.log(req.params.id);
  try {
    const item = await Exam.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getExams = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IUserTest>(UserTest, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateExam = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Exam,
      [],
      ["Exam not found", "Exam was updated successfully"]
    );
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

//-------------------LEAGUE--------------------//
export const createLeague = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, League, "League was created successfully");
};

export const getLeagueById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await League.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "League not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getLeagues = async (req: Request, res: Response) => {
  try {
    const result = await queryData<ILeague>(League, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateLeague = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Paper,
      ["media", "picture"],
      ["Paper not found", "Paper was updated successfully"]
    );
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

//-----------------PAPER--------------------//
export const createPaper = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Paper, "Paper was created successfully");
};

export const getPaperById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Paper.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Paper not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getPapers = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IPaper>(Paper, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updatePaper = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Paper,
      [],
      ["Paper not found", "Paper was updated successfully"]
    );
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

//-----------------OBJECTIVE--------------------//
export const createObjective = async (
  req: Request,
  res: Response
): Promise<void> => {
  const questions = JSON.parse(req.body.questions);
  const deletedIDs = JSON.parse(req.body.deletedIDs);
  for (let i = 0; i < deletedIDs.length; i++) {
    const id = deletedIDs[i];
    await Objective.findByIdAndDelete(id);
  }

  for (let i = 0; i < questions.length; i++) {
    const el = questions[i];
    if (el._id && el._id !== undefined && el._id !== "") {
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
      );
    } else {
      await Objective.create({
        question: el.question,
        options: el.options,
        paperId: el.paperId,
        index: el.index,
      });
    }
  }

  const result = await queryData(Objective, req);
  await Exam.findOneAndUpdate(
    { _id: result.results[0].paperId },
    {
      questions: result.count,
    }
  );
  res.status(200).json({
    message: "The question was saved successfully",
    count: result.count,
    results: result.results,
    page_size: result.page_size,
  });
};

export const getObjectives = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IObjective>(Objective, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const searchExamInfo = (req: Request, res: Response) => {
  return search(Exam, req, res);
};
