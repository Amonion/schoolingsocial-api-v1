import { Request, Response } from "express";
import { Notification, UserNotification } from "../../models/team/emailModel";
import { INotification } from "../../utils/teamInterface";
import { handleError } from "../../utils/errorHandler";
import { queryData, deleteItem, updateItem } from "../../utils/query";
import { IUser } from "../../utils/userInterface";

interface Body {
  user: IUser;
  to: string;
  action: string;
  time: Date;
}

export const routeNotification = async (data: Body) => {
  switch (data.action) {
    case "verification":
      return createVerificationNotification(data);
      break;
    case "get-notifications":
      return getNotificationCounts(data);
      break;
    default:
      break;
  }
  //   createItem(req, res, Email, "Email was created successfully");
};

//-----------------NOTIFICATION--------------------//
export const createVerificationNotification = async (item: Body) => {
  const noteTemp = await Notification.findOne({ name: item.action });
  await UserNotification.create({
    userId: item.user._id,
    username: item.user.username,
    name: noteTemp?.name,
    content: noteTemp?.content,
    greetings: noteTemp?.greetings,
    title: noteTemp?.title,
    createdAt: item.time,
  });

  return getNotificationCounts(item);
};

export const getNotificationCounts = async (item: Body) => {
  const count = await UserNotification.countDocuments({
    username: item.user.username,
    unread: true,
  });

  return { count };
};

export const getNotificationById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Notification.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const result = await queryData<INotification>(Notification, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateNotification = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Notification,
      [],
      ["Notification not found", "Notification was updated successfully"]
    );
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  await deleteItem(req, res, Notification, [], "Notification not found");
};
