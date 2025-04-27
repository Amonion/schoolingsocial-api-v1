import { Request, Response } from "express";
import { Chat } from "../../models/users/chatModel";
import { handleError } from "../../utils/errorHandler";
import { IChat } from "../../utils/userInterface";
import { queryData } from "../../utils/query";
import { deleteFileFromS3 } from "../../utils/fileUpload";
import { io } from "../../app";
import { sendNotification } from "../../utils/sendEmail";

const setConnectionKey = (id1: string, id2: string) => {
  const participants = [id1, id2].sort();
  return participants.join("");
};

interface Receive {
  ids: string[];
  receiverId: string;
  userId: string;
  username: string;
  receiverUsername: string;
  connection: string;
}

export const createChat = async (data: IChat) => {
  try {
    const connection = setConnectionKey(data.username, data.receiverUsername);
    const prev = await Chat.findOne({
      connection: connection,
    }).sort({ createdAt: -1 });
    data.connection = connection;

    const received = await Chat.findOne({
      receiverUsername: data.username,
      connection: connection,
    });
    data.isFriends = received ? true : false;
    if (data.isFriends) {
      await Chat.findOneAndUpdate(
        { connection: connection },
        { isFriends: true }
      );
    }

    const unreadReceiver = await Chat.countDocuments({
      connection: connection,
      receiverUsername: data.receiverUsername,
      isRead: false,
    });
    const unreadUser = await Chat.countDocuments({
      connection: connection,
      username: data.username,
      isRead: false,
    });

    data.unreadReceiver = unreadReceiver + 1;
    data.unreadUser = unreadUser;
    data.isSent = true;

    const sendCreatedChat = (
      post: IChat,
      isFriends: boolean,
      totalUnread?: number
    ) => {
      io.emit(`createdChat${connection}`, {
        key: connection,
        data: post,
      });
      io.emit(`createdChat${data.username}`, {
        key: connection,
        data: post,
        message: data.action === "online" ? "online" : "",
        totalUnread: totalUnread,
      });
      if (isFriends) {
        io.emit(`createdChat${data.receiverUsername}`, {
          key: connection,
          data: post,
          message: data.action === "online" ? "online" : "",
          totalUnread: totalUnread,
        });
      }
    };

    if (prev) {
      const lastTime = new Date(prev.createdAt).getTime();
      const lastReceiverTime = new Date(prev.receiverTime).getTime();
      const currentTime = new Date().getTime();
      const receiverTime = new Date(currentTime - lastTime + lastReceiverTime);
      data.receiverTime = receiverTime;
      const post = await Chat.create(data);
      const totalUread = await Chat.countDocuments({
        isRead: false,
        isFriends: true,
        receiverUsername: data.receiverUsername,
      });
      sendCreatedChat(post, data.isFriends, totalUread);
    } else {
      const post = await Chat.create(data);
      sendCreatedChat(post, false);
      const newNotification = await sendNotification("friend_request", data);
      io.emit(data.receiverUsername, newNotification);
    }
  } catch (error) {
    console.log(error);
  }
};

