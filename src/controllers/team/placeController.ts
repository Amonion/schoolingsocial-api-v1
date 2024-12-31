import { Request, Response } from "express";
import { User } from "../../models/users/userModel";
import { handleError } from "../../utils/errorHandler";
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
    handleError(error, res);
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
    handleError(error, res);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    handleError(error, res);
  }
};

// Update a record
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    handleError(error, res);
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
    handleError(error, res);
  }
};
