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
import { Follower, Post } from "../../models/users/postModel";
import { School } from "../../models/team/schoolModel";
import { Exam } from "../../models/team/competitionModel";
import { IGeneral } from "../../utils/userInterface";
import { UserInfo, UserSchoolInfo } from "../../models/users/userInfoModel";

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
    interface media {
      type: string;
      source: string;
    }

    const setType = (model: string) => {
      if (model === "User") {
        return "User";
      } else if (model === "UserSchoolInfo") {
        return "People";
      } else if (model === "Post") {
        return "Post";
      } else if (model === "School") {
        return "School";
      } else if (model === "Exam") {
        return "Exam";
      } else {
        return model;
      }
    };

    const setMedia = (media: media) => {
      if (media) {
        const item = {
          type: media.type,
          source: media.source,
        };
        return item;
      } else {
        return media;
      }
    };

    const models: Model<any>[] = [UserSchoolInfo, User, Post, School, Exam];
    const { filter, page, page_size, userId } = generalSearchQuery(req);
    const followers = await Follower.find({ followerId: userId });
    const followersUserIds = followers.map((user) => user.userId);

    const searchPromises = models.map((model) =>
      model
        .find(filter)
        .skip((page - 1) * page_size)
        .limit(page_size)
        .then((docs) =>
          docs.map((doc) => ({ ...doc.toObject(), model: model.modelName }))
        )
    );

    const results = await Promise.all(searchPromises);

    const combinedResults = results.flat();

    const formattedResults: IGeneral[] = combinedResults
      // .filter((item) => {
      //   if (item.model === "UserSchoolInfo" && item.isVerified === false) {
      //     return false;
      //   }
      //   return true;
      // })
      .map((item) => ({
        picture: item.picture || "",
        name: item.name || item.displayName || "",
        title: item.title || "",
        subtitle: item.subtitle || "",
        displayName: item.displayName || "",
        content: item.content || "",
        intro: item.intro || "",
        username: item.username || "",
        media: item.media ? setMedia(item.media[0]) : "",
        type: setType(item.model) || "",
        id: item._id.toString(),
        country: item.country,
        state: item.state,
        area: item.area,
        description: item.description,
        nature: item.type,
        subject: item.subjects,
        currentSchoolName: item.currentSchoolName,
        isVerified: item.isVerified,
        currentSchoolCountry: item.currentSchoolCountry,
        currentSchoolCountrySymbol: item.currentSchoolCountrySymbol,
        currentSchoolState: item.currentSchoolState,
        currentSchoolCountryFlag: item.currentSchoolCountryFlag,
        logo: item.logo,
        countrySymbol: item.countrySymbol,
        createdAt: item.createdAt,
        followers: item.followers,
        isFollowed: followersUserIds.includes(String(item._id)),
      }));

    res.json(formattedResults);
  } catch (error) {
    console.error("Search Error:", error);
    handleError(res, undefined, undefined, error);
  }
};
