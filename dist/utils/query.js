"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItems = exports.deleteItem = exports.updateItem = exports.getItems = exports.getItemById = exports.createItem = exports.search = exports.generalSearchQuery = exports.queryData = void 0;
const fileUpload_1 = require("./fileUpload");
const errorHandler_1 = require("./errorHandler");
const buildFilterQuery = (req) => {
    const filters = {};
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
                }
                else {
                    // Use regex for other strings
                    filters[key] = { $regex: value, $options: "i" };
                }
            }
            else if (Array.isArray(value)) {
                // Map each item in the array to a regex, ensuring it is a string
                const validValues = value.filter((item) => typeof item === "string" && item.trim() !== "");
                if (validValues.length === 0) {
                    // If all array items are empty, return a filter that matches no documents
                    return { [key]: { $exists: false } };
                }
                filters[key] = {
                    $in: validValues.map((item) => new RegExp(item, "i")),
                };
            }
            else if (typeof value === "boolean") {
                // Directly handle boolean fields
                filters[key] = value;
            }
            else if (typeof value === "number") {
                // Handle numbers directly
                filters[key] = value;
            }
            else if (value && typeof value === "object") {
                // Handle plain objects
                filters[key] = value;
            }
            else {
                // Ignore unsupported or undefined types
                continue;
            }
        }
    }
    return filters;
};
// const buildFilterQuery = (req: Request): Record<string, any> => {
//   const filters: Record<string, any> = {};
//   for (const [key, value] of Object.entries(req.query)) {
//     if (["page_size", "page", "ordering"].includes(key)) continue;
//     if (typeof value === "string") {
//       const valuesArray = value
//         .split(",")
//         .map((v) => v.trim())
//         .filter(Boolean);
//       if (valuesArray.length === 1) {
//         filters[key] = { $regex: valuesArray[0], $options: "i" };
//       } else {
//         filters[key] = { $in: valuesArray.map((v) => new RegExp(v, "i")) };
//       }
//     } else if (Array.isArray(value)) {
//       const validValues = value.filter(
//         (item): item is string => typeof item === "string" && item.trim() !== ""
//       );
//       if (validValues.length > 0) {
//         filters[key] = {
//           $in: validValues.map((item) => new RegExp(item, "i")),
//         };
//       }
//     } else if (typeof value === "boolean" || typeof value === "number") {
//       filters[key] = value;
//     } else if (value && typeof value === "object") {
//       filters[key] = value;
//     }
//   }
//   return filters;
// };
const buildSortingQuery = (req) => {
    const sort = {};
    if (req.query.ordering) {
        const ordering = req.query.ordering;
        const fields = ordering.split(",");
        fields.forEach((field) => {
            const sortOrder = field.startsWith("-") ? -1 : 1;
            const fieldName = field.replace("-", "");
            sort[fieldName] = sortOrder;
        });
    }
    return sort;
};
const queryData = (model, req) => __awaiter(void 0, void 0, void 0, function* () {
    const page_size = parseInt(req.query.page_size, 10) || 10;
    const page = parseInt(req.query.page, 10) || 1;
    const filters = buildFilterQuery(req);
    const sort = buildSortingQuery(req);
    const count = yield model.countDocuments(filters);
    const results = yield model
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
});
exports.queryData = queryData;
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
const generalSearchQuery = (req) => {
    const cleanedQuery = req.query;
    let searchQuery = {};
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
    const regexConditions = textFields
        .filter((field) => cleanedQuery[field])
        .map((field) => ({
        [field]: { $regex: cleanedQuery[field], $options: "i" },
    }));
    const filter = Object.assign(Object.assign({}, searchQuery), (regexConditions.length ? { $or: regexConditions } : {}));
    const page = Math.max(1, parseInt(cleanedQuery.page) || 1); // Default to page 1
    const page_size = Math.max(1, parseInt(cleanedQuery.page_size) || 3); // Default to 10 items per page
    return { filter, page, page_size };
};
exports.generalSearchQuery = generalSearchQuery;
function buildSearchQuery(req) {
    const cleanedQuery = req.query;
    let searchQuery = {};
    const applyInFilter = (field) => {
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
        if (!startDate || startDate === "undefined")
            startDate = undefined;
        if (!endDate || endDate === "undefined")
            endDate = undefined;
        const dateFilter = {};
        if (startDate)
            dateFilter.$gte = new Date(startDate);
        if (endDate)
            dateFilter.$lte = new Date(endDate);
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
    const regexConditions = textFields
        .filter((field) => cleanedQuery[field])
        .map((field) => ({
        [field]: { $regex: cleanedQuery[field], $options: "i" },
    }));
    return Object.assign(Object.assign({}, searchQuery), (regexConditions.length ? { $or: regexConditions } : {}));
}
const search = (model, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newSearchQuery = buildSearchQuery(req);
        console.log(newSearchQuery);
        const results = yield model.find(newSearchQuery);
        res.json(results);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.search = search;
const createItem = (req, res, model, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
        uploadedFiles.forEach((file) => {
            req.body[file.fieldName] = file.s3Url;
        });
        yield model.create(req.body);
        const item = yield (0, exports.queryData)(model, req);
        const { page, page_size, count, results } = item;
        res.status(200).json({
            message: message,
            results,
            count,
            page,
            page_size,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.createItem = createItem;
const getItemById = (req, res, model, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield model.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: message });
        }
        res.status(200).json(item);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getItemById = getItemById;
const getItems = (req, res, model) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, exports.queryData)(model, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getItems = getItems;
const updateItem = (req, res, model, files, messages) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        if (((_a = req.files) === null || _a === void 0 ? void 0 : _a.length) || req.file) {
            const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
            uploadedFiles.forEach((file) => {
                req.body[file.fieldName] = file.s3Url;
            });
        }
        const result = yield model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!result) {
            return res.status(404).json({ message: messages[0] });
        }
        if (((_b = req.files) === null || _b === void 0 ? void 0 : _b.length) || req.file) {
            (0, fileUpload_1.deleteFilesFromS3)(result, files);
        }
        const item = yield (0, exports.queryData)(model, req);
        const { page, page_size, count, results } = item;
        res.status(200).json({
            message: messages[1],
            results,
            count,
            page,
            page_size,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateItem = updateItem;
const deleteItem = (req, res, model, fields, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield model.findById(req.params.id);
        yield model.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ message });
        }
        if (fields.length > 0) {
            yield (0, fileUpload_1.deleteFilesFromS3)(result, fields);
        }
        const results = yield (0, exports.queryData)(model, req);
        res.status(200).json(results);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.deleteItem = deleteItem;
const deleteItems = (req, res, model, fields, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = req.body;
        for (let i = 0; i < items.length; i++) {
            const el = items[i];
            const result = yield model.findById(el.id);
            yield model.findByIdAndDelete(el.id);
            if (!result) {
                return res.status(404).json({ message });
            }
            if (fields.length > 0) {
                const s3Fields = [];
                fields.forEach((field) => {
                    const value = result[field];
                    if (value !== undefined) {
                        s3Fields.push(String(value));
                    }
                });
                yield (0, fileUpload_1.deleteFilesFromS3)(result, s3Fields);
            }
            if (i + 1 === items.length) {
                const results = yield (0, exports.queryData)(model, req);
                res.status(200).json(results);
            }
        }
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.deleteItems = deleteItems;
