import { Request, Response } from "express";
import { IStaff } from "../../utils/teamInterface";
import { User } from "../../models/users/userModel";
import { Staff } from "../../models/team/staffModel";
import { handleError } from "../../utils/errorHandler";
import { queryData } from "../../utils/query";

export const getStaffById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    res.status(200).json(staff);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getStaffs = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IStaff>(Staff, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateStaff = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    if (req.body.isUser) {
      const user = await User.findOne({ _id: staff.userId });
      await User.findByIdAndUpdate(user?._id, req.body);
    }
    const respond = req.query.return;
    if (respond === "many") {
      const result = await queryData<IStaff>(Staff, req);
      const { page, page_size, count, results } = result;
      res.status(200).json({
        message: "Staff was updated successfully",
        results,
        count,
        page,
        page_size,
      });
    } else {
      res
        .status(200)
        .json({ message: "User was updated successfully", data: staff });
    }
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};
