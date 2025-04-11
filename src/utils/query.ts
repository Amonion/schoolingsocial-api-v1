import { Model, FilterQuery } from "mongoose";
import { Request, Response } from "express";
import { deleteFilesFromS3, uploadFilesToS3 } from "./fileUpload";
import { handleError } from "./errorHandler";
import { Follower, Post } from "../models/users/postModel";
import { User } from "../models/users/userModel";

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
//         if (value.trim() === "") {
//           return { [key]: { $exists: false } };
//         }
//         if (value === "true" || value === "false") {
//           filters[key] = value === "true";
//         } else {
//           filters[key] = { $regex: value, $options: "i" };
//         }
//       } else if (Array.isArray(value)) {
//         const validValues = value.filter(
//           (item): item is string =>
//             typeof item === "string" && item.trim() !== ""
//         );
//         if (validValues.length === 0) {
//           return { [key]: { $exists: false } };
//         }
//         filters[key] = {
//           $in: validValues.map((item) => new RegExp(item, "i")),
//         };
//       } else if (typeof value === "boolean") {
//         filters[key] = value;
//       } else if (typeof value === "number") {
//         filters[key] = value;
//       } else if (value && typeof value === "object") {
//         filters[key] = value;
//       } else {
//         continue;
//       }
//     }
//   }

//   return filters;
// };

