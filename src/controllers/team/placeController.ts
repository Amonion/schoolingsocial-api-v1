import { Request, Response } from "express";
import { AcademicLevel } from "../../models/team/academicLevelModel";
import { Place, Ad, Bank, Document } from "../../models/team/placeModel";
import { Payment } from "../../models/team/paymentModel";
import { IPlace, IAd, IBank } from "../../utils/teamInterface";
import { IAcademicLevel } from "../../utils/teamInterface";
import { IDocument } from "../../utils/teamInterface";
import { handleError } from "../../utils/errorHandler";
import {
  queryData,
  deleteItem,
  deleteItems,
  createItem,
  updateItem,
  getItemById,
  getItems,
} from "../../utils/query";
import { uploadFilesToS3 } from "../../utils/fileUpload";

//--------------------PAYMENTS-----------------------//
export const createPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Payment, "Payments was created successfully");
};

export const getPaymentById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  getItemById(req, res, Payment, "Payment was not found");
};

export const getPayments = async (req: Request, res: Response) => {
  getItems(req, res, Payment);
};

export const updatePayment = async (req: Request, res: Response) => {
  updateItem(
    req,
    res,
    Payment,
    ["logo"],
    ["Payment not found", "Payment was updated successfully"]
  );
};

export const deletePayment = async (req: Request, res: Response) => {
  await deleteItem(req, res, Payment, ["logo"], "Payment not found");
};

//--------------------ADS-----------------------//
export const createAd = async (req: Request, res: Response): Promise<void> => {
  createItem(req, res, Ad, "Ads was created successfully");
};

export const getAdById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const result = await Ad.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Ad not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getAds = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IAd>(Ad, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateAd = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Ad,
      ["picture"],
      ["Ad not found", "Ad was updated successfully"]
    );
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deleteAd = async (req: Request, res: Response) => {
  await deleteItems(req, res, Place, ["countryFlag"], "Place not found");
};

//-----------------ACADEMIC LEVEL--------------------//
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

//-----------------BANK--------------------//
export const createBank = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Bank, "Bank was created successfully");
};

export const updateBank = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Bank,
      [],
      ["Bank  not found", "Bank was updated successfully"]
    );
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getBanks = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IBank>(Bank, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getBankById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Bank.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Bank not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deleteBank = async (req: Request, res: Response) => {
  await deleteItem(req, res, Bank, [], "Bank not found");
};

//--------------------PLACE-----------------------//
export const createPlace = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Place, "Country was created successfully");
};

