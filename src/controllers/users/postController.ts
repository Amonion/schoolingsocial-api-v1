import { Request, Response } from "express";
import { Account, Follower } from "../../models/users/postModel";
import { uploadFilesToS3 } from "../../utils/fileUpload";
import { handleError } from "../../utils/errorHandler";
import { User } from "../../models/users/userModel";
import {
  deleteItem,
  updateItem,
  createItem,
  getItemById,
  getItems,
} from "../../utils/query";

export const createAccount = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const uploadedFiles = await uploadFilesToS3(req);
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url;
    });
    const {
      username,
      displayName,
      description,
      picture,
      followingsId,
      interests,
      userId,
    } = req.body;
    const account = await Account.create({
      username,
      displayName,
      picture,
      description,
    });

    const user = await User.findByIdAndUpdate(
      userId,
      {
        picture: picture,
        displayName: displayName,
        isFirstTime: false,
        username: username,
        interests: interests,
      },
      { new: true }
    );

    Follower.create({
      userId: account._id,
      followingId: followingsId,
    });

    res.status(201).json({
      message: "Account created successfully",
      user: user,
    });
  } catch (error: any) {
    handleError(res, undefined, undefined, error);
  }
};

export const getAccountById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  getItemById(req, res, Account, "Account was not found");
};

export const getAccounts = async (req: Request, res: Response) => {
  getItems(req, res, Account);
};

export const updateAccount = async (req: Request, res: Response) => {
  updateItem(
    req,
    res,
    Account,
    ["picture", "media"],
    ["Account not found", "Account was updated successfully"]
  );
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const email = await Account.findByIdAndDelete(req.params.id);
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }
    res.status(200).json({ message: "Email deleted successfully" });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};
