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
exports.searchWeekends = exports.getGiveaways = exports.updateWeekend = exports.getWeekends = exports.getWeekendById = exports.createWeekend = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const weekendModel_1 = require("../../models/exam/weekendModel");
const createWeekend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, weekendModel_1.Weekend, 'Weekend was created successfully');
});
exports.createWeekend = createWeekend;
const getWeekendById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield weekendModel_1.Weekend.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Weekend not found' });
        }
        res.status(200).json({ data: item });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getWeekendById = getWeekendById;
const getWeekends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(weekendModel_1.Weekend, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getWeekends = getWeekends;
const updateWeekend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, weekendModel_1.Weekend, ['video', 'picture'], ['Weekend not found', 'Weekend was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateWeekend = updateWeekend;
// export const getGiveaways = async (req: Request, res: Response) => {
//   try {
//     const pageSize = Math.max(parseInt(req.query.page_size as string) || 20, 1)
//     const page = Math.max(parseInt(req.query.page as string) || 1, 1)
//     const skip = (page - 1) * pageSize
//     const { country, state, area } = req.query
//     const matchStage: any = {}
//     if (country) matchStage.country = country
//     if (state) matchStage.state = state
//     if (area) matchStage.area = area
//     const pipeline: any[] = [
//       {
//         $addFields: {
//           locationPriority: {
//             $add: [
//               country ? { $cond: [{ $eq: ['$country', country] }, 3, 0] } : 0,
//               state ? { $cond: [{ $eq: ['$state', state] }, 2, 0] } : 0,
//               area ? { $cond: [{ $eq: ['$area', area] }, 1, 0] } : 0,
//             ],
//           },
//         },
//       },
//       {
//         $sort: {
//           isActive: -1,
//           isSubscribed: -1,
//           locationPriority: -1, // 🔥 location match priority
//           isMain: -1,
//           isFeatured: -1,
//           createdAt: -1,
//         },
//       },
//       { $skip: skip },
//       { $limit: pageSize },
//     ]
//     const [results, totalArr] = await Promise.all([
//       Weekend.aggregate(pipeline),
//       Weekend.countDocuments(matchStage),
//     ])
//     res.status(200).json({
//       results,
//       total: totalArr,
//     })
//   } catch (error) {
//     handleError(res, undefined, undefined, error)
//   }
// }
const getGiveaways = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pageSize = Math.max(parseInt(req.query.page_size) || 20, 1);
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const skip = (page - 1) * pageSize;
        const { country, state, area } = req.query;
        // ✅ ONLY hard filter
        const matchStage = { isPublished: true };
        const pipeline = [
            { $match: matchStage },
            {
                $addFields: {
                    locationPriority: {
                        $add: [
                            country ? { $cond: [{ $eq: ['$country', country] }, 3, 0] } : 0,
                            state ? { $cond: [{ $eq: ['$state', state] }, 2, 0] } : 0,
                            area ? { $cond: [{ $eq: ['$area', area] }, 1, 0] } : 0,
                        ],
                    },
                },
            },
            {
                $sort: {
                    isActive: -1,
                    isSubscribed: -1,
                    locationPriority: -1,
                    isMain: -1,
                    isFeatured: -1,
                    createdAt: -1,
                },
            },
            { $skip: skip },
            { $limit: pageSize },
        ];
        const [results, total] = yield Promise.all([
            weekendModel_1.Weekend.aggregate(pipeline),
            weekendModel_1.Weekend.countDocuments({ isPublished: true }),
        ]);
        res.status(200).json({
            results,
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getGiveaways = getGiveaways;
const searchWeekends = (req, res) => {
    return (0, query_1.search)(weekendModel_1.Weekend, req, res);
};
exports.searchWeekends = searchWeekends;