const buildFilterQuery = (req: Request): Record<string, any> => {
  const filters: Record<string, any> = {};

  const operators: Record<string, string> = {
    lt: "$lt",
    lte: "$lte",
    gt: "$gt",
    gte: "$gte",
    ne: "$ne",
    in: "$in",
    nin: "$nin",
  };

  const flattenQuery = (query: any): Record<string, any> => {
    const flat: Record<string, any> = {};

    for (const key in query) {
      const value = query[key];
      if (typeof value === "object" && !Array.isArray(value)) {
        for (const subKey in value) {
          flat[`${key}[${subKey}]`] = value[subKey];
        }
      } else {
        flat[key] = value;
      }
    }

    return flat;
  };

  const flatQuery = flattenQuery(req.query);

  for (const [key, rawValue] of Object.entries(flatQuery)) {
    if (key === "page" || key === "page_size" || key === "ordering") continue;

    const match = key.match(/^(.+)\[(.+)\]$/); // matches field[op]

    if (match) {
      const field = match[1];
      const op = match[2];

      if (operators[op]) {
        const mongoOp = operators[op];
        const value = Array.isArray(rawValue) ? rawValue : [rawValue];

        const finalValues = value.map((v) => {
          if (v === "true") return true;
          if (v === "false") return false;
          if (!isNaN(Number(v))) return Number(v);
          return v;
        });

        if (!filters[field]) filters[field] = {};
        filters[field][mongoOp] =
          finalValues.length === 1 ? finalValues[0] : finalValues;
      }
    } else {
      const value = Array.isArray(rawValue) ? rawValue : [rawValue];
      const normalizedValue = value[0];

      if (normalizedValue === "") {
        filters[key] = { $exists: false };
      } else if (normalizedValue === "true" || normalizedValue === "false") {
        filters[key] = normalizedValue === "true";
      } else if (!isNaN(Number(normalizedValue))) {
        filters[key] = Number(normalizedValue);
      } else if (typeof normalizedValue === "string") {
        filters[key] = { $regex: normalizedValue, $options: "i" };
      } else {
        filters[key] = normalizedValue; // fallback
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
  console.log(filters);
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

// function buildSearchQuery<T>(req: any): FilterQuery<T> {
//   const cleanedQuery = req.query;

//   let searchQuery: FilterQuery<T> = {} as FilterQuery<T>;

//   if (cleanedQuery.country) {
//     const countries = cleanedQuery.country.split(",");
//     Object.assign(searchQuery, { country: { $in: countries } });
//   }

//   if (cleanedQuery.state) {
//     if (cleanedQuery.country && cleanedQuery.country.split(",").length === 1) {
//       Object.assign(searchQuery, {
//         state: { $in: cleanedQuery.state.split(",") },
//       });
//     }
//   }

//   if (cleanedQuery.area) {
//     if (cleanedQuery.country && cleanedQuery.country.split(",").length === 1) {
//       if (cleanedQuery.state && cleanedQuery.state.split(",").length === 1) {
//         Object.assign(searchQuery, {
//           area: { $in: cleanedQuery.area.split(",") },
//         });
//       }
//     }
//   }

//   if (cleanedQuery.gender) {
//     const items = cleanedQuery.gender.split(",");
//     Object.assign(searchQuery, { gender: { $in: items } });
//   }

//   if (cleanedQuery.currentSchoolCountry) {
//     const items = cleanedQuery.currentSchoolCountry.split(",");
//     Object.assign(searchQuery, { currentSchoolCountry: { $in: items } });
//   }

//   if (cleanedQuery.currentSchoolName) {
//     const items = cleanedQuery.currentSchoolName.split(",");
//     Object.assign(searchQuery, { currentSchoolName: { $in: items } });
//   }

//   if (cleanedQuery.currentAcademicLevelName) {
//     const items = cleanedQuery.currentAcademicLevelName.split(",");
//     Object.assign(searchQuery, { currentAcademicLevelName: { $in: items } });
//   }

//   if (cleanedQuery.schoolCountry) {
//     const items = cleanedQuery.schoolCountry.split(",");
//     Object.assign(searchQuery, { country: { $in: items } });
//   }

//   if (cleanedQuery.schoolState) {
//     const items = cleanedQuery.schoolState.split(",");
//     Object.assign(searchQuery, { state: { $in: items } });
//   }

//   if (cleanedQuery.schoolArea) {
//     const items = cleanedQuery.schoolArea.split(",");
//     Object.assign(searchQuery, { area: { $in: items } });
//   }

//   if (cleanedQuery.schoolLevelName) {
//     const items = cleanedQuery.schoolLevelName.split(",");
//     Object.assign(searchQuery, { levelNames: { $in: items } });
//   }

//   if (cleanedQuery.examCountries) {
//     const items = cleanedQuery.examCountries.split(",");
//     Object.assign(searchQuery, { countries: { $in: items } });
//   }

//   if (cleanedQuery.examStates) {
//     const items = cleanedQuery.examStates.split(",");
//     Object.assign(searchQuery, { states: { $in: items } });
//   }

//   if (cleanedQuery.publishedAt) {
//     const [startDate, endDate] = cleanedQuery.publishedAt.split(",");

//     if (startDate && endDate) {
//       Object.assign(searchQuery, {
//         publishedAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
//       });
//     } else if (startDate) {
//       Object.assign(searchQuery, {
//         publishedAt: { $gte: new Date(startDate) },
//       });
//     } else if (endDate) {
//       Object.assign(searchQuery, { publishedAt: { $lte: new Date(endDate) } });
//     }
//   }

//   const regexQuery: FilterQuery<T> = {
//     $or: Object.entries(cleanedQuery).map(([field, value]) => ({
//       [field]: { $regex: String(value), $options: "i" },
//     })) as any,
//   };

//   return { ...searchQuery, ...regexQuery };
// }

// export const generalSearchQuery = <T>(req: any): FilterQuery<T> => {
//   const cleanedQuery = req.query;

//   let searchQuery: FilterQuery<T> = {} as FilterQuery<T>;

//   const textFields = [
//     "title",
//     "name",
//     "instruction",
//     "username",
//     "displayName",
//     "firstName",
//     "middleName",
//     "lastName",
//     "subtitle",
//   ];

//   const regexConditions: FilterQuery<T>[] = textFields
//     .filter((field) => cleanedQuery[field])
//     .map((field) => ({
//       [field]: { $regex: cleanedQuery[field], $options: "i" },
//     })) as FilterQuery<T>[];

//   return {
//     ...searchQuery,
//     ...(regexConditions.length ? { $or: regexConditions } : {}),
//   } as FilterQuery<T>;
// };

export const generalSearchQuery = <T>(
  req: any
): { filter: FilterQuery<T>; page: number; page_size: number } => {
  const cleanedQuery = req.query;

  let searchQuery: FilterQuery<T> = {} as FilterQuery<T>;

  const textFields = [
    "title",
    "name",
    "instruction",
    "username",
    "content",
    "displayName",
    "firstName",
    "middleName",
    "lastName",
    "subtitle",
  ];

  const regexConditions: FilterQuery<T>[] = textFields
    .filter((field) => cleanedQuery[field])
    .map((field) => ({
      [field]: { $regex: cleanedQuery[field], $options: "i" },
    })) as FilterQuery<T>[];

  const filter = {
    ...searchQuery,
    ...(regexConditions.length ? { $or: regexConditions } : {}),
  };

  const page = Math.max(1, parseInt(cleanedQuery.page) || 1); // Default to page 1
  const page_size = Math.max(1, parseInt(cleanedQuery.page_size) || 3); // Default to 10 items per page

  return { filter, page, page_size };
};

function buildSearchQuery<T>(req: any): FilterQuery<T> {
  const cleanedQuery = req.query;

  let searchQuery: FilterQuery<T> = {} as FilterQuery<T>;

  const applyInFilter = (field: string) => {
    if (cleanedQuery[field]) {
      Object.assign(searchQuery, {
        [field]: { $in: cleanedQuery[field].split(",") },
      });
    }
  };

  applyInFilter("country");
  applyInFilter("state");
  applyInFilter("area");
  applyInFilter("gender");
  applyInFilter("currentSchoolCountry");
  applyInFilter("currentSchoolName");
  applyInFilter("currentAcademicLevelName");
  applyInFilter("schoolCountry");
  applyInFilter("schoolState");
  applyInFilter("schoolArea");
  applyInFilter("schoolLevelName");
  applyInFilter("examCountries");
  applyInFilter("examStates");

  if (cleanedQuery.publishedAt) {
    let [startDate, endDate] = cleanedQuery.publishedAt.split(",");

    if (!startDate || startDate === "undefined") startDate = undefined;
    if (!endDate || endDate === "undefined") endDate = undefined;

    const dateFilter: any = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    if (Object.keys(dateFilter).length > 0) {
      Object.assign(searchQuery, { publishedAt: dateFilter });
    }
  }

  const textFields = [
    "title",
    "name",
    "instruction",
    "username",
    "displayName",
    "firstName",
    "middleName",
    "lastName",
    "subtitle",
  ];

  const regexConditions: FilterQuery<T>[] = textFields
    .filter((field) => cleanedQuery[field])
    .map((field) => ({
      [field]: { $regex: cleanedQuery[field], $options: "i" },
    })) as FilterQuery<T>[];

  return {
    ...searchQuery,
    ...(regexConditions.length ? { $or: regexConditions } : {}),
  } as FilterQuery<T>;
}

export const search = async <T>(
  model: Model<T>,
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const newSearchQuery = buildSearchQuery(req);
    console.log(newSearchQuery);
    const results = await model.find(newSearchQuery);
    res.json(results);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
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

export const followAccount = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  const follower = await User.findById(req.body.followerId);
  const post = req.body.post;
  const follow = await Follower.findOne({
    userId: user?._id,
    followerId: req.body.followerId,
  });

  if (follow) {
    await Follower.findByIdAndDelete(follow._id);
    await User.findByIdAndUpdate(req.params.id, { $inc: { followers: -1 } });
    if (post) {
      await Post.findByIdAndUpdate(post._id, {
        $inc: { unfollowers: 1 },
      });
    }
    if (follow.postId) {
      await Post.findByIdAndUpdate(follow.postId, {
        $inc: { followers: -1 },
      });
    }
  } else {
    await Follower.create({
      username: user?.username,
      userId: user?._id,
      picture: user?.picture,
      followerId: follower?._id,
      followerUsername: follower?.username,
      followerPicture: follower?.picture,
      postId: post ? post._id : undefined,
    });
    await User.findByIdAndUpdate(req.params.id, { $inc: { followers: 1 } });
    if (post) {
      await Post.findByIdAndUpdate(post._id, {
        $inc: { followers: 1 },
      });
    }
  }

  const message = follow
    ? `Your have unfollowed ${user?.displayName}`
    : `Your have successfully followed ${user?.displayName}`;

  return {
    follow,
    message,
  };
};

export const getItemById = async <T extends Document>(
  req: Request,
  res: Response,
  model: Model<T>,
  message: string
): Promise<Response | void> => {
  try {
    const item = await model.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: message });
    }
    res.status(200).json(item);
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
};

export const getItems = async <T extends Document>(
  req: Request,
  res: Response,
  model: Model<T>
): Promise<Response | void> => {
  try {
    const result = await queryData(model, req);
    res.status(200).json(result);
  } catch (error) {
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
  try {
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
    if (req.files?.length || req.file) {
      deleteFilesFromS3(result, files);
    }
    const item = await queryData(model, req);
    const { page, page_size, count, results } = item;
    res.status(200).json({
      message: messages[1],
      results,
      count,
      page,
      page_size,
    });
  } catch (error) {
    handleError(res, undefined, undefined, error);
  }
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
