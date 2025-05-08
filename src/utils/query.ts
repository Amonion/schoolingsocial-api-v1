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
          if (typeof v === "string" && v.includes(",")) {
            return v.split(",").map((s) => s.trim());
          }
          if (v === "true") return true;
          if (v === "false") return false;
          if (!isNaN(Number(v))) return Number(v);
          return v;
        });

        if (!filters[field]) filters[field] = {};
        filters[field][mongoOp] =
          finalValues.length === 1 ? finalValues[0] : finalValues.flat();
      }
    } else {
      const value = Array.isArray(rawValue) ? rawValue : [rawValue];
      const normalizedValue = value[0];

      // Special handling for schoolName inside nested school array
      if (key === "levelName") {
        const namesArray = normalizedValue
          .split(",")
          .map((name: string) => name.trim());
        filters["levels.levelName"] = { $in: namesArray };
      } else if (key === "usernames") {
        const namesArray = normalizedValue
          .split(",")
          .map((name: string) => name.trim());
        filters["username"] = { $in: namesArray };
      } else if (normalizedValue === "") {
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

export const generalSearchQuery = <T>(
  req: any
): {
  filter: FilterQuery<T>;
  page: number;
  page_size: number;
  userId: string;
} => {
  const rawIds = req.query.myIds;
  const userId = req.query.myId;

  const userIds =
    typeof rawIds === "string" ? rawIds.split(",").map((id) => id.trim()) : [];
  delete req.query.myIds;
  delete req.query.myId;
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

  let filter: FilterQuery<T> = {
    ...searchQuery,
    ...(regexConditions.length ? { $or: regexConditions } : {}),
  };

  if (userIds) {
    filter = {
      ...filter,
      _id: { $nin: userIds },
      userId: { $nin: userIds },
    };
  }

  const page = Math.max(1, parseInt(cleanedQuery.page) || 1);
  const page_size = Math.max(1, parseInt(cleanedQuery.page_size) || 3);

  return { filter, page, page_size, userId };
};

// function buildSearchQuery<T>(req: any): FilterQuery<T> {
//   const cleanedQuery = req.query;

//   let searchQuery: FilterQuery<T> = {} as FilterQuery<T>;

//   const applyInFilter = (field: string) => {
//     if (cleanedQuery[field]) {
//       Object.assign(searchQuery, {
//         [field]: { $in: cleanedQuery[field].split(",") },
//       });
//     }
//   };

//   applyInFilter("country");
//   applyInFilter("state");
//   applyInFilter("area");
//   applyInFilter("gender");
//   applyInFilter("currentSchoolCountry");
//   applyInFilter("currentSchoolName");
//   applyInFilter("currentAcademicLevelName");
//   applyInFilter("schoolCountry");
//   applyInFilter("schoolState");
//   applyInFilter("schoolArea");
//   applyInFilter("schoolLevelName");
//   applyInFilter("examCountries");
//   applyInFilter("examStates");

//   if (cleanedQuery.publishedAt) {
//     let [startDate, endDate] = cleanedQuery.publishedAt.split(",");

//     if (!startDate || startDate === "undefined") startDate = undefined;
//     if (!endDate || endDate === "undefined") endDate = undefined;

//     const dateFilter: any = {};
//     if (startDate) dateFilter.$gte = new Date(startDate);
//     if (endDate) dateFilter.$lte = new Date(endDate);

//     if (Object.keys(dateFilter).length > 0) {
//       Object.assign(searchQuery, { publishedAt: dateFilter });
//     }
//   }

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
// }

function buildSearchQuery<T>(req: any): FilterQuery<T> {
  const cleanedQuery = req.query;

  let searchQuery: FilterQuery<T> = {} as FilterQuery<T>;

  const applyInFilter = (field: string) => {
    if (cleanedQuery[field]) {
      const values = cleanedQuery[field].split(",").map((val: string) => {
        if (val === "true") return true;
        if (val === "false") return false;
        return val;
      });

      Object.assign(searchQuery, {
        [field]: { $in: values },
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
  applyInFilter("isVerified");
  applyInFilter("postType");

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

  if (cleanedQuery.userId) {
    Object.assign(searchQuery, {
      userId: { $ne: cleanedQuery.userId },
    });
  }

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
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    let results = await model
      .find(newSearchQuery)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (req.query.followerId) {
      const followings = await Follower.find({
        followerId: req.query.followerId,
      });

      const followedUserIds = new Set(
        followings.map((f: any) => f.userId.toString())
      );

      results = results.map((item: any) => {
        const obj = item.toObject();
        obj.isFollowed = followedUserIds.has(obj._id.toString());
        return obj;
      });
    }

    // console.log(results)

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
