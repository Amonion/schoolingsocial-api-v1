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
exports.deleteItems = exports.deleteItem = exports.updateItem = exports.getItems = exports.getItemById = exports.createItem = exports.queryData = void 0;
const fileUpload_1 = require("./fileUpload");
const errorHandler_1 = require("./errorHandler");
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
