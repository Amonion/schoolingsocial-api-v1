import { Request, Response } from "express";
import { Place } from "../../models/team/placeModel";
import { IPlace } from "../../utils/teamInterface";
import { handleError } from "../../utils/errorHandler";
import { queryData } from "../../utils/query";
import { uploadFilesToS3, deleteFilesFromS3 } from "../../utils/fileUpload"; // Adjust path to where the function is defined

export const createPlace = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // const existingPlace = await Place.findOne({
    //   country: req.body.country,
    //   $and: [{ countryFlag: { $ne: null } }, { countryFlag: { $ne: "" } }],
    // });
    // if (existingPlace) {
    //   if (
    //     !existingPlace.countryCode ||
    //     !existingPlace.currency ||
    //     !existingPlace.currencySymbol ||
    //     existingPlace.countrySymbol
    //   ) {
    //     handleError(
    //       res,
    //       500,
    //       `Please fill in all fields for ${existingPlace.country}`,
    //       ""
    //     );
    //   }
    //   req.body.countryFlag = existingPlace.countryFlag;
    // } else {
    //   const uploadedFiles = await uploadFilesToS3(req);
    //   uploadedFiles.forEach((file) => {
    //     req.body[file.fieldName] = file.s3Url;
    //   });
    // }
    const uploadedFiles = await uploadFilesToS3(req);
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url;
    });

    await Place.create(req.body);
    const result = await queryData<IPlace>(Place, req);
    const { page, page_size, count, results } = result;
    res.status(200).json({
      message: "Place is created successfully",
      results,
      count,
      page,
      page_size,
    });
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
    const result = await Place.findByIdAndUpdate(req.params.id, req.body, {
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
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deletePlace = async (req: Request, res: Response) => {
  try {
    const result = await Place.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Place not found" });
    }
    const s3Fields = ["countryFlag"];
    await deleteFilesFromS3(Place, s3Fields);

    res.status(200).json({ message: "Place deleted successfully" });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const searchPlace = async (req: Request, res: Response) => {
  try {
    const field = req.query.field;
    const places = await Place.aggregate([
      {
        $group: {
          _id: field ? `$${field}` : "$country",
          place: { $first: "$$ROOT" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $limit: 10,
      },
      {
        $replaceRoot: { newRoot: "$place" },
      },
    ]);

    console.log("Unique Places:", places);
    return places;
  } catch (error) {
    console.error("Error fetching unique places:", error);
    throw error;
  }
};
