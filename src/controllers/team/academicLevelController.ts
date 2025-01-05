import { Request, Response } from "express";
import { AcademicLevel } from "../../models/team/academicLevelModel";
import { IAcademicLevel } from "../../utils/teamInterface";
import { handleError } from "../../utils/errorHandler";
import { queryData, deleteItem } from "../../utils/query";
import { uploadFilesToS3 } from "../../utils/fileUpload"; // Adjust path to where the function is defined

export const createAcademicLevel = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const uploadedFiles = await uploadFilesToS3(req);
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url;
    });
    await AcademicLevel.create(req.body);
    const item = await queryData<IAcademicLevel>(AcademicLevel, req);
    const { page, page_size, count, results } = item;
    res.status(200).json({
      message: "Payment was updated successfully",
      results,
      count,
      page,
      page_size,
    });
  } catch (error: any) {
    handleError(res, undefined, undefined, error);
  }
};

export const getAcademicLevelById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await AcademicLevel.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "AcademicLevel not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getAcademicLevels = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IAcademicLevel>(AcademicLevel, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateAcademicLevel = async (req: Request, res: Response) => {
  try {
    if (req.files?.length || req.file) {
      const uploadedFiles = await uploadFilesToS3(req);
      uploadedFiles.forEach((file) => {
        req.body[file.fieldName] = file.s3Url;
      });
      await deleteItem(
        req,
        res,
        AcademicLevel,
        ["logo"],
        "AcademicLevel not found"
      );
    }
    const result = await AcademicLevel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!result) {
      return res.status(404).json({ message: "AcademicLevel not found" });
    }

    const item = await queryData<IAcademicLevel>(AcademicLevel, req);
    const { page, page_size, count, results } = item;
    res.status(200).json({
      message: "AcademicLevel was updated successfully",
      results,
      count,
      page,
      page_size,
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deleteAcademicLevel = async (req: Request, res: Response) => {
  await deleteItem(
    req,
    res,
    AcademicLevel,
    ["logo"],
    "AcademicLevel not found"
  );
};
