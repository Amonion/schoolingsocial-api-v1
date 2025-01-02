import { Model } from "mongoose";
import { Request } from "express";

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
//         if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
//           filters[key] = value.toLowerCase() === "true";
//         } else {
//           filters[key] = { $regex: value, $options: "i" };
//         }
//       } else if (value && typeof value === "object" && !Array.isArray(value)) {
//         filters[key] = value;
//       } else if (Array.isArray(value)) {
//         filters[key] = { $in: value };
//       } else {
//         filters[key] = value;
//       }
//     }
//   }

//   return filters;
// };

import { ParsedQs } from "qs";

const buildFilterQuery = (req: Request): Record<string, any> => {
  const filters: Record<string, any> = {};

  for (const [key, value] of Object.entries(req.query)) {
    if (key !== "page_size" && key !== "page" && key !== "ordering") {
      if (typeof value === "string") {
        // Always use regex for strings
        filters[key] = { $regex: value, $options: "i" };
      } else if (Array.isArray(value)) {
        // Map each item in the array to a regex, ensuring it is a string
        filters[key] = {
          $in: value
            .filter((item): item is string => typeof item === "string")
            .map((item) => new RegExp(item, "i")),
        };
      } else if (value && typeof value === "object") {
        // Handle plain objects
        filters[key] = value;
      } else {
        // Handle other cases
        filters[key] = value;
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
