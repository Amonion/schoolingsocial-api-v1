import { Request, Response } from "express";
import { IUser } from "../../utils/userInterface";
import { User } from "../../models/users/userModel";
import { Staff } from "../../models/team/staffModel";
import { handleError } from "../../utils/errorHandler";
import { queryData } from "../../utils/query";
import bcrypt from "bcryptjs";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, phone, signupIp, password } = req.body;
    const newUser = new User({
      email,
      phone,
      signupIp,
      password: await bcrypt.hash(password, 10),
    });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error: any) {
    handleError(res, undefined, undefined, error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IUser>(User, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (req.body.isStaff) {
      const staff = await Staff.findOne({ userId: req.params.id });
      if (staff) {
        await Staff.findOneAndUpdate({ userId: req.body.id }, req.body);
      } else {
        await Staff.create(req.body);
      }
    }
    const result = await queryData<IUser>(User, req);
    const { page, page_size, count, results } = result;
    res.status(200).json({
      message: "User was updated successfully",
      results,
      count,
      page,
      page_size,
    });
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
