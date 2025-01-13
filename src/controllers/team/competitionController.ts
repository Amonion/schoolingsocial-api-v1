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
import { queryData, updateItem, createItem } from "../../utils/query";

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
): Promise<void> => {
  createItem(req, res, Exam, "Exam was created successfully");
};

export const getExamById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
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
    const result = await queryData<IExam>(Exam, req);
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
  for (let i = 0; i < questions.length; i++) {
    const el = questions[i];
    await Objective.updateOne(
      { index: el.index, paperId: el.paperId },
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
  }
  res.status(200).json({
    message: "The question was saved successfully",
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
