import { Request, Response } from "express";
import { AcademicLevel } from "../../models/team/academicLevelModel";
import { Document } from "../../models/team/documentModel";
import { IAcademicLevel } from "../../utils/teamInterface";
import { IDocument } from "../../utils/teamInterface";
import { handleError } from "../../utils/errorHandler";
import {
  queryData,
  deleteItem,
  createItem,
  updateItem,
} from "../../utils/query";
import { uploadFilesToS3 } from "../../utils/fileUpload";

export const createAcademicLevel = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(
    req,
    res,
    AcademicLevel,
    "Academic Level was created successfully"
  );
};

export const updateAcademicLevel = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      AcademicLevel,
      ["logo"],
      ["Academic Level not found", "Academic Level was updated successfully"]
    );
  } catch (error) {
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

export const deleteAcademicLevel = async (req: Request, res: Response) => {
  await deleteItem(
    req,
    res,
    AcademicLevel,
    ["logo"],
    "AcademicLevel not found"
  );
};

//-----------------DOCUMENT--------------------//
export const createDocument = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Document, "Document was created successfully");
};

export const updateDocument = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Document,
      [],
      ["Document  not found", "Document was updated successfully"]
    );
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getDocuments = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IDocument>(Document, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getDocumentById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Document.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Document not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  await deleteItem(req, res, Document, [], "Document not found");
};
