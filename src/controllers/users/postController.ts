import { Request, Response } from "express";
import { Account, Follower, Post, Comment } from "../../models/users/postModel";
import { uploadFilesToS3 } from "../../utils/fileUpload";
import { handleError } from "../../utils/errorHandler";
import { User } from "../../models/users/userModel";
import { updateItem, getItemById, getItems } from "../../utils/query";
import { Socket, IPost } from "../../utils/userInterface";

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
      userId,
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

    await Follower.create({
      userId: account._id,
      followingId: followingsId,
    });

    console.log(user);

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

/////////////////////////////// POST /////////////////////////////////

export const createPost = async (data: IPost) => {
  try {
    const sender = data.sender;
    // const postType = data.type;
    const form = {
      picture: sender.picture,
      username: sender.username,
      displayName: sender.displayName,
      userId: sender._id,
      postId: data.postId,
      postType: data.postType,
      content: data.content,
      createdAt: data.createdAt,
      media: data.media,
      isVerified: sender.isVerified,
    };

    const post = await Post.create(form);

    return {
      message: "Your post was created successfully",
      data: post,
    };
  } catch (error) {
    console.log(error);
  }
};

export const getPostById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  getItemById(req, res, Post, "Post not found");
};

export const getPosts = async (req: Request, res: Response) => {
  getItems(req, res, Post);
};

export const getComments = async (req: Request, res: Response) => {
  getItems(req, res, Comment);
};

export const updatePost = async (req: Request, res: Response) => {
  try {
    const uploadedFiles = await uploadFilesToS3(req);

    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url;
    });

    const post = await Post.findByIdAndUpdate(req.params.id, req.body);

    res.status(201).json({
      message: "Your post was updated successfully",
      data: post,
    });
  } catch (error: any) {
    handleError(res, undefined, undefined, error);
  }
};

export const deletePost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post is deleted successfully" });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};
