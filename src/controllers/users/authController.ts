import { Request, Response } from "express";
import { User } from "../../models/users/userModel";
import { handleError } from "../../utils/errorHandler";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const JWT_SECRET = "your_jwt_secret_key";

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.password) {
      res.status(400).json({ message: "Password not set for user" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email }, // Payload (user's ID and email)
      JWT_SECRET, // Secret key for signing the token
      { expiresIn: "30d" } // Token expiration time (1 hour in this case)
    );

    res.status(200).json({
      message: "Login successful",
      user: {
        email: user.email,
        username: user.username,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    handleError(error, res);
  }
};
