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
import { Attempt } from "../../models/users/competitionModel";
import { uploadFilesToS3 } from "../../utils/fileUpload";
import { Post } from "../../models/users/postModel";

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
  // createItem(req, res, Exam, "Exam was created successfully");

  try {
    if (req.body.continents) {
      req.body.continents = JSON.parse(req.body.continents);
    }
    if (req.body.countries) {
      req.body.countries = JSON.parse(req.body.countries);
    }
    if (req.body.countriesId) {
      req.body.countriesId = JSON.parse(req.body.countriesId);
    }
    if (req.body.states) {
      req.body.states = JSON.parse(req.body.states);
    }
    if (req.body.statesId) {
      req.body.statesId = JSON.parse(req.body.statesId);
    }
    if (req.body.academicLevels) {
      req.body.academicLevels = JSON.parse(req.body.academicLevels);
    }
    const uploadedFiles = await uploadFilesToS3(req);
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url;
    });

    const exam = await Exam.create(req.body);
    // await Post.create({
    //   userId: exam._id,
    //   username: `${exam.name}_${
    //     new Date(exam.publishedAt).getMonth() + 1
    //   }_${new Date(exam.publishedAt).getFullYear()}_${exam.subjects}`,
    //   picture: exam.picture,
    //   displayName: exam.picture,
    //   content: exam.title,
    //   status: false,
    // })

    const item = await queryData(Exam, req);
    const { page, page_size, count, results } = item;
    res.status(200).json({
      message: "Exam was created successfully",
      results,
      count,
      page,
      page_size,
    });
  } catch (error: any) {
    handleError(res, undefined, undefined, error);
  }
};

export const getExamById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Exam.findById(req.params.id);
    const attempt = await Attempt.findOne({
      paperId: req.params.id,
      userId: req.query.userId,
    });

    if (!item) {
      return res.status(404).json({ message: "Exam not found" });
    }
    res.status(200).json({ exam: item, attempt: attempt?.attempts });
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
  const deletedIDs = JSON.parse(req.body.deletedIDs);
  for (let i = 0; i < deletedIDs.length; i++) {
    const id = deletedIDs[i];
    // await Objective.findByIdAndDelete(id);
  }

  for (let i = 0; i < questions.length; i++) {
    const el = questions[i];
    if (el._id !== undefined && el._id !== "") {
      await Objective.findByIdAndUpdate(
        el._id,
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
