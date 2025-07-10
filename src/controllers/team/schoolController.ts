import { Request, Response } from "express";
import { handleError } from "../../utils/errorHandler";
import {
  School,
  SchoolPayment,
  Faculty,
  Department,
  Course,
} from "../../models/team/schoolModel";
import {
  ISchool,
  ISchoolPayment,
  IFaculty,
  IDepartment,
  ICourse,
  IAcademicLevel,
} from "../../utils/teamInterface";
import {
  queryData,
  deleteItem,
  updateItem,
  createItem,
  search,
} from "../../utils/query";

interface SchoolLevels {
  id: string;
  institution: string;
}

export const createSchool = async (
  req: Request,
  res: Response
): Promise<void> => {
  const levels: SchoolLevels[] = JSON.parse(req.body.levels);
  const institutions = levels.map((item) => item.institution);
  req.body.levels = levels;
  req.body.institutions = institutions;
  req.body.isRecorded = true;
  createItem(req, res, School, "School was created successfully");
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
    const levels: SchoolLevels[] = JSON.parse(req.body.levels);
    const institutions = levels.map((item) => item.institution);
    req.body.levels = levels;
    req.body.institutions = institutions;
    updateItem(
      req,
      res,
      School,
      ["logo", "media", "picture"],
      ["School not found", "School was updated successfully"]
    );
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const recordAll = async (req: Request, res: Response) => {
  try {
    const response = await School.updateMany(
      {}, // No filter — update all documents
      { $set: { isRecorded: true } }
    );
    res.status(200).json({ response });
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

export const searchSchool = (req: Request, res: Response) => {
  search(School, req, res);
};

export const updateLevels = async (req: Request, res: Response) => {
  try {
    const items = await School.find();
    for (let i = 0; i < items.length; i++) {
      const el = items[i];
      if (
        el.levelNames.length === 0 ||
        el.levelNames[i] === null ||
        el.levelNames === null ||
        el.levelNames === undefined
      ) {
        const levels: IAcademicLevel[] = JSON.parse(el.levels);
        const arr = [];
        for (let x = 0; x < levels.length; x++) {
          const elm = levels[x];
          arr.push(elm.levelName);
        }
        await School.findByIdAndUpdate(el._id, { levelNames: arr });
      }
    }
    return res.status(200).json({ message: "Schools updated successfully." });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};
//-----------------PAYMENT--------------------//
export const createSchoolPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(
    req,
    res,
    SchoolPayment,
    "School payment was created successfully"
  );
};

export const getSchoolPaymentById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await SchoolPayment.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "School payment not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getSchoolPayments = async (req: Request, res: Response) => {
  try {
    const result = await queryData<ISchoolPayment>(SchoolPayment, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateSchoolPayment = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      SchoolPayment,
      [],
      ["School payment not found", "School payment was updated successfully"]
    );
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deleteSchoolPayment = async (req: Request, res: Response) => {
  await deleteItem(req, res, SchoolPayment, [], "School payment not found");
};

export const searchSchools = async (req: Request, res: Response) => {
  try {
    const name = req.query.name;
    const schools = await School.aggregate([
      {
        $group: {
          _id: name ? `$${name}` : "$name",
          place: { $first: "$$ROOT" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $limit: 10,
      },
      {
        $replaceRoot: { newRoot: "$place" },
      },
    ]);

    res.status(200).json({
      results: schools,
    });
  } catch (error) {
    console.error("Error fetching unique places:", error);
    throw error;
  }
};

//-----------------COURSES--------------------//
export const createCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Course, "Course was created successfully");
};

export const getCourseById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Course.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getCourses = async (req: Request, res: Response) => {
  try {
    const result = await queryData<ICourse>(Course, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Course,
      ["media", "picture"],
      ["Course not found", "Course was updated successfully"]
    );
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  await deleteItem(req, res, Course, ["media", "picture"], "Course not found");
};

//-----------------DEPARTMENTS--------------------//
export const createDepartment = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Department, "Department was created successfully");
};

export const getDepartmentById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Department.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getDepartments = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IDepartment>(Department, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateDepartment = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Department,
      ["media", "picture"],
      ["Department not found", "Department was updated successfully"]
    );
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deleteDepartment = async (req: Request, res: Response) => {
  await deleteItem(
    req,
    res,
    Department,
    ["media", "picture"],
    "Department not found"
  );
};

//-----------------FACULTY--------------------//
export const createFaculty = async (
  req: Request,
  res: Response
): Promise<void> => {
  createItem(req, res, Faculty, "Faculty was created successfully");
};

export const getFacultyById = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const item = await Faculty.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Faculty not found" });
    }
    res.status(200).json(item);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getFaculties = async (req: Request, res: Response) => {
  try {
    const result = await queryData<IFaculty>(Faculty, req);
    res.status(200).json(result);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateFaculty = async (req: Request, res: Response) => {
  try {
    updateItem(
      req,
      res,
      Faculty,
      ["media", "picture"],
      ["Faculty not found", "Faculty was updated successfully"]
    );
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deleteFaculty = async (req: Request, res: Response) => {
  await deleteItem(
    req,
    res,
    Faculty,
    ["media", "picture"],
    "Faculty not found"
  );
};
