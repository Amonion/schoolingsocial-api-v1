import { Request, Response } from "express";
import { Account, Follower, Post } from "../../models/users/postModel";
import { deleteFileFromS3, uploadFilesToS3 } from "../../utils/fileUpload";
import { handleError } from "../../utils/errorHandler";
import { User } from "../../models/users/userModel";
import {
  updateItem,
  getItemById,
  getItems,
  queryData,
} from "../../utils/query";
import { IPost } from "../../utils/userInterface";
import { Bookmark, Like, View } from "../../models/users/PostStatModel";
import { postScore } from "../../utils/computation";
import { UserInfo } from "../../models/users/userInfoModel";

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

    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        picture: picture,
        displayName: displayName,
        isFirstTime: false,
        username: username,
        interests: interests,
        intro: description,
      },
      { new: true }
    );
    await UserInfo.findByIdAndUpdate(
      user?.userId,
      {
        picture: picture,
        displayName: displayName,
        username: username,
        intro: description,
      },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    await Follower.create({
      userId: user._id,
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

/////////////////////////////// POST /////////////////////////////////

export const createPost = async (data: IPost) => {
  try {
    const sender = data.sender;
    const form = {
      picture: sender.picture,
      username: sender.username,
      displayName: sender.displayName,
      polls: data.polls,
      userId: sender._id,
      postId: data.postId,
      postType: data.postType,
      content: data.content,
      createdAt: data.createdAt,
      media: data.media,
      isVerified: sender.isVerified,
    };

    const post = await Post.create(form);

    if (data.postType === "comment") {
      await Post.updateOne(
        { _id: data.postId },
        {
          $inc: { replies: 1 },
          $push: { users: sender.username },
        }
      );
    } else {
      await View.create({
        postId: post._id,
        userId: sender._id,
      });

      const score = postScore(
        post.likes,
        post.replies,
        post.shares,
        post.bookmarks,
        post.views
      );

      await Post.updateOne(
        { _id: post._id },
        {
          $inc: { score: score },
          $push: { users: sender.username },
        }
      );
    }

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
  try {
    const userId = req.query.userId;
    req.query.userId = undefined;
    const response = await queryData(Post, req);
    const posts = response.results;
    const postIds = posts.map((post) => post._id);

    const likedPosts = await Like.find({
      userId: userId,
      postId: { $in: postIds },
    }).select("postId");

    const bookmarkedPosts = await Bookmark.find({
      userId: userId,
      postId: { $in: postIds },
    }).select("postId");

    const viewedPosts = await View.find({
      userId: userId,
      postId: { $in: postIds },
    }).select("postId");

    const likedPostIds = likedPosts.map((like) => like.postId.toString());

    const bookmarkedPostIds = bookmarkedPosts.map((bookmark) =>
      bookmark.postId.toString()
    );

    const viewedPostIds = viewedPosts.map((view) => view.postId.toString());

    const updatedPosts = [];

    for (let i = 0; i < posts.length; i++) {
      const el = posts[i];
      if (likedPostIds.includes(el._id.toString())) {
        el.liked = true;
      }
      if (bookmarkedPostIds.includes(el._id.toString())) {
        el.bookmarked = true;
      }
      if (viewedPostIds.includes(el._id.toString())) {
        el.viewed = true;
      }

      updatedPosts.push(el);
    }

    res.status(200).json({
      count: response.count,
      page: response.page,
      page_size: response.page_size,
      results: updatedPosts,
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
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
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "This post has been deleted" });
    }

    if (post.media.length > 0) {
      for (let i = 0; i < post.media.length; i++) {
        const el = post.media[i];
        deleteFileFromS3(el.source);
      }
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Post is deleted successfully",
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updatePostStat = async (req: Request, res: Response) => {
  try {
    const { userId, id } = req.body;
    let updateQuery: any = {};

    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (req.body.likes !== undefined) {
      if (!req.body.likes && post.likes <= 0) {
        return res.status(200).json({ message: null });
      }

      const like = await Like.findOne({ postId: id, userId });
      if (like) {
        updateQuery.$inc = { likes: -1 };
        await Like.deleteOne({ postId: id, userId });
      } else {
        updateQuery.$inc = { likes: 1 };
        await Like.create({ postId: id, userId });
      }
    }

    if (req.body.bookmarks !== undefined) {
      if (!req.body.bookmarks && post.bookmarks <= 0) {
        return res.status(200).json({ message: null });
      }
      const bookmark = await Bookmark.findOne({ postId: id, userId });
      if (bookmark) {
        updateQuery.$inc = { bookmarks: -1 };
        await Bookmark.deleteOne({ postId: id, userId });
      } else {
        updateQuery.$inc = { bookmarks: 1 };
        await Bookmark.create({ postId: id, userId });
      }
    }

    if (req.body.views !== undefined) {
      const post = await View.findOne({ userId: userId, postId: id });
      if (!post) {
        updateQuery.$inc = { views: 1 };
        await View.create({ userId: userId, postId: id });
      }
    }

    if (Object.keys(updateQuery).length > 0) {
      await Post.findByIdAndUpdate(id, updateQuery, {
        new: true,
      });
      return res.status(200).json({ message: null });
    } else {
      return res.status(200).json({ message: null });
    }
  } catch (error: any) {
    handleError(res, undefined, undefined, error);
  }
};

export const getPostStat = async (req: Request, res: Response) => {
  try {
    const { id, userId } = req.query;

    const hasLiked = await Like.findOne({ postId: id, userId });
    const hasBookmarked = await Bookmark.findOne({ postId: id, userId });

    return res.status(200).json({
      likes: hasLiked ? true : false,
      bookmarks: hasBookmarked ? true : false,
    });
  } catch (error: any) {
    handleError(res, undefined, undefined, error);
  }
};
