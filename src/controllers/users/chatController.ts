import { Request, Response } from "express";
import { Chat } from "../../models/users/chatModel";
import { handleError } from "../../utils/errorHandler";
import { IChat } from "../../utils/userInterface";

const setConnectionKey = (id1: string, id2: string) => {
  const participants = [id1, id2].sort();
  return participants.join("");
};

interface Receive {
  ids: string[];
  receiverId: string;
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

export const getChats = async (req: Request, res: Response) => {
  try {
    const groupedChats = await Chat.aggregate([
      {
        $match: {
          connection: setConnectionKey(
            String(req.query.senderId),
            String(req.query.receiverId)
          ),
        },
      },
      {
        $group: {
          _id: "$day",
          chats: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          _id: 0,
          day: "$_id",
          chats: 1,
        },
      },
      {
        $sort: {
          day: 1, // or -1 for descending
        },
      },
    ]);

    res.status(200).json(groupedChats);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

interface Delete {
  id: string;
  connection: string;
  day: string;
  isSender: boolean;
}

export const deleteChat = async (data: Delete) => {
  try {
    if (data.isSender) {
      await Chat.findByIdAndDelete(data.id);
    } else {
      await Chat.findByIdAndUpdate(data.id, { isReceiverDeleted: true });
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
