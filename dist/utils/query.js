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
exports.deleteItems = exports.deleteItem = exports.updateItem = exports.getItems = exports.getItemById = exports.followAccount = exports.createItem = exports.searchRecord = exports.search = exports.generalSearchQuery = exports.queryData = void 0;
const fileUpload_1 = require("./fileUpload");
const errorHandler_1 = require("./errorHandler");
const postModel_1 = require("../models/post/postModel");
const user_1 = require("../models/users/user");
const postStateModel_1 = require("../models/post/postStateModel");
const buildFilterQuery = (req) => {
    const filters = {};
    const operators = {
        lt: '$lt',
        lte: '$lte',
        gt: '$gt',
        gte: '$gte',
        ne: '$ne',
        in: '$in',
        nin: '$nin',
    };
    const flattenQuery = (query) => {
        const flat = {};
        for (const key in query) {
            const value = query[key];
            if (typeof value === 'object' && !Array.isArray(value)) {
                for (const subKey in value) {
                    flat[`${key}[${subKey}]`] = value[subKey];
                }
            }
            else {
                flat[key] = value;
            }
        }
        return flat;
    };
    const flatQuery = flattenQuery(req.query);
    for (const [key, rawValue] of Object.entries(flatQuery)) {
        if (key === 'page' || key === 'page_size' || key === 'ordering')
            continue;
        const match = key.match(/^(.+)\[(.+)\]$/);
        if (match) {
            const field = match[1];
            const op = match[2];
            if (operators[op]) {
                const mongoOp = operators[op];
                const value = Array.isArray(rawValue) ? rawValue : [rawValue];
                const finalValues = value.map((v) => {
                    if (typeof v === 'string' && v.includes(',')) {
                        return v.split(',').map((s) => s.trim());
                    }
                    if (v === 'true')
                        return true;
                    if (v === 'false')
                        return false;
                    if (!isNaN(Number(v)))
                        return Number(v);
                    return v;
                });
                if (!filters[field])
                    filters[field] = {};
                filters[field][mongoOp] =
                    finalValues.length === 1 ? finalValues[0] : finalValues.flat();
            }
        }
        else {
            const value = Array.isArray(rawValue) ? rawValue : [rawValue];
            const normalizedValue = value[0];
            if (key === 'levelName' &&
                !req.baseUrl.includes('/api/v1/courses') &&
                !req.baseUrl.includes('/api/v1/questions')) {
                const namesArray = normalizedValue
                    .split(',')
                    .map((name) => name.trim());
                filters['levels.levelName'] = { $in: namesArray };
            }
            else if (key === 'usernames') {
                const namesArray = normalizedValue
                    .split(',')
                    .map((name) => name.trim());
                filters['username'] = { $in: namesArray };
            }
            else if (normalizedValue === '') {
                filters[key] = { $exists: false };
            }
            else if (normalizedValue === 'true' || normalizedValue === 'false') {
                filters[key] = normalizedValue === 'true';
            }
            else if (!isNaN(Number(normalizedValue))) {
                filters[key] = Number(normalizedValue);
            }
            else if (typeof normalizedValue === 'string') {
                if (key === 'username' && req.baseUrl.includes('/api/v1/posts')) {
                    filters[key] = normalizedValue; // exact match
                }
                else if ((req.originalUrl.includes('/api/v1/notifications') ||
                    req.originalUrl.includes('/api/v1/messages')) &&
                    req.query.receiverUsername &&
                    req.query.senderUsername) {
                    // Only apply OR filter if BOTH are present
                    filters['$or'] = [
                        { receiverUsername: normalizedValue },
                        { senderUsername: normalizedValue },
                    ];
                }
                else {
                    filters[key] = { $regex: normalizedValue, $options: 'i' }; // partial match
                }
            }
            else {
                filters[key] = normalizedValue;
            }
        }
    }
    return filters;
};
const buildSortingQuery = (req) => {
    const sort = {};
    if (req.query.ordering) {
        const ordering = req.query.ordering;
        const fields = ordering.split(',');
        fields.forEach((field) => {
            const sortOrder = field.startsWith('-') ? -1 : 1;
            const fieldName = field.replace('-', '');
            sort[fieldName] = sortOrder;
        });
    }
    return sort;
};
// export const queryData = async <T>(
//   model: Model<T>,
//   req: Request
// ): Promise<PaginationResult<T>> => {
//   const page_size = parseInt(req.query.page_size as string, 10) || 10
//   const page = parseInt(req.query.page as string, 10) || 1
//   const filters = buildFilterQuery(req)
//   const sort = buildSortingQuery(req)
//   const count = await model.countDocuments(filters)
//   const results = await model
//     .find(filters)
//     .skip((page - 1) * page_size)
//     .limit(page_size)
//     .sort(sort)
//   return {
//     count,
//     results,
//     page,
//     page_size,
//   }
// }
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
    const payload = {
        count,
        results,
        page,
        page_size,
    };
    return payload;
});
exports.queryData = queryData;
const generalSearchQuery = (req) => {
    const rawIds = req.query.myIds;
    const userId = req.query.myId;
    const userIds = typeof rawIds === 'string' ? rawIds.split(',').map((id) => id.trim()) : [];
    delete req.query.myIds;
    delete req.query.myId;
    const cleanedQuery = req.query;
    let searchQuery = {};
    const textFields = [
        'title',
        'name',
        'instruction',
        'username',
        'content',
        'displayName',
        'firstName',
        'middleName',
        'lastName',
        'subtitle',
    ];
    const regexConditions = textFields
        .filter((field) => cleanedQuery[field])
        .map((field) => ({
        [field]: { $regex: cleanedQuery[field], $options: 'i' },
    }));
    let filter = Object.assign(Object.assign({}, searchQuery), (regexConditions.length ? { $or: regexConditions } : {}));
    if (userIds) {
        filter = Object.assign(Object.assign({}, filter), { _id: { $nin: userIds }, userId: { $nin: userIds } });
    }
    const page = Math.max(1, parseInt(cleanedQuery.page) || 1);
    const page_size = Math.max(1, parseInt(cleanedQuery.page_size) || 3);
    return { filter, page, page_size, userId };
};
exports.generalSearchQuery = generalSearchQuery;
function buildSearchQuery(req) {
    const cleanedQuery = req.query;
    let searchQuery = {};
    const applyInFilter = (field) => {
        if (cleanedQuery[field]) {
            const values = cleanedQuery[field].split(',').map((val) => {
                if (val === 'true')
                    return true;
                if (val === 'false')
                    return false;
                return val;
            });
            Object.assign(searchQuery, {
                [field]: { $in: values },
            });
        }
    };
    applyInFilter('country');
    applyInFilter('state');
    applyInFilter('area');
    applyInFilter('gender');
    applyInFilter('currentSchoolCountry');
    applyInFilter('currentSchoolName');
    applyInFilter('currentAcademicLevelName');
    applyInFilter('schoolCountry');
    applyInFilter('schoolState');
    applyInFilter('schoolArea');
    applyInFilter('schoolLevelName');
    applyInFilter('examCountries');
    applyInFilter('examStates');
    applyInFilter('isVerified');
    applyInFilter('isOnVerification');
    applyInFilter('postType');
    applyInFilter('userType');
    if (cleanedQuery.publishedAt) {
        let [startDate, endDate] = cleanedQuery.publishedAt.split(',');
        if (!startDate || startDate === 'undefined')
            startDate = undefined;
        if (!endDate || endDate === 'undefined')
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
        'title',
        'name',
        'instruction',
        'username',
        'displayName',
        'bioUserDisplayName',
        'bioUserUsername',
        'firstName',
        'middleName',
        'content',
        'duties',
        'position',
        'author',
        'lastName',
        'subtitle',
    ];
    const regexConditions = textFields
        .filter((field) => cleanedQuery[field])
        .map((field) => ({
        [field]: { $regex: cleanedQuery[field], $options: 'i' },
    }));
    if (cleanedQuery.userId) {
        Object.assign(searchQuery, {
            userId: { $ne: cleanedQuery.userId },
        });
    }
    if (cleanedQuery.bioUserId) {
        Object.assign(searchQuery, {
            bioUserId: { $ne: cleanedQuery.bioUserId },
        });
    }
    return Object.assign(Object.assign({}, searchQuery), (regexConditions.length ? { $or: regexConditions } : {}));
}
const search = (model, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newSearchQuery = buildSearchQuery(req);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        let results = yield model
            .find(newSearchQuery)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        if (req.query.followerId) {
            const followings = yield postStateModel_1.Follower.find({
                followerId: req.query.followerId,
            });
            const followedUserIds = new Set(followings.map((f) => f.userId.toString()));
            results = results.map((item) => {
                const obj = item.toObject();
                obj.isFollowed = followedUserIds.has(obj._id.toString());
                return obj;
            });
        }
        res.json({ results });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.search = search;
const searchRecord = (model, req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newSearchQuery = buildSearchQuery(req);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const count = yield model.countDocuments(newSearchQuery);
        let results = yield model
            .find(newSearchQuery)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        if (req.query.followerId) {
            const followings = yield postStateModel_1.Follower.find({
                followerId: req.query.followerId,
            });
            const followedUserIds = new Set(followings.map((f) => f.userId.toString()));
            results = results.map((item) => {
                const obj = item.toObject();
                obj.isFollowed = followedUserIds.has(obj._id.toString());
                return obj;
            });
        }
        return { results, count };
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
        // ALWAYS return the same shape
        return { results: [], count: 0 };
    }
});
exports.searchRecord = searchRecord;
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
const followAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.User.findById(req.params.id);
    const follower = yield user_1.User.findById(req.body.followerId);
    const post = req.body.post;
    const follow = yield postStateModel_1.Follower.findOne({
        userId: user === null || user === void 0 ? void 0 : user._id,
        followerId: req.body.followerId,
    });
    if (follow) {
        yield postStateModel_1.Follower.findByIdAndDelete(follow._id);
        yield user_1.User.findByIdAndUpdate(req.params.id, { $inc: { followers: -1 } });
        yield user_1.User.findByIdAndUpdate(follower === null || follower === void 0 ? void 0 : follower._id, { $inc: { followings: -1 } });
        if (post) {
            yield postModel_1.Post.findByIdAndUpdate(post._id, {
                $inc: { unfollowers: 1 },
            });
        }
        if (follow.postId) {
            yield postModel_1.Post.findByIdAndUpdate(follow.postId, {
                $inc: { followers: -1 },
            });
        }
    }
    else {
        yield postStateModel_1.Follower.create({
            displayName: user === null || user === void 0 ? void 0 : user.displayName,
            username: user === null || user === void 0 ? void 0 : user.username,
            userId: user === null || user === void 0 ? void 0 : user._id,
            picture: user === null || user === void 0 ? void 0 : user.picture,
            isVerified: user === null || user === void 0 ? void 0 : user.isVerified,
            followerId: follower === null || follower === void 0 ? void 0 : follower._id,
            followerUsername: follower === null || follower === void 0 ? void 0 : follower.username,
            followerPicture: follower === null || follower === void 0 ? void 0 : follower.picture,
            followerDisplayName: follower === null || follower === void 0 ? void 0 : follower.displayName,
            followerIsVerified: follower === null || follower === void 0 ? void 0 : follower.isVerified,
            postId: post ? post._id : undefined,
        });
        yield user_1.User.findByIdAndUpdate(req.params.id, { $inc: { followers: 1 } });
        const item = yield user_1.User.findByIdAndUpdate(follower === null || follower === void 0 ? void 0 : follower._id, { $inc: { followings: 1 } }, { new: true });
        if (post) {
            yield postModel_1.Post.findByIdAndUpdate(post._id, {
                $inc: { followers: 1 },
            });
        }
    }
    const message = follow
        ? `Your have unfollowed ${user === null || user === void 0 ? void 0 : user.displayName}`
        : `Your have successfully followed ${user === null || user === void 0 ? void 0 : user.displayName}`;
    return {
        follow,
        message,
    };
});
exports.followAccount = followAccount;
const getItemById = (req, res, model, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield model.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: message });
        }
        res.status(200).json({ data: item });
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
