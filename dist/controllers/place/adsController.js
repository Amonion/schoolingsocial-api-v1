"use strict";
// import { Request, Response } from 'express'
// import { Place } from '../../models/team/placeModel'
// import { handleError } from '../../utils/errorHandler'
// import {
//   queryData,
//   deleteItems,
//   createItem,
//   updateItem,
// } from '../../utils/query'
// import { Ad } from '../../models/utility/adModel'
// import { IAd } from '../../utils/userInterface'
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
exports.getAdStats = exports.getDraftAd = exports.getAd = exports.getAds = exports.createAd = exports.publishAdReview = exports.updateAd = exports.deleteAd = exports.getAdById = void 0;
const placeModel_1 = require("../../models/place/placeModel");
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const adModel_1 = require("../../models/place/adModel");
const computation_1 = require("../../utils/computation");
//--------------------ADS-----------------------//
const getAdById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield adModel_1.Ad.findById(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Ad not found' });
        }
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getAdById = getAdById;
const deleteAd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItems)(req, res, placeModel_1.Place, ['countryFlag'], 'Place not found');
});
exports.deleteAd = deleteAd;
const updateAd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.target) {
            req.body.tags = JSON.parse(req.body.tags);
            req.body.states = JSON.parse(req.body.states);
            req.body.areas = JSON.parse(req.body.areas);
            req.body.countries = JSON.parse(req.body.countries);
        }
        const ad = yield adModel_1.Ad.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            message: 'Ad was updated successfully',
            data: ad,
        });
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateAd = updateAd;
const publishAdReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ad = yield adModel_1.Ad.findByIdAndUpdate(req.params.id, { onReview: true, status: true }, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            message: 'Your Ad is on review and you will be notified within 24 hours once approved',
            data: ad,
        });
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.publishAdReview = publishAdReview;
// export const createAd = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const uploadedFiles = await uploadFilesToS3(req)
//     uploadedFiles.forEach((file) => {
//       req.body[file.fieldName] = file.s3Url
//     })
//     const newUser = new User({
//       userStatus: 'ad',
//       email: `${req.body.username}@smail.com`,
//       username: req.body.username,
//       password: await bcrypt.hash('password', 10),
//     })
//     await newUser.save()
//     req.body.media = JSON.parse(req.body.media)
//     const ad = await Ad.create(req.body, {
//       new: true,
//       runValidators: true,
//     })
//     res.status(200).json({
//       message: 'Ad is created successfully',
//       data: ad,
//     })
//   } catch (error: any) {
//     console.log(error)
//     handleError(res, undefined, undefined, error)
//   }
// }
const createAd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, adModel_1.Ad, 'Ads was created successfully');
});
exports.createAd = createAd;
const getAds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(adModel_1.Ad, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getAds = getAds;
const getAd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ad = yield adModel_1.Ad.findById(req.params.id);
        res.status(200).json({
            message: 'Post stats retrieved successfully',
            data: ad,
        });
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getAd = getAd;
const getDraftAd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ad = yield adModel_1.Ad.findOne({ user: req.query.username, status: false });
        res.status(200).json({
            data: ad,
        });
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getDraftAd = getDraftAd;
const getAdStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        const period = req.query.period || 'all';
        const username = req.query.username || null;
        const country = req.query.country || 'Nigeria';
        const currency = yield placeModel_1.Place.findOne({
            country: new RegExp(`^${country.trim()}\\s*$`, 'i'),
        }).select('currencySymbol');
        const { startDate, prevStartDate, prevEndDate } = period !== 'all'
            ? (0, computation_1.getPeriodRange)(period)
            : { startDate: null, prevStartDate: null, prevEndDate: null };
        //--------------AD STATS--------------//
        const matchStage = {};
        if (startDate)
            matchStage.createdAt = { $gte: startDate };
        if (username)
            matchStage.username = username;
        const adStats = yield adModel_1.Ad.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalAds: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    totalDuration: { $sum: '$duration' },
                },
            },
            { $project: { _id: 0 } },
        ]);
        let percentageChange = 0;
        if (startDate && prevStartDate && prevEndDate) {
            const prevMatch = {
                createdAt: { $gte: prevStartDate, $lt: prevEndDate },
            };
            const prevStats = yield adModel_1.Ad.aggregate([
                { $match: prevMatch },
                {
                    $group: {
                        _id: null,
                        totalAds: { $sum: 1 },
                    },
                },
                { $project: { _id: 0 } },
            ]);
            const currentAds = ((_a = adStats[0]) === null || _a === void 0 ? void 0 : _a.totalAds) || 0;
            const prevAds = ((_b = prevStats[0]) === null || _b === void 0 ? void 0 : _b.totalAds) || 0;
            if (prevAds > 0) {
                percentageChange = ((currentAds - prevAds) / prevAds) * 100;
            }
            else if (currentAds > 0) {
                percentageChange = 100;
            }
            else {
                percentageChange = 0;
            }
        }
        const adStatTimeSeries = yield adModel_1.Ad.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        day: {
                            $dateToString: {
                                format: '%Y-%m-%d', // group by day
                                date: '$createdAt',
                            },
                        },
                    },
                    totalAds: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    totalDuration: { $sum: '$duration' },
                },
            },
            { $sort: { '_id.day': 1 } },
            {
                $project: {
                    _id: 0,
                    day: '$_id.day',
                    totalAds: 1,
                    totalAmount: 1,
                    totalDuration: 1,
                },
            },
        ]);
        //--------------REVIEW STATS--------------//
        const onReviewStage = { onReview: true };
        if (startDate)
            onReviewStage.createdAt = { $gte: startDate };
        if (username)
            onReviewStage.username = username;
        const onReviewStats = yield adModel_1.Ad.aggregate([
            { $match: onReviewStage },
            {
                $group: {
                    _id: null,
                    totalAds: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    totalDuration: { $sum: '$duration' },
                },
            },
            { $project: { _id: 0 } },
        ]);
        let reviewPercentageChange = 0;
        if (startDate && prevStartDate && prevEndDate) {
            const prevReviewMatch = {
                onReview: true,
                createdAt: { $gte: prevStartDate, $lt: prevEndDate },
            };
            const prevOnReviewStats = yield adModel_1.Ad.aggregate([
                { $match: prevReviewMatch },
                {
                    $group: {
                        _id: null,
                        totalAds: { $sum: 1 },
                    },
                },
                { $project: { _id: 0 } },
            ]);
            const currentOnReviews = ((_c = onReviewStats[0]) === null || _c === void 0 ? void 0 : _c.totalAds) || 0;
            const prevOnReviews = ((_d = prevOnReviewStats[0]) === null || _d === void 0 ? void 0 : _d.totalAds) || 0;
            if (prevOnReviews > 0) {
                reviewPercentageChange =
                    ((currentOnReviews - prevOnReviews) / prevOnReviews) * 100;
            }
            else if (currentOnReviews > 0) {
                reviewPercentageChange = 100;
            }
            else {
                reviewPercentageChange = 0;
            }
        }
        const reviewStatTimeSeries = yield adModel_1.Ad.aggregate([
            { $match: onReviewStage },
            {
                $group: {
                    _id: {
                        day: {
                            $dateToString: {
                                format: '%Y-%m-%d', // group by day
                                date: '$createdAt',
                            },
                        },
                    },
                    totalAds: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    totalDuration: { $sum: '$duration' },
                },
            },
            { $sort: { '_id.day': 1 } },
            {
                $project: {
                    _id: 0,
                    day: '$_id.day',
                    totalAds: 1,
                    totalAmount: 1,
                    totalDuration: 1,
                },
            },
        ]);
        //--------------EDITING STATS--------------//
        const isEditingStage = { isEditing: true, onReview: false };
        if (startDate)
            isEditingStage.createdAt = { $gte: startDate };
        if (username)
            isEditingStage.username = username;
        const isEditingStats = yield adModel_1.Ad.aggregate([
            { $match: isEditingStage },
            {
                $group: {
                    _id: null,
                    totalAds: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    totalDuration: { $sum: '$duration' },
                },
            },
            { $project: { _id: 0 } },
        ]);
        let editingPercentageChange = 0;
        if (startDate && prevStartDate && prevEndDate) {
            const prevEditMatch = {
                isEditing: true,
                createdAt: { $gte: prevStartDate, $lt: prevEndDate },
            };
            const prevIsEditingStats = yield adModel_1.Ad.aggregate([
                { $match: prevEditMatch },
                {
                    $group: {
                        _id: null,
                        totalAds: { $sum: 1 },
                    },
                },
                { $project: { _id: 0 } },
            ]);
            const currentIsEditing = ((_e = isEditingStats[0]) === null || _e === void 0 ? void 0 : _e.totalAds) || 0;
            const prevIsEditing = ((_f = prevIsEditingStats[0]) === null || _f === void 0 ? void 0 : _f.totalAds) || 0;
            if (prevIsEditing > 0) {
                editingPercentageChange =
                    ((currentIsEditing - prevIsEditing) / prevIsEditing) * 100;
            }
            else if (currentIsEditing > 0) {
                editingPercentageChange = 100;
            }
            else {
                editingPercentageChange = 0;
            }
        }
        const editingStatTimeSeries = yield adModel_1.Ad.aggregate([
            { $match: isEditingStage },
            {
                $group: {
                    _id: {
                        day: {
                            $dateToString: {
                                format: '%Y-%m-%d', // group by day
                                date: '$createdAt',
                            },
                        },
                    },
                    totalAds: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    totalDuration: { $sum: '$duration' },
                },
            },
            { $sort: { '_id.day': 1 } },
            {
                $project: {
                    _id: 0,
                    day: '$_id.day',
                    totalAds: 1,
                    totalAmount: 1,
                    totalDuration: 1,
                },
            },
        ]);
        //--------------ONLINE STATS--------------//
        const onlineStage = { online: true };
        if (startDate)
            onlineStage.createdAt = { $gte: startDate };
        if (username)
            onlineStage.username = username;
        const onlineStats = yield adModel_1.Ad.aggregate([
            { $match: onlineStage },
            {
                $group: {
                    _id: null,
                    totalAds: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    totalDuration: { $sum: '$duration' },
                },
            },
            { $project: { _id: 0 } },
        ]);
        let onlinePercentageChange = 0;
        if (startDate && prevStartDate && prevEndDate) {
            const prevEditMatch = {
                online: true,
                createdAt: { $gte: prevStartDate, $lt: prevEndDate },
            };
            const prevOnlineStats = yield adModel_1.Ad.aggregate([
                { $match: prevEditMatch },
                {
                    $group: {
                        _id: null,
                        totalAds: { $sum: 1 },
                    },
                },
                { $project: { _id: 0 } },
            ]);
            const currentOnline = ((_g = onlineStats[0]) === null || _g === void 0 ? void 0 : _g.totalAds) || 0;
            const prevOnline = ((_h = prevOnlineStats[0]) === null || _h === void 0 ? void 0 : _h.totalAds) || 0;
            if (prevOnline > 0) {
                onlinePercentageChange =
                    ((currentOnline - prevOnline) / prevOnline) * 100;
            }
            else if (currentOnline > 0) {
                onlinePercentageChange = 100;
            }
            else {
                onlinePercentageChange = 0;
            }
        }
        const onlineStatTimeSeries = yield adModel_1.Ad.aggregate([
            { $match: onlineStage },
            {
                $group: {
                    _id: {
                        day: {
                            $dateToString: {
                                format: '%Y-%m-%d', // group by day
                                date: '$createdAt',
                            },
                        },
                    },
                    totalAds: { $sum: 1 },
                    totalAmount: { $sum: '$amount' },
                    totalDuration: { $sum: '$duration' },
                },
            },
            { $sort: { '_id.day': 1 } },
            {
                $project: {
                    _id: 0,
                    day: '$_id.day',
                    totalAds: 1,
                    totalAmount: 1,
                    totalDuration: 1,
                },
            },
        ]);
        //--------------RESPONSE--------------//
        const mergedGraph = mergeTimeSeries(adStatTimeSeries, reviewStatTimeSeries, editingStatTimeSeries, onlineStatTimeSeries);
        res.status(200).json({
            result: {
                adStats: adStats[0] || {},
                onReview: onReviewStats[0] || {},
                isEditing: isEditingStats[0] || {},
                online: onlineStats[0] || {},
                adPercentageChange: percentageChange,
                reviewPercentageChange: reviewPercentageChange,
                editingPercentageChange: editingPercentageChange,
                onlinePercentageChange: onlinePercentageChange,
                currency: currency.currencySymbol,
                lineData: mergedGraph,
            },
        });
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getAdStats = getAdStats;
function mergeTimeSeries(ad, review, editing, online) {
    const map = {};
    ad.forEach(({ day, totalAds }) => {
        map[day] = Object.assign(Object.assign({}, (map[day] || { day })), { ads: totalAds });
    });
    review.forEach(({ day, totalAds }) => {
        map[day] = Object.assign(Object.assign({}, (map[day] || { day })), { reviews: totalAds });
    });
    editing.forEach(({ day, totalAds }) => {
        map[day] = Object.assign(Object.assign({}, (map[day] || { day })), { editing: totalAds });
    });
    online.forEach(({ day, totalAds }) => {
        map[day] = Object.assign(Object.assign({}, (map[day] || { day })), { online: totalAds });
    });
    // Fill missing series with 0
    Object.values(map).forEach((d) => {
        d.ads = d.ads || 0;
        d.reviews = d.reviews || 0;
        d.editing = d.editing || 0;
        d.online = d.online || 0;
    });
    return Object.values(map).sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
}
