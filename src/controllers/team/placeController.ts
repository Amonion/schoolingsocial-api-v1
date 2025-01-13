import { Request, Response } from "express";
import { Place, Ad } from "../../models/team/placeModel";
import { IPlace, IAd } from "../../utils/teamInterface";
import { handleError } from "../../utils/errorHandler";
import {
  queryData,
  deleteItem,
  deleteItems,
  createItem,
  updateItem,
} from "../../utils/query";
import { uploadFilesToS3 } from "../../utils/fileUpload"; // Adjust path to where the function is defined

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

//--------------------PLACE-----------------------//
export const createPlace = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const body = await handleUpload(req, res);
    if (!body) {
      return;
    } else {
      await Place.create(body);
      const result = await queryData<IPlace>(Place, req);
      const { page, page_size, count, results } = result;
      res.status(200).json({
        message: "Place is created successfully",
        results,
        count,
        page,
        page_size,
      });
    }
  } catch (error: any) {
    handleError(res, undefined, undefined, error);
  }
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

export const updatePlace = async (req: Request, res: Response) => {
  try {
    const body = await handleUpload(req, res);
    if (!body) {
      return;
    } else {
      const result = await Place.findByIdAndUpdate(req.params.id, body, {
        new: true,
        runValidators: true,
      });
      if (!result) {
        return res.status(404).json({ message: "Place not found" });
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
    }
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
    const field = req.query.field;

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

const handleUpload = async (req: Request, res: Response) => {
  try {
    if (!req.body.country) {
      handleError(res, 400, `Error, no country submitted.`, "");
      return null;
    }
    if (req.files?.length || req.file) {
      const existingPlace = await Place.findOne({
        country: req.body.country,
        $and: [{ countryFlag: { $ne: null } }, { countryFlag: { $ne: "" } }],
      });

      if (existingPlace) {
        if (
          !existingPlace.countryCode ||
          !existingPlace.currency ||
          !existingPlace.currencySymbol ||
          !existingPlace.countrySymbol
        ) {
          handleError(
            res,
            400,
            `Please edit ${existingPlace.country} and fill in all fields to continue.`,
            ""
          );
          return null;
        } else {
          req.body.countryFlag = existingPlace.countryFlag;
          return req.body;
        }
      } else {
        const uploadedFiles = await uploadFilesToS3(req);
        uploadedFiles.forEach((file) => {
          req.body[file.fieldName] = file.s3Url;
        });
        return req.body;
      }
    } else {
      const existingPlace = await Place.findOne({
        country: req.body.country,
        $and: [{ countryFlag: { $ne: null } }, { countryFlag: { $ne: "" } }],
      });
      if (existingPlace) {
        if (
          (!existingPlace.countryCode ||
            !existingPlace.currency ||
            !existingPlace.currencySymbol ||
            !existingPlace.countrySymbol) &&
          (!req.body.countryCode ||
            !req.body.currency ||
            !req.body.currencySymbol ||
            !req.body.countrySymbol)
        ) {
          handleError(
            res,
            400,
            `Please edit ${existingPlace.country} and fill in all fields to continue.`,
            ""
          );
          return null;
        } else {
          req.body.countryFlag = existingPlace.countryFlag;
          return req.body;
        }
      } else {
        console.log(`Dont Exist`);
        handleError(res, 400, `Error, please submit all necessary fields.`, "");
        return null;
      }
    }
  } catch (error) {
    handleError(res, undefined, undefined, error);
    return null;
  }
};
