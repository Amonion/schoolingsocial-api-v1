import { Request, Response } from "express";
import { Upload } from "../../models/users/uploadModel";

import {
  deleteItem,
  createItem,
  updateItem,
  getItemById,
  getItems,
  generalSearchQuery,
} from "../../utils/query";
import { handleError } from "../../utils/errorHandler";
import { Model } from "mongoose";
import { User } from "../../models/users/userModel";
import { Post } from "../../models/users/postModel";
import { School } from "../../models/team/schoolModel";
import { Exam } from "../../models/team/competitionModel";
import { IGeneral } from "../../utils/userInterface";
import { UserInfo } from "../../models/users/userInfoModel";

//--------------------UPLOADS-----------------------//
export const createUpload = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Upload, "Uploads was created successfully");
};

export const createUploadVideo = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Upload, "Uploads was created successfully");
};

export const getUploadById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  getItemById(req, res, Upload, "Upload was not found");
};

export const getUploads = async (req: Request, res: Response) => {
  getItems(req, res, Upload);
};

export const updateUpload = async (req: Request, res: Response) => {
  updateItem(
    req,
    res,
    Upload,
    ["media"],
    ["Upload not found", "Upload was updated successfully"]
  );
};

export const deleteUpload = async (req: Request, res: Response) => {
  await deleteItem(req, res, Upload, ["media"], "Upload not found");
};

export const multiSearch = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const setType = (type: string) => {
      if (type === "UserInfo") {
        return "User";
      } else if (type === "User") {
        return "Account";
      } else {
        return type;
      }
    };
    const models: Model<any>[] = [User, UserInfo, Post, School, Exam];

    // const searchQuery = generalSearchQuery(req);

    const { filter, page, page_size } = generalSearchQuery(req);

    const searchPromises = models.map((model) =>
      model
        .find(filter)
        .skip((page - 1) * page_size)
        .limit(page_size)
        .then((docs) =>
          docs.map((doc) => ({ ...doc.toObject(), type: model.modelName }))
        )
    );
    const results = await Promise.all(searchPromises);

    const combinedResults = results.flat();

    const formattedResults: IGeneral[] = combinedResults.map((item) => ({
      picture: item.picture || "",
      name: item.name || item.username || item.title || item.displayName || "",
      title: item.title || "",
      username: item.username || "",
      type: setType(item.type) || "",
      id: item._id.toString(),
    }));

    res.json(formattedResults);
  } catch (error) {
    console.error("Search Error:", error);
    handleError(res, undefined, undefined, error);
  }
};
