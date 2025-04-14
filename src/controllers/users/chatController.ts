import { Request, Response } from "express";
import { Chat } from "../../models/users/chatModel";
import { handleError } from "../../utils/errorHandler";
import { IChat } from "../../utils/userInterface";
import { queryData } from "../../utils/query";
import { deleteFileFromS3 } from "../../utils/fileUpload";

const setConnectionKey = (id1: string, id2: string) => {
  const participants = [id1, id2].sort();
  return participants.join("");
};

interface Receive {
  ids: string[];
  receiverId: string;
  userId: string;
  connection: string;
}

export const confirmChats = async (data: Receive) => {
  try {
    await Chat.updateMany(
      { _id: { $in: data.ids } },
      { $set: { received: true } }
    );

    const updatedChats = await Chat.find({ _id: { $in: data.ids } });
    return {
      key: updatedChats[0].connection,
      data: updatedChats,
      receiverId: data.receiverId,
      userId: data.userId,
    };
  } catch (error) {
    console.log(error);
  }
};

export const createChat = async (data: IChat) => {
  try {
    const connection = setConnectionKey(data.userId, data.receiverId);
    const prev = await Chat.findOne({
      connection: connection,
    }).sort({ createdAt: -1 });
    data.connection = connection;

    const received = await Chat.findOne({ receiverId: data.userId });
    data.isFriends = received ? true : false;

    const unread = await Chat.countDocuments({
      connection: connection,
      isReadIds: { $nin: [data.userId] },
    });

    data.unread = unread;

    if (prev) {
      const lastTime = new Date(prev.createdAt).getTime();
      const lastReceiverTime = new Date(prev.receiverTime).getTime();
      const currentTime = new Date().getTime();
      const receiverTime = new Date(currentTime - lastTime + lastReceiverTime);
      data.receiverTime = receiverTime;
      const post = await Chat.create(data);
      return {
        key: connection,
        data: post,
      };
    } else {
      const post = await Chat.create(data);
      return {
        key: connection,
        data: post,
      };
    }
  } catch (error) {
    console.log(error);
  }
};

export const searchChats = async (req: Request, res: Response) => {
  try {
    const searchTerm = String(req.query.word || "").trim();
    const connection = String(req.query.connection || "").trim();
    const userId = String(req.query.userId || "").trim();

    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const regex = new RegExp(searchTerm, "i");

    const result = await Chat.find({
      connection,
      deletedId: { $ne: userId },
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
    const userId = String(req.query.userId || "").trim();

    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const regex = new RegExp(searchTerm, "i");

    const result = await Chat.find({
      connection,
      deletedId: { $ne: userId },
      isSavedIds: { $in: userId },
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
    const id = String(req.query.id || "").trim();

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const result = await Chat.aggregate([
      {
        $match: {
          deletedId: { $ne: id },
          connection: { $regex: id },
          isFriends: true,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: "$connection",
          doc: { $first: "$$ROOT" },
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
          receiverPicture: 1,
          receiverId: 1,
          unread: 1,
          userId: 1,
          receiverUsername: 1,
        },
      },
      {
        $limit: 10, // Limit to 10 unique conversations
      },
    ]);

    res.status(200).json({ results: result });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getUserChats = async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId;
    delete req.query.userId;
    const result = await queryData<IChat>(Chat, req);
    const unread = await Chat.countDocuments({
      connection: req.query.connection,
      isReadIds: { $nin: [userId] },
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
    const ids = data.ids;
    const userId = data.userId;
    const connection = data.connection;
    await Chat.updateMany(
      { _id: { $in: ids } },
      { $addToSet: { isReadIds: userId } }
    );
    const updatedChats = await Chat.find({ _id: { $in: ids } });
    return {
      key: connection,
      chats: updatedChats,
    };
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
    const userId = req.body.userId;
    const chatIds = chats.map((chat: { _id: string }) => chat._id);

    await Chat.updateMany(
      { _id: { $in: chatIds } },
      { $pull: { isSavedIds: userId } }
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
    } else {
      await Chat.findByIdAndUpdate(data.id, { deletedId: data.senderId });
    }

    const chat = await Chat.findById(data.id);

    return {
      id: data.id,
      key: data.connection,
      day: data.day,
      chat: chat,
    };
  } catch (error) {
    console.log(error);
  }
};

export const deleteChats = async (req: Request, res: Response) => {
  try {
    const chats = req.body;
    const senderId = req.query.senderId;
    for (let i = 0; i < chats.length; i++) {
      const el = chats[i];
      const isSender = el.userId === senderId ? true : false;
      if (isSender) {
        if (el.media.length > 0) {
          for (let i = 0; i < el.media.length; i++) {
            const item = el.media[i];
            deleteFileFromS3(item.source);
          }
        }
        await Chat.findByIdAndDelete(el._id);
      } else {
        await Chat.findByIdAndUpdate(el._id, { deletedId: senderId });
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
