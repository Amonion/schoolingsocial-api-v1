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
  followAccount,
  search,
} from "../../utils/query";
import { IPost } from "../../utils/userInterface";
import { Bookmark, Like, View } from "../../models/users/statModel";
import { postScore } from "../../utils/computation";
import { io } from "../../app";

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

    if (!user) {
      throw new Error("User not found");
    }

    await Follower.create({
      userId: user._id,
      followingId: followingsId,
    });
    res.status(200).json({
      message: "Account created successfully",
      user: user,
    });
  } catch (error: any) {
    console.log(error);
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
export const makePost = async (req: Request, res: Response) => {
  try {
    const sender = req.body.sender;
    const data = req.body;
    const form = {
      picture: sender.picture,
      username: sender.username,
      displayName: sender.displayName,
      polls: data.polls,
      users: data.users,
      userId: sender._id,
      postId: data.postId,
      postType: data.postType,
      content: data.content,
      createdAt: data.createdAt,
      media: data.media,
      isVerified: sender.isVerified,
    };

    const post = await Post.create(form);
    const score = postScore(
      post.likes,
      post.replies,
      post.shares,
      post.bookmarks,
      post.reposts,
      post.views
    );
    if (data.postType === "comment") {
      await User.updateOne(
        { _id: sender._id },
        {
          $inc: { comments: 1 },
        }
      );
      await Post.updateOne(
        { _id: data.postId },
        {
          $inc: { replies: 1 },
          $set: { score: score },
        }
      );
    } else {
      await User.updateOne(
        { _id: sender._id },
        {
          $inc: { posts: 1 },
        }
      );
    }
    await View.create({
      postId: post._id,
      userId: sender._id,
    });

    res.status(200).json({
      message: "Your content is posted successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
    handleError(res, undefined, undefined, error);
  }
};

export const createPost = async (data: IPost) => {
  try {
    const sender = data.sender;
    const form = {
      picture: sender.picture,
      username: sender.username,
      displayName: sender.displayName,
      polls: data.polls,
      users: data.users,
      userId: sender._id,
      postId: data.postId,
      postType: data.postType,
      content: data.content,
      createdAt: data.createdAt,
      media: data.media,
      isVerified: sender.isVerified,
    };

    const post = await Post.create(form);
    const score = postScore(
      post.likes,
      post.replies,
      post.shares,
      post.bookmarks,
      post.reposts,
      post.views
    );
    if (data.postType === "comment") {
      await User.updateOne(
        { _id: sender._id },
        {
          $inc: { comments: 1 },
        }
      );
      await Post.updateOne(
        { _id: data.postId },
        {
          $inc: { replies: 1 },
          $set: { score: score },
        }
      );
    } else {
      await User.updateOne(
        { _id: sender._id },
        {
          $inc: { posts: 1 },
        }
      );
    }
    await View.create({
      postId: post._id,
      userId: sender._id,
    });

    io.emit(`post${sender._id}`, {
      message: "Your post was created successfully",
      data: post,
    });
  } catch (error) {
    console.log(error);
  }
};

export const repostPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { reposts: 1 } }, // Replace `views` with the field you want to increment
      { new: true } // Return the updated document
    );
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const score = postScore(
      post.likes,
      post.replies,
      post.shares,
      post.bookmarks,
      post.reposts,
      post.views
    );

    await Post.findByIdAndUpdate(req.params.id, { $set: { score: score } });

    const { _id, ...rest } = post.toObject();
    rest.username = req.body.username;
    rest.displayName = req.body.displayName;
    rest.picture = req.body.picture;
    rest.isVerified = req.body.isVerified;
    rest.userId = req.body.userId;
    rest.createdAt = req.body.createdAt;

    const newPost = await Post.create(rest);

    await View.create({
      postId: newPost._id,
      userId: req.body.userId,
    });

    io.emit(`post${req.body.userId}`, {
      message: "Your post was created successfully",
      data: post,
    });

    const followers = await Follower.find({ userId: req.body.userId });
    res.status(201).json(newPost);
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
    const followerId = String(req.query.myId);
    delete req.query.myId;
    delete req.query.following;
    const processedPosts = await processFetchedPosts(req, followerId);

    res.status(200).json(processedPosts);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getFollowingPosts = async (req: Request, res: Response) => {
  try {
    const followerId = String(req.query.myId);
    const followers = await Follower.find({ followerId: followerId });
    const followersUserIds = followers.map((user) => user.userId);
    delete req.query.myId;

    const mongoQuery = {
      ...req.query,
      userId: { in: followersUserIds },
    };
    req.query = mongoQuery;
    delete req.query.myId;

    const processedPosts = await processFetchedPosts(req, followerId);

    res.status(200).json(processedPosts);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getBookMarkedPosts = async (req: Request, res: Response) => {
  try {
    const bookmarkUserId = String(req.query.myId);
    const bookmarks = await Bookmark.find({ bookmarkUserId: bookmarkUserId });

    // const followers = await Follower.find({ followerId: followerId });
    const bookmarksPostIds = bookmarks.map((post) => post.postId);
    // delete req.query.myId;

    const mongoQuery = {
      ...req.query,
      _id: { in: bookmarksPostIds },
    };
    req.query = mongoQuery;
    delete req.query.myId;

    const processedPosts = await processFetchedPosts(req, bookmarkUserId);
    res.status(200).json(processedPosts);

    // const posts = response.results;
    // const postIds = posts.map((post) => post._id);

    // const userIds = [...new Set(posts.map((post) => post.userId))];
    // const userObjects = userIds.map((userId) => ({ userId, followerId }));

    // const queryConditions = userObjects.map(({ userId, followerId }) => ({
    //   userId,
    //   followerId,
    // }));

    // const follows = await Follower.find(
    //   { $or: queryConditions },
    //   { userId: 1, _id: 0 }
    // );
    // const followedUserIds = new Set(follows.map((user) => user.userId));

    // posts.map((post) => {
    //   if (followedUserIds.has(post.userId)) {
    //     post.followed = true;
    //   }
    //   return post;
    // });

    // const likedPosts = await Like.find({
    //   userId: followerId,
    //   postId: { $in: postIds },
    // }).select("postId");

    // const bookmarkedPosts = await Bookmark.find({
    //   userId: followerId,
    //   postId: { $in: postIds },
    // }).select("postId");

    // const viewedPosts = await View.find({
    //   userId: followerId,
    //   postId: { $in: postIds },
    // }).select("postId");

    // const likedPostIds = likedPosts.map((like) => like.postId.toString());

    // const bookmarkedPostIds = bookmarkedPosts.map((bookmark) =>
    //   bookmark.postId.toString()
    // );

    // const viewedPostIds = viewedPosts.map((view) => view.postId.toString());

    // const updatedPosts = [];

    // for (let i = 0; i < posts.length; i++) {
    //   const el = posts[i];
    //   if (likedPostIds.includes(el._id.toString())) {
    //     el.liked = true;
    //   }
    //   if (bookmarkedPostIds.includes(el._id.toString())) {
    //     el.bookmarked = true;
    //   }
    //   if (viewedPostIds.includes(el._id.toString())) {
    //     el.viewed = true;
    //   }

    //   updatedPosts.push(el);
    // }

    // res.status(200).json({
    //   count: response.count,
    //   page: response.page,
    //   page_size: response.page_size,
    //   results: updatedPosts,
    // });
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

    if (post.postType === "comment") {
      await User.updateOne(
        { _id: post.userId },
        {
          $inc: { comments: -1 },
        }
      );
      await Post.updateOne(
        { _id: post._id },
        {
          $inc: { replies: -1 },
        }
      );
    } else {
      await User.updateOne(
        { _id: post.userId },
        {
          $inc: { posts: -1 },
        }
      );
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
      const bookmark = await Bookmark.findOne({
        postId: id,
        bookmarkUserId: userId,
      });
      if (bookmark) {
        updateQuery.$inc = { bookmarks: -1 };
        await Bookmark.deleteOne({ postId: id, bookmarkUserId: userId });
      } else {
        updateQuery.$inc = { bookmarks: 1 };
        await Bookmark.create({
          postId: id,
          userId: post.userId,
          bookmarkUserId: userId,
        });
      }
    }

    if (req.body.views !== undefined) {
      if (!req.body.viewedPostIds) {
        for (let i = 0; i < req.body.viewedPostIds.length; i++) {
          const el = req.body.viewedPostIds[i];
          const post = await View.findOne({ userId: userId, postId: el._id });
          if (!post) {
            updateQuery.$inc = { views: 1 };
            await View.create({ userId: userId, postId: el._id });
          }
        }
      } else {
        const post = await View.findOne({ userId: userId, postId: id });
        if (!post) {
          updateQuery.$inc = { views: 1 };
          await View.create({ userId: userId, postId: id });
        }
      }
    }

    const score = postScore(
      post.likes,
      post.replies,
      post.shares,
      post.bookmarks,
      post.reposts,
      post.views
    );

    await Post.updateOne(
      { _id: post._id },
      {
        $set: { score: score },
      }
    );

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

export const updatePostViews = async (req: Request, res: Response) => {
  try {
    const { userId, id, viewedPostIds } = req.body;
    let updateQuery: any = {};

    const posts = await Post.find({
      _id: { $in: viewedPostIds },
    });

    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    for (let i = 0; i < posts.length; i++) {
      const el = posts[i];
      const post = await View.findOne({ userId: userId, postId: el._id });
      const score = postScore(
        el.likes,
        el.replies,
        el.shares,
        el.bookmarks,
        el.reposts,
        el.views
      );

      await Post.updateOne(
        { _id: el._id },
        {
          $set: { score: score },
        }
      );
      if (!post) {
        updateQuery.$inc = { views: 1 };
        await View.create({ userId: userId, postId: el._id });
        await Post.findByIdAndUpdate(el._id, updateQuery, {
          new: true,
        });
      }
    }

    return res.status(200).json({ message: null });
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

export const searchPosts = (req: Request, res: Response) => {
  return search(Post, req, res);
};
//-----------------FOLLOW USER--------------------//
export const followUser = async (req: Request, res: Response) => {
  try {
    const { follow, message } = await followAccount(req, res);
    const post = req.body.post;
    post.followed = follow ? false : true;
    post.isActive = false;

    res.status(200).json({
      message: message,
      data: post,
      action: "follow",
      actionType: post.postType,
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

const processFetchedPosts = async (req: Request, followerId: string) => {
  const response = await queryData(Post, req);

  const posts = response.results;
  const postIds = posts.map((post) => post._id);

  const userIds = [...new Set(posts.map((post) => post.userId))];
  const userObjects = userIds.map((userId) => ({ userId, followerId }));

  const queryConditions = userObjects.map(({ userId, followerId }) => ({
    userId,
    followerId,
  }));

  const follows = await Follower.find(
    { $or: queryConditions },
    { userId: 1, _id: 0 }
  );
  const followedUserIds = new Set(follows.map((user) => user.userId));

  posts.map((post) => {
    if (followedUserIds.has(post.userId)) {
      post.followed = true;
    }
    return post;
  });

  const likedPosts = await Like.find({
    userId: followerId,
    postId: { $in: postIds },
  }).select("postId");

  const bookmarkedPosts = await Bookmark.find({
    bookmarkUserId: followerId,
    postId: { $in: postIds },
  }).select("postId");

  const viewedPosts = await View.find({
    userId: followerId,
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

  return {
    count: response.count,
    page: response.page,
    page_size: response.page_size,
    results: updatedPosts,
  };
};
