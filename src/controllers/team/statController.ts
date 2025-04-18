import { Request, Response } from "express";
import { UserStat } from "../../models/users/usersStatMode";
import { io } from "../../app";
import { IUserData } from "../../utils/teamInterface";
import { User } from "../../models/users/userModel";
import { Chat } from "../../models/users/chatModel";
import { handleError } from "../../utils/errorHandler";
import { startOfMonth, subMonths } from "date-fns";

export const updateVisit = async (data: IUserData) => {
  const visitor = await UserStat.findOne({
    $or: [
      { _id: data.userId, online: true },
      { ip: data.ip, online: true },
    ],
  });

  if (!visitor) {
    await UserStat.findOneAndUpdate(
      {
        $or: [{ _id: data.userId }, { username: data.username }],
      },
      {
        $set: {
          visitedAt: new Date(),
          online: true,
          ip: data.ip,
          country: data.country,
          countryCode: data.countryCode,
          username: data.username,
          bioId: data.bioId,
          userId: data.userId,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );
    if (data.userId) {
      await User.findByIdAndUpdate(data.userId, {
        visitedAt: data.visitedAt,
        online: true,
      });
      const chats = await Chat.find({
        connection: { $regex: data.userId },
      });

      for (let i = 0; i < chats.length; i++) {
        const el = chats[i];
        io.emit(el.connection, { action: "visit" });
      }
    }
    io.emit("team", { action: "visit", type: "stat" });
  }
};

export const getUsersStat = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));

    const onlineUsers = await UserStat.countDocuments({ online: true });
    const verifyingUsers = await User.countDocuments({
      isOnVerification: true,
    });
    const totalUsers = await User.countDocuments();
    const thisMonthOnline = await UserStat.countDocuments({
      online: true,
      createdAt: { $gte: currentMonthStart },
    });
    const thisMonthOnVerification = await User.countDocuments({
      isOnVerification: true,
      verifyingAt: { $gte: currentMonthStart },
    });
    const thisMonthUsers = await User.countDocuments({
      createdAt: { $gte: currentMonthStart },
    });

    const lastMonthOnline = await UserStat.countDocuments({
      online: true,
      createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
    });
    const lastMonthOnVerification = await User.countDocuments({
      isOnVerification: true,
      verifyingAt: { $gte: lastMonthStart, $lt: currentMonthStart },
    });
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
    });

    let onlineIncrease = 0;
    if (lastMonthOnline > 0) {
      onlineIncrease =
        ((thisMonthOnline - lastMonthOnline) / lastMonthOnline) * 100;
    } else if (thisMonthOnline > 0) {
      onlineIncrease = 100;
    }

    let verificationIncrease = 0;
    if (lastMonthOnVerification > 0) {
      verificationIncrease =
        ((thisMonthOnVerification - lastMonthOnVerification) /
          lastMonthOnVerification) *
        100;
    } else if (thisMonthOnVerification > 0) {
      verificationIncrease = 100;
    }

    let totalUsersIncrease = 0;
    if (lastMonthUsers > 0) {
      totalUsersIncrease =
        ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100;
    } else if (thisMonthUsers > 0) {
      totalUsersIncrease = 100;
    }

    res.status(200).json({
      onlineUsers,
      onlineIncrease,
      verifyingUsers,
      verificationIncrease,
      totalUsers,
      totalUsersIncrease,
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};
