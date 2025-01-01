import { Request, Response } from "express";
import { Email } from "../../models/team/emailModel";
import { IEmail } from "../../utils/teamInterface";
import { handleError } from "../../utils/errorHandler";
import { queryData } from "../../utils/query";
import { uploadFilesToS3 } from "../../utils/fileUpload"; // Adjust path to where the function is defined

export const createEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const uploadedFiles = await uploadFilesToS3(req);
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url;
    });
    await Email.create(req.body);
    const item = await queryData<IEmail>(Email, req);
    const { page, page_size, count, results } = item;
    res.status(200).json({
      message: "Email was created successfully",
      results,
      count,
      page,
      page_size,
    });
  } catch (error: any) {
    handleError(res, undefined, undefined, error);
  }
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
