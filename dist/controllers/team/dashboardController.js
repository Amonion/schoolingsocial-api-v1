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
exports.getAdStats = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const computation_1 = require("../../utils/computation");
const adModel_1 = require("../../models/utility/adModel");
const getAdStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    try {
        const period = req.query.period || 'all';
        const { startDate, prevStartDate, prevEndDate } = period !== 'all'
            ? (0, computation_1.getPeriodRange)(period)
            : { startDate: null, prevStartDate: null, prevEndDate: null };
        //--------------AD STATS--------------//
        const matchStage = {};
        if (startDate)
            matchStage.createdAt = { $gte: startDate };
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
        let percentageChange = null;
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
        //--------------REVIEW STATS--------------//
        const onReviewStage = { onReview: true };
        if (startDate)
            onReviewStage.createdAt = { $gte: startDate };
        const onReviewStats = yield adModel_1.Ad.aggregate([
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
        let reviewPercentageChange = null;
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
        //--------------EDITING STATS--------------//
        const isEditingStage = { isEditing: true };
        if (startDate)
            isEditingStage.createdAt = { $gte: startDate };
        const isEditingStats = yield adModel_1.Ad.aggregate([
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
        let editingPercentageChange = null;
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
        //--------------ONLINE STATS--------------//
        const onlineStage = { online: true };
        if (startDate)
            onlineStage.createdAt = { $gte: startDate };
        const onlineStats = yield adModel_1.Ad.aggregate([
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
        let onlinePercentageChange = null;
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
        //--------------RESPONSE--------------//
        res.status(200).json({
            result: {
                ads: adStats[0] || {},
                onReview: onReviewStats[0] || {},
                isEditing: isEditingStats[0] || {},
                online: onlineStats[0] || {},
                adPercentageChange: percentageChange,
                reviewPercentageChange: reviewPercentageChange,
                editingPercentageChange: editingPercentageChange,
                onlinePercentageChange: onlinePercentageChange,
            },
        });
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getAdStats = getAdStats;
