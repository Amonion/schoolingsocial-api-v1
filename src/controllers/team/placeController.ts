import { Request, Response } from "express";
import { Place } from "../../models/team/placeModel";
import { IPlace } from "../../utils/teamInterface";
import { handleError } from "../../utils/errorHandler";
import { queryData } from "../../utils/query";

export const createPlace = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { ...fields } = req.body;
    const newPlace = new Place({
      ...fields,
    });
    await newPlace.save();

    res.status(201).json({
      message: "Place created successfully",
      data: newPlace,
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
    const place = await Place.findById(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.status(200).json(place);
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
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.status(200).json(place);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deletePlace = async (req: Request, res: Response) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) {
      return res.status(404).json({ message: "Place not found" });
    }
    res.status(200).json({ message: "Place deleted successfully" });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};
