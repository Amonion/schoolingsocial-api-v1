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
exports.searchNews = exports.getHomeFeed = exports.deleteNews = exports.updateNews = exports.getFeaturedNews = exports.getNews = exports.massDeleteNews = exports.getNewsById = exports.createNews = void 0;
const newsModel_1 = require("../../models/place/newsModel");
const query_1 = require("../../utils/query");
const errorHandler_1 = require("../../utils/errorHandler");
const createNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.tags) {
        req.body.tags = JSON.parse(req.body.tags);
    }
    (0, query_1.createItem)(req, res, newsModel_1.News, 'News was created successfully');
});
exports.createNews = createNews;
const getNewsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.getItemById)(req, res, newsModel_1.News, 'News was not found');
});
exports.getNewsById = getNewsById;
const massDeleteNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield newsModel_1.News.deleteMany({ _id: { $in: req.body.ids } });
        const result = yield (0, query_1.queryData)(newsModel_1.News, req);
        res.status(200).json({
            message: 'The selected news have been deleted successfully',
            count: result.count,
            results: result.results,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.massDeleteNews = massDeleteNews;
const getNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(newsModel_1.News, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getNews = getNews;
// export const getFeaturedNews = async (
//   country: string,
//   state: string,
//   limitPerCategory = 20
// ) => {
//   const pipeline: PipelineStage[] = [
//     {
//       $facet: {
//         international: [
//           {
//             $match: {
//               priority: { $regex: /^international$/i },
//               isPublished: true,
//             },
//           },
//           { $sort: { createdAt: -1 } },
//           { $limit: limitPerCategory },
//         ],
//         national: [
//           {
//             $match: {
//               priority: { $regex: /^national$/i },
//               country: { $regex: new RegExp(`^${country}$`, 'i') },
//               isPublished: true,
//             },
//           },
//           { $sort: { createdAt: -1 } },
//           { $limit: limitPerCategory },
//         ],
//         local: [
//           {
//             $match: {
//               priority: { $regex: /^local$/i },
//               state: { $regex: new RegExp(`^${state}$`, 'i') },
//               isPublished: true,
//             },
//           },
//           { $sort: { createdAt: -1 } },
//           { $limit: limitPerCategory },
//         ],
//       },
//     },
//     {
//       $project: {
//         all: { $concatArrays: ['$international', '$national', '$local'] },
//       },
//     },
//     { $unwind: '$all' },
//     { $replaceRoot: { newRoot: '$all' } },
//     { $sort: { createdAt: -1 } },
//     {
//       $addFields: {
//         isFeatured: true,
//         isPublished: true,
//       },
//     },
//   ]
//   const news = await News.aggregate(pipeline)
//   return news
// }
const getFeaturedNews = (country_1, state_1, ...args_1) => __awaiter(void 0, [country_1, state_1, ...args_1], void 0, function* (country, state, limitPerCategory = 20) {
    const facets = {
        international: [
            {
                $match: {
                    priority: { $regex: /^international$/i },
                    isPublished: true,
                },
            },
            { $sort: { createdAt: -1 } },
            { $limit: limitPerCategory },
        ],
    };
    if (country) {
        facets.national = [
            {
                $match: {
                    priority: { $regex: /^national$/i },
                    country: { $regex: new RegExp(`^${country}$`, 'i') },
                    isPublished: true,
                },
            },
            { $sort: { createdAt: -1 } },
            { $limit: limitPerCategory },
        ];
    }
    if (state) {
        facets.local = [
            {
                $match: {
                    priority: { $regex: /^local$/i },
                    state: { $regex: new RegExp(`^${state}$`, 'i') },
                    isPublished: true,
                },
            },
            { $sort: { createdAt: -1 } },
            { $limit: limitPerCategory },
        ];
    }
    const pipeline = [
        { $facet: facets },
        {
            $project: {
                all: {
                    $concatArrays: Object.keys(facets).map((key) => `$${key}`),
                },
            },
        },
        { $unwind: '$all' },
        { $replaceRoot: { newRoot: '$all' } },
        { $sort: { createdAt: -1 } },
        {
            $addFields: {
                isFeatured: true,
                isPublished: true,
            },
        },
    ];
    const news = yield newsModel_1.News.aggregate(pipeline);
    return news;
});
exports.getFeaturedNews = getFeaturedNews;
const updateNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.updateItem)(req, res, newsModel_1.News, ['picture', 'video'], ['News not found', 'News was updated successfully']);
});
exports.updateNews = updateNews;
const deleteNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, newsModel_1.News, ['picture', 'video'], 'News not found');
});
exports.deleteNews = deleteNews;
const getHomeFeed = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const country = String(req.query.country);
        const state = String(req.query.state);
        const results = yield (0, exports.getFeaturedNews)(country, state);
        res.status(200).json({ results });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getHomeFeed = getHomeFeed;
const searchNews = (req, res) => {
    return (0, query_1.search)(newsModel_1.News, req, res);
};
exports.searchNews = searchNews;