export const searchChats = async (req: Request, res: Response) => {
  try {
    const searchTerm = String(req.query.word || "").trim();
    const connection = String(req.query.connection || "").trim();
    const username = String(req.query.username || "").trim();

    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const regex = new RegExp(searchTerm, "i");

    const result = await Chat.find({
      connection,
      deletedUsername: { $ne: username },
      $or: [
        { content: { $regex: regex } },
        { "media.name": { $regex: regex } },
      ],
    })
      .select({ _id: 1, content: 1, "media.name": 1 })
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({ results: result });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const searchFavChats = async (req: Request, res: Response) => {
  try {
    const searchTerm = String(req.query.word || "").trim();
    const connection = String(req.query.connection || "").trim();
    const username = String(req.query.username || "").trim();

    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const regex = new RegExp(searchTerm, "i");

    const result = await Chat.find({
      connection,
      deletedUsername: { $ne: username },
      isSavedUsernames: { $in: username },
      $or: [
        { content: { $regex: regex } },
        { "media.name": { $regex: regex } },
      ],
    })
      .select({ _id: 1, content: 1, "media.name": 1 })
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({ results: result });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const friendsChats = async (req: Request, res: Response) => {
  try {
    const username = String(req.query.username || "").trim();

    const result = await Chat.aggregate([
      {
        $match: {
          deletedUsername: { $ne: username },
          connection: { $regex: username },
          $or: [{ isFriends: true }, { username: username }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$connection",
          doc: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$isRead", false] },
                    { $eq: ["$receiverUsername", username] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $addFields: {
          "doc.unreadCount": "$unreadCount",
        },
      },
      {
        $replaceRoot: { newRoot: "$doc" },
      },
      {
        $project: {
          _id: 1,
          content: 1,
          createdAt: 1,
          picture: 1,
          username: 1,
          connection: 1,
          receiverPicture: 1,
          receiverId: 1,
          unread: 1,
          userId: 1,
          receiverUsername: 1,
          unreadCount: 1,
        },
      },
      {
        $limit: 10,
      },
    ]);
    const totalUnread = await Chat.countDocuments({
      isRead: false,
      isFriends: true,
      receiverUsername: username,
    });
    res.status(200).json({ results: result, totalUnread: totalUnread });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getUserChats = async (req: Request, res: Response) => {
  try {
    const username = req.query.username;
    delete req.query.username;
    const result = await queryData<IChat>(Chat, req);
    const unread = await Chat.countDocuments({
      connection: req.query.connection,
      isRead: false,
      receiverUsername: username,
    });
    res.status(200).json({
      count: result.count,
      results: result.results,
      unread: unread,
      page: result.page,
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const readChats = async (data: Receive) => {
  try {
    await Chat.updateMany(
      { _id: { $in: data.ids } },
      { $set: { isRead: true } }
    );

    const updatedChats = await Chat.find({ _id: { $in: data.ids } });
    const totalUnread = await Chat.countDocuments({
      isRead: false,
      isFriends: true,
      receiverUsername: data.username,
    });
    const totalUnread1 = await Chat.countDocuments({
      isRead: false,
      isFriends: true,
      receiverUsername: data.receiverUsername,
    });

    io.emit(`readChat${data.username}`, {
      chats: updatedChats,
      totalUnread: totalUnread,
    });
    io.emit(`readChat${data.receiverUsername}`, {
      chats: updatedChats,
      totalUnread: totalUnread1,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSaveChats = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IChat>(Chat, req);

    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const saveChats = async (req: Request, res: Response) => {
  try {
    const chats = JSON.parse(req.body.selectedItems);
    const username = req.body.username;
    const chatIds = chats.map((chat: { _id: string }) => chat._id);

    await Chat.updateMany(
      { _id: { $in: chatIds } },
      { $addToSet: { isSavedUsernames: username } }
    );
    const updatedChats = await Chat.find({ _id: { $in: chatIds } });
    res.status(200).json({
      results: updatedChats,
      message: "The chats have been saved to your favorites",
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const pinChats = async (req: Request, res: Response) => {
  try {
    const chats = JSON.parse(req.body.selectedItems);
    const userId = req.body.userId;
    const chatIds = chats.map((chat: { _id: string }) => chat._id);

    await Chat.updateMany(
      { _id: { $in: chatIds } },
      { $addToSet: { isSavedIds: userId } }
    );
    const updatedChats = await Chat.find({ _id: { $in: chatIds } });
    res.status(200).json({
      results: updatedChats,
      message: "The chats have been saved to your favorites",
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const unSaveChats = async (req: Request, res: Response) => {
  try {
    const chats = JSON.parse(req.body.selectedItems);
    const username = req.body.username;
    const chatIds = chats.map((chat: { _id: string }) => chat._id);

    await Chat.updateMany(
      { _id: { $in: chatIds } },
      { $pull: { isSavedUsernames: username } }
    );
    const updatedChats = await Chat.find({ _id: { $in: chatIds } });
    res.status(200).json({
      results: updatedChats,
      message: "The chats have been removed to your favorites",
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const addSearchedChats = async (req: Request, res: Response) => {
  try {
    const id = req.query.chatId;
    const maxDate = Number(req.query.oldest);
    const item = await Chat.findById(id);

    if (!item) {
      return res.status(400).json({ message: "Item not found in database." });
    }

    const minDate = item.time;
    const chats = await Chat.find({
      time: {
        $gte: minDate,
        $lt: maxDate,
      },
    });

    res.status(200).json({ results: chats });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

interface Delete {
  id: string;
  connection: string;
  day: string;
  senderId: string;
  receiverUsername: string;
  username: string;
  isSender: boolean;
}

export const deleteChat = async (data: Delete) => {
  try {
    if (data.isSender) {
      const item = await Chat.findById(data.id);
      if (!item) {
        return { message: "This post has been deleted" };
      }

      if (item.media.length > 0) {
        for (let i = 0; i < item.media.length; i++) {
          const el = item.media[i];
          deleteFileFromS3(el.source);
        }
      }
      await Chat.findByIdAndDelete(data.id);
      io.emit(`deleteResponse${data.receiverUsername}`, {
        id: data.id,
        day: data.day,
      });
    } else {
      await Chat.findByIdAndUpdate(data.id, { deletedUsername: data.username });
    }

    io.emit(`deleteResponse${data.username}`, {
      id: data.id,
      day: data.day,
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteChats = async (req: Request, res: Response) => {
  try {
    const chats = req.body;
    const senderUsername = req.query.senderUsername;
    for (let i = 0; i < chats.length; i++) {
      const el = chats[i];
      const isSender = el.username === senderUsername ? true : false;
      if (isSender) {
        if (el.media.length > 0) {
          for (let i = 0; i < el.media.length; i++) {
            const item = el.media[i];
            deleteFileFromS3(item.source);
          }
        }
        await Chat.findByIdAndDelete(el._id);
      } else {
        await Chat.findByIdAndUpdate(el._id, {
          deletedUsername: senderUsername,
        });
      }
    }

    const results = chats.map((item: IChat) => item._id);

    res.status(200).json({
      results,
      message: "Chats deleted successfully.",
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};
