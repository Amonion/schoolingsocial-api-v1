import { Request, Response } from "express";
import User, { IUsers } from "../models/userModel";

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users: IUsers[] = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};
