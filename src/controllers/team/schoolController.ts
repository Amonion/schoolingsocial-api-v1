import { Request, Response } from "express";
import { School } from "../../models/team/schoolModel";
import { ISchool } from "../../utils/teamInterface";
import { handleError } from "../../utils/errorHandler";
import { queryData, deleteItem } from "../../utils/query";
import { uploadFilesToS3 } from "../../utils/fileUpload"; // Adjust path to where the function is defined

export const createSchool = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const uploadedFiles = await uploadFilesToS3(req);
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url;
    });
    await School.create(req.body);
    const item = await queryData<ISchool>(School, req);
    const { page, page_size, count, results } = item;
    res.status(200).json({
      message: "School was updated successfully",
      results,
      count,
      page,
      page_size,
    });
  } catch (error: any) {
    handleError(res, undefined, undefined, error);
  }
};

export const getSchoolById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await School.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "School not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getSchools = async (req: Request, res: Response) => {
  try {
    const result = await queryData<ISchool>(School, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateSchool = async (req: Request, res: Response) => {
  try {
    if (req.files?.length || req.file) {
      const uploadedFiles = await uploadFilesToS3(req);
      uploadedFiles.forEach((file) => {
        req.body[file.fieldName] = file.s3Url;
      });
      await deleteItem(
        req,
        res,
        School,
        ["logo", "media", "picture"],
        "School not found"
      );
    }
    const result = await School.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!result) {
      return res.status(404).json({ message: "School not found" });
    }

    const item = await queryData<ISchool>(School, req);
    const { page, page_size, count, results } = item;
    res.status(200).json({
      message: "School was updated successfully",
      results,
      count,
      page,
      page_size,
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deleteSchool = async (req: Request, res: Response) => {
  await deleteItem(
    req,
    res,
    School,
    ["logo", "media", "picture"],
    "School not found"
  );
};

//-----------------PAYMENT--------------------//
export const createSchoolPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const uploadedFiles = await uploadFilesToS3(req);
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url;
    });
    await School.create(req.body);
    const item = await queryData<ISchool>(School, req);
    const { page, page_size, count, results } = item;
    res.status(200).json({
      message: "School was updated successfully",
      results,
      count,
      page,
      page_size,
    });
  } catch (error: any) {
    handleError(res, undefined, undefined, error);
  }
};

export const getSchoolPaymentById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await School.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "School not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getSchoolPayments = async (req: Request, res: Response) => {
  try {
    const result = await queryData<ISchool>(School, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateSchoolPayment = async (req: Request, res: Response) => {
  try {
    if (req.files?.length || req.file) {
      const uploadedFiles = await uploadFilesToS3(req);
      uploadedFiles.forEach((file) => {
        req.body[file.fieldName] = file.s3Url;
      });
      await deleteItem(
        req,
        res,
        School,
        ["logo", "media", "picture"],
        "School not found"
      );
    }
    const result = await School.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!result) {
      return res.status(404).json({ message: "School not found" });
    }

    const item = await queryData<ISchool>(School, req);
    const { page, page_size, count, results } = item;
    res.status(200).json({
      message: "School was updated successfully",
      results,
      count,
      page,
      page_size,
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deleteSchoolPayment = async (req: Request, res: Response) => {
  await deleteItem(
    req,
    res,
    School,
    ["logo", "media", "picture"],
    "School not found"
  );
};

//-----------------COURSES--------------------//
export const createCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const uploadedFiles = await uploadFilesToS3(req);
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url;
    });
    await School.create(req.body);
    const item = await queryData<ISchool>(School, req);
    const { page, page_size, count, results } = item;
    res.status(200).json({
      message: "School was updated successfully",
      results,
      count,
      page,
      page_size,
    });
  } catch (error: any) {
    handleError(res, undefined, undefined, error);
  }
};

export const getCourseById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await School.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "School not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getCourses = async (req: Request, res: Response) => {
  try {
    const result = await queryData<ISchool>(School, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    if (req.files?.length || req.file) {
      const uploadedFiles = await uploadFilesToS3(req);
      uploadedFiles.forEach((file) => {
        req.body[file.fieldName] = file.s3Url;
      });
      await deleteItem(
        req,
        res,
        School,
        ["logo", "media", "picture"],
        "School not found"
      );
    }
    const result = await School.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!result) {
      return res.status(404).json({ message: "School not found" });
    }

    const item = await queryData<ISchool>(School, req);
    const { page, page_size, count, results } = item;
    res.status(200).json({
      message: "School was updated successfully",
      results,
      count,
      page,
      page_size,
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  await deleteItem(
    req,
    res,
    School,
    ["logo", "media", "picture"],
    "School not found"
  );
};

//-----------------DEPARTMENTS--------------------//
export const createDepartment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const uploadedFiles = await uploadFilesToS3(req);
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url;
    });
    await School.create(req.body);
    const item = await queryData<ISchool>(School, req);
    const { page, page_size, count, results } = item;
    res.status(200).json({
      message: "School was updated successfully",
      results,
      count,
      page,
      page_size,
    });
  } catch (error: any) {
    handleError(res, undefined, undefined, error);
  }
};

export const getDepartmentById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await School.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "School not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const result = await queryData<ISchool>(School, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    if (req.files?.length || req.file) {
      const uploadedFiles = await uploadFilesToS3(req);
      uploadedFiles.forEach((file) => {
        req.body[file.fieldName] = file.s3Url;
      });
      await deleteItem(
        req,
        res,
        School,
        ["logo", "media", "picture"],
        "School not found"
      );
    }
    const result = await School.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!result) {
      return res.status(404).json({ message: "School not found" });
    }

    const item = await queryData<ISchool>(School, req);
    const { page, page_size, count, results } = item;
    res.status(200).json({
      message: "School was updated successfully",
      results,
      count,
      page,
      page_size,
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  await deleteItem(
    req,
    res,
    School,
    ["logo", "media", "picture"],
    "School not found"
  );
};

//-----------------FACULTY--------------------//
export const createFaculty = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const uploadedFiles = await uploadFilesToS3(req);
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url;
    });
    await School.create(req.body);
    const item = await queryData<ISchool>(School, req);
    const { page, page_size, count, results } = item;
    res.status(200).json({
      message: "School was updated successfully",
      results,
      count,
      page,
      page_size,
    });
  } catch (error: any) {
    handleError(res, undefined, undefined, error);
  }
};

export const getFacultyById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await School.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "School not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getFaculties = async (req: Request, res: Response) => {
  try {
    const result = await queryData<ISchool>(School, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateFaculty = async (req: Request, res: Response) => {
  try {
    if (req.files?.length || req.file) {
      const uploadedFiles = await uploadFilesToS3(req);
      uploadedFiles.forEach((file) => {
        req.body[file.fieldName] = file.s3Url;
      });
      await deleteItem(
        req,
        res,
        School,
        ["logo", "media", "picture"],
        "School not found"
      );
    }
    const result = await School.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!result) {
      return res.status(404).json({ message: "School not found" });
    }

    const item = await queryData<ISchool>(School, req);
    const { page, page_size, count, results } = item;
    res.status(200).json({
      message: "School was updated successfully",
      results,
      count,
      page,
      page_size,
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deleteFaculty = async (req: Request, res: Response) => {
  await deleteItem(
    req,
    res,
    School,
    ["logo", "media", "picture"],
    "School not found"
  );
};
