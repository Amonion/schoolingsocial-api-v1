import { Request, Response } from "express";
import { User } from "../models/users/userModel";
import bcrypt from "bcryptjs";

export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, username, phone, password } = req.body;
    const newUser = new User({
      email,
      username,
      phone,
      password: await bcrypt.hash(password, 10),
    });
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error: any) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const value = error.keyValue[field];
      res.status(400).json({
        message: `A user with the ${field} "${value}" already exists`,
      });
    } else if (error.errors) {
      const validationMessages = Object.values(error.errors).map(
        (err: any) => err.message
      );
      res.status(400).json({ message: validationMessages.join(", ") });
    } else {
      res.status(500).json({ message: "Server error", error });
    }
  }
};

// Fetch a single record
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
    res.status(500).json({ message: "Server error", error });
  }
};

// Fetch multiple records
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
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
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a record
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
