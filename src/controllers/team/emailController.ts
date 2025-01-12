import { Request, Response } from "express";
import { Email, Notification, Sms } from "../../models/team/emailModel";
import { IEmail, INotification, ISms } from "../../utils/teamInterface";
import { handleError } from "../../utils/errorHandler";
import {
  queryData,
  deleteItem,
  updateItem,
  createItem,
} from "../../utils/query";

export const createEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Email, "Email was created successfully");
};

export const getEmailById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }
    res.status(200).json(email);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getEmails = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IEmail>(Email, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateEmail = async (req: Request, res: Response) => {
  try {
    const email = await Email.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }

    const item = await queryData<IEmail>(Email, req);
    const { page, page_size, count, results } = item;
    res.status(200).json({
      message: "Email was updated successfully",
      results,
      count,
      page,
      page_size,
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deleteEmail = async (req: Request, res: Response) => {
  try {
    const email = await Email.findByIdAndDelete(req.params.id);
    if (!email) {
      return res.status(404).json({ message: "Email not found" });
    }
    res.status(200).json({ message: "Email deleted successfully" });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

//-----------------NOTIFICATION--------------------//
export const createNotification = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Notification, "Notification was created successfully");
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

//-----------------SMS--------------------//
export const createSms = async (req: Request, res: Response): Promise<void> => {
  createItem(req, res, Sms, "Sms was created successfully");
};

export const getSmsById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Sms.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Sms not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getSms = async (req: Request, res: Response) => {
  try {
    const result = await queryData<ISms>(Sms, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateSms = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Sms,
      [],
      ["Sms not found", "Sms was updated successfully"]
    );
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deleteSms = async (req: Request, res: Response) => {
  await deleteItem(req, res, Sms, [], "Sms not found");
};
