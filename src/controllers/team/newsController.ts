import { Request, Response } from "express";
import { News } from "../../models/team/newsModel";

import {
  deleteItem,
  updateItem,
  createItem,
  getItemById,
  getItems,
} from "../../utils/query";

export const createNews = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, News, "News was created successfully");
};

export const getNewsById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  getItemById(req, res, News, "News was not found");
};

export const getNews = async (req: Request, res: Response) => {
  getItems(req, res, News);
};

export const updateNews = async (req: Request, res: Response) => {
  updateItem(
    req,
    res,
    News,
    ["picture", "video"],
    ["News not found", "News was updated successfully"]
  );
};

export const deleteNews = async (req: Request, res: Response) => {
  await deleteItem(req, res, News, ["picture", "video"], "News not found");
};
