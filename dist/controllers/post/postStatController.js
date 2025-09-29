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
exports.getAdStats1 = exports.getPostStats = void 0;
const postModel_1 = require("../../models/post/postModel");
const errorHandler_1 = require("../../utils/errorHandler");
const computation_1 = require("../../utils/computation");
const adModel_1 = require("../../models/place/adModel");
const getPostStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const period = req.query.period || 'all';
        const username = req.query.username || null;
        const { startDate, prevStartDate, prevEndDate } = period !== 'all'
            ? (0, computation_1.getPeriodRange)(period)
            : { startDate: null, prevStartDate: null, prevEndDate: null };
        //--------------POST STATS--------------//
        const matchStage = {};
        if (startDate)
            matchStage.createdAt = { $gte: startDate };
        if (username)
            matchStage.username = username;
        matchStage.postType = 'main';
        const postStats = yield postModel_1.Post.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: null,
                    totalPosts: { $sum: 1 },
                    totalLikes: { $sum: '$likes' },
                    totalReplies: { $sum: '$replies' },
                    totalBookmarks: { $sum: '$bookmarks' },
                    totalViews: { $sum: '$views' },
                    totalShares: { $sum: '$shares' },
                },
            },
            { $project: { _id: 0 } },
        ]);
        let percentageChange = 0;
        if (startDate && prevStartDate && prevEndDate) {
            const prevMatch = {
                createdAt: { $gte: prevStartDate, $lt: prevEndDate },
            };
            if (username)
                prevMatch.username = username;
            const prevStats = yield postModel_1.Post.aggregate([
                { $match: prevMatch },
                {
                    $group: {
                        _id: null,
                        totalPosts: { $sum: 1 },
                    },
                },
                { $project: { _id: 0 } },
            ]);
            const currentPosts = ((_a = postStats[0]) === null || _a === void 0 ? void 0 : _a.totalPosts) || 0;
            const prevPosts = ((_b = prevStats[0]) === null || _b === void 0 ? void 0 : _b.totalPosts) || 0;
            if (prevPosts > 0) {
                percentageChange = ((currentPosts - prevPosts) / prevPosts) * 100;
            }
            else if (currentPosts > 0) {
                percentageChange = 100;
            }
            else {
                percentageChange = 0;
            }
        }
        //--------------COMMENT STATS--------------//
        const commentMatchStage = { postType: 'comment' };
        if (startDate)
            commentMatchStage.createdAt = { $gte: startDate };
        if (username)
            commentMatchStage.username = username;
        const commentStats = yield postModel_1.Post.aggregate([
            { $match: commentMatchStage },
            {
                $group: {
                    _id: null,
                    totalComments: { $sum: 1 },
                    totalLikes: { $sum: '$likes' },
                    totalHates: { $sum: '$hates' },
                    totalReplies: { $sum: '$replies' },
                },
            },
            { $project: { _id: 0 } },
        ]);
        let commentPercentageChange = 0;
        if (startDate && prevStartDate && prevEndDate) {
            const prevCommentMatch = {
                postType: 'comment',
                createdAt: { $gte: prevStartDate, $lt: prevEndDate },
            };
            if (username)
                prevCommentMatch.username = username;
            const prevCommentStats = yield postModel_1.Post.aggregate([
                { $match: prevCommentMatch },
                {
                    $group: {
                        _id: null,
                        totalComments: { $sum: 1 },
                    },
                },
                { $project: { _id: 0 } },
            ]);
            const currentComments = ((_c = commentStats[0]) === null || _c === void 0 ? void 0 : _c.totalComments) || 0;
            const prevComments = ((_d = prevCommentStats[0]) === null || _d === void 0 ? void 0 : _d.totalComments) || 0;
            if (prevComments > 0) {
                commentPercentageChange =
                    ((currentComments - prevComments) / prevComments) * 100;
            }
            else if (currentComments > 0) {
                commentPercentageChange = 100;
            }
            else {
                commentPercentageChange = 0;
            }
        }
        //--------------RESPONSE--------------//
        res.status(200).json({
            message: 'Post stats retrieved successfully',
            result: {
                post: postStats[0] || {},
                comment: commentStats[0] || {},
                postChangePercentage: percentageChange,
                commentPercentageChange: commentPercentageChange,
            },
        });
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getPostStats = getPostStats;
const getAdStats1 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const period = req.query.period || 'all';
        const username = req.query.username || null;
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
        let percentageChange = null;
        if (startDate && prevStartDate && prevEndDate) {
            const prevMatch = {
                createdAt: { $gte: prevStartDate, $lt: prevEndDate },
            };
            if (username)
                prevMatch.username = username;
            const prevStats = yield postModel_1.Post.aggregate([
                { $match: prevMatch },
                {
                    $group: {
                        _id: null,
                        totalAds: { $sum: 1 },
                    },
                },
                { $project: { _id: 0 } },
            ]);
            const currentPosts = ((_a = adStats[0]) === null || _a === void 0 ? void 0 : _a.totalAds) || 0;
            const prevAds = ((_b = prevStats[0]) === null || _b === void 0 ? void 0 : _b.totalAds) || 0;
            if (prevAds > 0) {
                percentageChange = ((currentPosts - prevAds) / prevAds) * 100;
            }
            else if (currentPosts > 0) {
                percentageChange = 100;
            }
            else {
                percentageChange = 0;
            }
        }
        //--------------COMMENT STATS--------------//
        const onReviewStage = { onReview: true };
        if (startDate)
            onReviewStage.createdAt = { $gte: startDate };
        if (username)
            onReviewStage.username = username;
        const commentStats = yield postModel_1.Post.aggregate([
            { $match: onReviewStage },
            {
                $group: {
                    _id: null,
                    totalComments: { $sum: 1 },
                    totalLikes: { $sum: '$likes' },
                    totalHates: { $sum: '$hates' },
                    totalReplies: { $sum: '$replies' },
                },
            },
            { $project: { _id: 0 } },
        ]);
        let commentPercentageChange = null;
        if (startDate && prevStartDate && prevEndDate) {
            const prevCommentMatch = {
                postType: 'comment',
                createdAt: { $gte: prevStartDate, $lt: prevEndDate },
            };
            if (username)
                prevCommentMatch.username = username;
            const prevCommentStats = yield postModel_1.Post.aggregate([
                { $match: prevCommentMatch },
                {
                    $group: {
                        _id: null,
                        totalComments: { $sum: 1 },
                    },
                },
                { $project: { _id: 0 } },
            ]);
            const currentComments = ((_c = commentStats[0]) === null || _c === void 0 ? void 0 : _c.totalComments) || 0;
            const prevComments = ((_d = prevCommentStats[0]) === null || _d === void 0 ? void 0 : _d.totalComments) || 0;
            if (prevComments > 0) {
                commentPercentageChange =
                    ((currentComments - prevComments) / prevComments) * 100;
            }
            else if (currentComments > 0) {
                commentPercentageChange = 100;
            }
            else {
                commentPercentageChange = 0;
            }
        }
        //--------------RESPONSE--------------//
        res.status(200).json({
            message: 'Post stats retrieved successfully',
            result: {
                post: adStats[0] || {},
                comment: commentStats[0] || {},
                postChangePercentage: percentageChange,
                commentPercentageChange: commentPercentageChange,
            },
        });
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getAdStats1 = getAdStats1;
