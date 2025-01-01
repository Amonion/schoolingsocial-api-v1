import { Request, Response } from "express";
import { Payment } from "../../models/team/paymentModel";
import { IPayment } from "../../utils/teamInterface";
import { handleError } from "../../utils/errorHandler";
import { queryData } from "../../utils/query";
import { uploadFilesToS3 } from "../../utils/fileUpload"; // Adjust path to where the function is defined

export const createPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const uploadedFiles = await uploadFilesToS3(req);
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url;
    });
    const newPayment = await Payment.create(req.body);
    res.status(201).json({
      message: "Payment created successfully",
      data: newPayment,
    });
  } catch (error: any) {
    handleError(res, undefined, undefined, error);
  }
};

export const getPaymentById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Payment.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getPayments = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IPayment>(Payment, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updatePayment = async (req: Request, res: Response) => {
  try {
    const result = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!result) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(201).json({
      message: "Payment was updated successfully",
      data: result,
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deletePayment = async (req: Request, res: Response) => {
  try {
    const result = await Payment.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};
