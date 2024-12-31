import { Response } from "express";

export const handleError = (error: any, res: Response) => {
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0]; // Extracting the field name causing the error
    const value = error.keyValue[field]; // Extracting the duplicate value
    return res.status(400).json({
      message: `A user with the ${field} "${value}" already exists`,
    });
  } else if (error.errors) {
    const validationMessages = Object.values(error.errors).map(
      (err: any) => err.message
    );
    return res.status(400).json({
      message: validationMessages.join(", "),
    });
  } else {
    return res.status(500).json({
      message: error.message || "Server error. Please try again later.",
      error: error.message || error,
    });
  }
};
