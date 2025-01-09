import { Model } from "mongoose";
import { Request, Response } from "express";
import { deleteFilesFromS3, uploadFilesToS3 } from "./fileUpload";
import { handleError } from "./errorHandler";

interface PaginationResult<T> {
  count: number; // Total number of records
  results: T[]; // Fetched rows
  page: number; // Current page
  page_size: number; // Rows per page
}

// const buildFilterQuery = (req: Request): Record<string, any> => {
//   const filters: Record<string, any> = {};

//   for (const [key, value] of Object.entries(req.query)) {
//     if (key !== "page_size" && key !== "page" && key !== "ordering") {
//       if (typeof value === "string") {
//         if (value === "true" || value === "false") {
//           // Convert boolean-like strings to actual booleans
//           filters[key] = value === "true";
//         } else {
//           // Use regex for other strings
//           filters[key] = { $regex: value, $options: "i" };
//         }
//       } else if (Array.isArray(value)) {
//         // Map each item in the array to a regex, ensuring it is a string
//         filters[key] = {
//           $in: value
//             .filter((item): item is string => typeof item === "string")
//             .map((item) => new RegExp(item, "i")),
//         };
//       } else if (typeof value === "boolean") {
//         // Directly handle boolean fields
//         filters[key] = value;
//       } else if (typeof value === "number") {
//         // Handle numbers directly
//         filters[key] = value;
//       } else if (value && typeof value === "object") {
//         // Handle plain objects
//         filters[key] = value;
//       } else {
//         // Ignore unsupported or undefined types
//         continue;
//       }
//     }
//   }

//   return filters;
// };

const buildFilterQuery = (req: Request): Record<string, any> => {
  const filters: Record<string, any> = {};

  for (const [key, value] of Object.entries(req.query)) {
    if (key !== "page_size" && key !== "page" && key !== "ordering") {
      if (typeof value === "string") {
        if (value.trim() === "") {
          // If any key has an empty string value, return a filter that matches no documents
          return { [key]: { $exists: false } };
        }
        if (value === "true" || value === "false") {
          // Convert boolean-like strings to actual booleans
          filters[key] = value === "true";
        } else {
          // Use regex for other strings
          filters[key] = { $regex: value, $options: "i" };
        }
      } else if (Array.isArray(value)) {
        // Map each item in the array to a regex, ensuring it is a string
        const validValues = value.filter(
          (item): item is string =>
            typeof item === "string" && item.trim() !== ""
        );
        if (validValues.length === 0) {
          // If all array items are empty, return a filter that matches no documents
          return { [key]: { $exists: false } };
        }
        filters[key] = {
          $in: validValues.map((item) => new RegExp(item, "i")),
        };
      } else if (typeof value === "boolean") {
        // Directly handle boolean fields
        filters[key] = value;
      } else if (typeof value === "number") {
        // Handle numbers directly
        filters[key] = value;
      } else if (value && typeof value === "object") {
        // Handle plain objects
        filters[key] = value;
      } else {
        // Ignore unsupported or undefined types
        continue;
      }
    }
  }

  return filters;
};

const buildSortingQuery = (req: Request): Record<string, any> => {
  const sort: Record<string, any> = {};

  if (req.query.ordering) {
    const ordering = req.query.ordering as string;
    const fields = ordering.split(",");

    fields.forEach((field) => {
      const sortOrder = field.startsWith("-") ? -1 : 1;
      const fieldName = field.replace("-", "");
      sort[fieldName] = sortOrder;
    });
  }

  return sort;
};

export const queryData = async <T>(
  model: Model<T>,
  req: Request
): Promise<PaginationResult<T>> => {
  const page_size = parseInt(req.query.page_size as string, 10) || 10;
  const page = parseInt(req.query.page as string, 10) || 1;

  const filters = buildFilterQuery(req);
  const sort = buildSortingQuery(req);

  const count = await model.countDocuments(filters);
  const results = await model
    .find(filters)
    .skip((page - 1) * page_size)
    .limit(page_size)
    .sort(sort);

  return {
    count,
    results,
    page,
    page_size,
  };
};

export const createItem = async <T extends Document>(
  req: Request,
  res: Response,
  model: Model<T>,
  message: string
): Promise<void> => {
  try {
    const uploadedFiles = await uploadFilesToS3(req);
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url;
    });
    await model.create(req.body);
    const item = await queryData(model, req);
    const { page, page_size, count, results } = item;
    res.status(200).json({
      message: message,
      results,
      count,
      page,
      page_size,
    });
  } catch (error: any) {
    handleError(res, undefined, undefined, error);
  }
};

export const updateItem = async <T extends Document>(
  req: Request,
  res: Response,
  model: Model<T>,
  files: string[],
  messages: string[]
) => {
  if (req.files?.length || req.file) {
    const uploadedFiles = await uploadFilesToS3(req);
    uploadedFiles.forEach((file) => {
      req.body[file.fieldName] = file.s3Url;
    });
  }
  const result = await model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    return res.status(404).json({ message: messages[0] });
  }
  deleteFilesFromS3(result, files);

  const item = await queryData(model, req);
  const { page, page_size, count, results } = item;
  res.status(200).json({
    message: messages[1],
    results,
    count,
    page,
    page_size,
  });
};

export const deleteItem = async <T extends Document>(
  req: Request,
  res: Response,
  model: Model<T>,
  fields: string[],
  message: string
) => {
  try {
    const result = await model.findById(req.params.id);
    await model.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message });
    }

    if (fields.length > 0) {
      await deleteFilesFromS3(result, fields);
    }
    const results = await queryData(model, req);
    res.status(200).json(results);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const deleteItems = async <T extends Document>(
  req: Request,
  res: Response,
  model: Model<T>,
  fields: Array<keyof T>,
  message: string
) => {
  try {
    const items = req.body;
    for (let i = 0; i < items.length; i++) {
      const el = items[i];
      const result = await model.findById(el.id);
      await model.findByIdAndDelete(el.id);
      if (!result) {
        return res.status(404).json({ message });
      }

      if (fields.length > 0) {
        const s3Fields: string[] = [];
        fields.forEach((field) => {
          const value = result[field];
          if (value !== undefined) {
            s3Fields.push(String(value));
          }
        });
        await deleteFilesFromS3(result, s3Fields);
      }

      if (i + 1 === items.length) {
        const results = await queryData(model, req);
        res.status(200).json(results);
      }
    }
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};