export const getPlaceById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const result = await Place.findById(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getPlaces = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IPlace>(Place, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getAllPlaces = async (req: Request, res: Response) => {
  try {
    const result = await Place.aggregate([
      {
        $match: {
          $or: [
            { area: { $regex: req.query.place, $options: "i" } },
            { state: { $regex: req.query.place, $options: "i" } },
            { country: { $regex: req.query.place, $options: "i" } },
          ],
        },
      },
      {
        $group: {
          _id: "$area", // Group by area
          doc: { $first: "$$ROOT" }, // Keep first document per area
        },
      },
      {
        $replaceRoot: { newRoot: "$doc" }, // Flatten result
      },
    ]);

    res.status(200).json({ results: result });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updatePlace = async (req: Request, res: Response) => {
  try {
    if (req.files?.length || req.file) {
      const uploadedFiles = await uploadFilesToS3(req);
      uploadedFiles.forEach((file) => {
        req.body[file.fieldName] = file.s3Url;
      });
    }

    const place = await Place.findById(req.params.id);
    const source = req.body.source;

    if (source === "Country") {
      if (place?.country === req.body.country) {
        await Place.updateMany({ country: req.body.country }, req.body);
      } else {
        await Place.updateMany({ country: place?.country }, { $set: req.body });
      }
    } else if (source === "State") {
      if (place?.state === req.body.state) {
        await Place.updateMany({ state: req.body.state }, req.body);
      } else {
        await Place.updateMany({ state: place?.state }, { $set: req.body });
      }
    } else if (source === "Area") {
      if (place?.area === req.body.area) {
        await Place.updateMany({ area: req.body.area }, req.body);
      } else {
        await Place.updateMany({ area: place?.area }, { $set: req.body });
      }
    }

    const item = await queryData<IPlace>(Place, req);
    const { page, page_size, count, results } = item;
    res.status(200).json({
      message: "Place was updated successfully",
      results,
      count,
      page,
      page_size,
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deletePlace = async (req: Request, res: Response) => {
  const result = await Place.findById(req.params.id);
  const existingPlaces = await Place.find({
    country: result?.country,
    $and: [{ countryFlag: { $ne: null } }, { countryFlag: { $ne: "" } }],
  });
  if (existingPlaces.length > 1) {
    await deleteItem(req, res, Place, [], "Place not found");
  } else {
    await deleteItem(req, res, Place, ["countryFlag"], "Place not found");
  }
};

export const deletePlaces = async (req: Request, res: Response) => {
  await deleteItems(req, res, Place, ["countryFlag"], "Place not found");
};

export const searchPlace = async (req: Request, res: Response) => {
  try {
    const places = await Place.aggregate([
      {
        $group: {
          _id: "$country",
        },
      },
    ]);
    res.status(200).json({
      results: places,
    });
  } catch (error) {
    console.error("Error fetching unique places:", error);
    throw error;
  }
};

export const searchPlaces = async (req: Request, res: Response) => {
  try {
    const country = req.query.country;
    const places = await Place.aggregate([
      {
        $match: {
          country: { $regex: country, $options: "i" },
        },
      },
      {
        $group: {
          _id: "$country",
          countryFlag: { $first: "$countryFlag" },
          continent: { $first: "$continent" },
          countryCode: { $first: "$countryCode" },
          currency: { $first: "$currency" },
          currencySymbol: { $first: "$currencySymbol" },
          countrySymbol: { $first: "$countrySymbol" },
          state: { $first: "$state" },
          area: { $first: "$area" },
          id: { $first: "$_id" },
        },
      },
      {
        $project: {
          _id: 0,
          country: "$_id",
          countryFlag: 1,
          continent: 1,
          currency: 1,
          currencySymbol: 1,
          countrySymbol: 1,
          state: 1,
          area: 1,
          id: 1,
        },
      },
      { $limit: 10 },
    ]);

    res.status(200).json({
      results: places,
    });
  } catch (error) {
    console.error("Error fetching unique places:", error);
    throw error;
  }
};

export const getUniquePlaces = async (req: Request, res: Response) => {
  try {
    const field = String(req.query.field);
    const limit = parseInt(req.query.page_size as string) || 10;

    const page = parseInt(req.query.page as string) || 1;
    const sortBy = (req.query.sort as string) || "country";
    const order = (req.query.order as string) === "asc" ? -1 : 1;

    const skipValue = (page - 1) * limit;

    const country = req.query.country;
    const state = req.query.state;
    const area = req.query.area;

    const filters: Record<string, any> = {};

    if (country) {
      filters.country = { $regex: country, $options: "i" };
    }
    if (state) {
      filters.state = { $regex: state, $options: "i" };
    }
    if (area) {
      filters.area = { $regex: area, $options: "i" };
    }

    const matchStage =
      Object.keys(filters).length > 0 ? { $match: filters } : null;

    const aggregationPipeline: any[] = [];
    if (matchStage) aggregationPipeline.push(matchStage);

    aggregationPipeline.push(
      {
        $group: {
          _id: `$${field}`,
          countryFlag: { $first: "$countryFlag" },
          continent: { $first: "$continent" },
          country: { $first: "$country" },
          countryCode: { $first: "$countryCode" },
          currency: { $first: "$currency" },
          currencySymbol: { $first: "$currencySymbol" },
          countrySymbol: { $first: "$countrySymbol" },
          state: { $first: "$state" },
          stateCapital: { $first: "$stateCapital" },
          stateLogo: { $first: "$stateLogo" },
          area: { $first: "$area" },
          zipCode: { $first: "$zipCode" },
          id: { $first: "$_id" },
        },
      },
      {
        $project: {
          _id: 0,
          [field]: "$_id",
          countryFlag: 1,
          continent: 1,
          countryCode: 1,
          country: 1,
          currency: 1,
          currencySymbol: 1,
          countrySymbol: 1,
          state: 1,
          stateCapital: 1,
          stateLogo: 1,
          area: 1,
          zipCode: 1,
          id: 1,
        },
      },
      { $sort: { [sortBy]: order } },
      { $skip: skipValue },
      { $limit: limit }
    );

    const countPipeline = [...aggregationPipeline].filter(
      (stage) => !("$limit" in stage || "$skip" in stage)
    );

    countPipeline.push({ $count: "totalCount" });
    const [places, totalCountResult] = await Promise.all([
      Place.aggregate(aggregationPipeline),
      Place.aggregate(countPipeline),
    ]);

    const totalCount = totalCountResult.length
      ? totalCountResult[0].totalCount
      : 0;

    res.status(200).json({
      message: "Places fetched successfully",
      results: places,
      count: totalCount,
      page_size: limit,
    });
  } catch (error) {
    console.error("Error fetching unique places:", error);
    throw error;
  }
};
