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
exports.getPostStats = void 0;
const postModel_1 = require("../../models/users/postModel");
const errorHandler_1 = require("../../utils/errorHandler");
const getPostStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const period = req.query.period || 'all';
        const username = req.query.username || null;
        let matchStage = {};
        let startDate = null;
        let prevStartDate = null;
        let prevEndDate = null;
        //--------------POST STATS--------------//
        if (period !== 'all') {
            const now = new Date();
            switch (period) {
                case 'week':
                    startDate = new Date();
                    startDate.setDate(now.getDate() - 7);
                    prevEndDate = new Date(startDate);
                    prevStartDate = new Date();
                    prevStartDate.setDate(prevEndDate.getDate() - 7);
                    break;
                case 'month':
                    startDate = new Date();
                    startDate.setDate(now.getDate() - 30);
                    prevEndDate = new Date(startDate);
                    prevStartDate = new Date();
                    prevStartDate.setDate(prevEndDate.getDate() - 30);
                    break;
                case 'year':
                    startDate = new Date();
                    startDate.setDate(now.getDate() - 365);
                    prevEndDate = new Date(startDate);
                    prevStartDate = new Date();
                    prevStartDate.setDate(prevEndDate.getDate() - 365);
                    break;
                default:
                    startDate = new Date(0);
            }
            matchStage.createdAt = { $gte: startDate };
        }
        if (username) {
            matchStage.username = username;
        }
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
        let percentageChange = null;
        if (startDate && prevStartDate && prevEndDate) {
            const prevMatch = {
                createdAt: { $gte: prevStartDate, $lt: prevEndDate },
            };
            if (username) {
                prevMatch.username = username;
            }
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
                percentageChange = 100; // Infinite growth from zero
            }
            else {
                percentageChange = 0; // No change
            }
        }
        //**************POST STATS*************//
        //--------------COMMENT STATS--------------//
        let commentMatchStage = { postType: 'comment' };
        let commentStartDate = null;
        let commentPrevStartDate = null;
        let commentPrevEndDate = null;
        if (period !== 'all') {
            const now = new Date();
            switch (period) {
                case 'week':
                    commentStartDate = new Date();
                    commentStartDate.setDate(now.getDate() - 7);
                    commentPrevEndDate = new Date(commentStartDate);
                    commentPrevStartDate = new Date();
                    commentPrevStartDate.setDate(commentPrevEndDate.getDate() - 7);
                    break;
                case 'month':
                    commentStartDate = new Date();
                    commentStartDate.setDate(now.getDate() - 30);
                    commentPrevEndDate = new Date(commentStartDate);
                    commentPrevStartDate = new Date();
                    commentPrevStartDate.setDate(commentPrevEndDate.getDate() - 30);
                    break;
                case 'year':
                    commentStartDate = new Date();
                    commentStartDate.setDate(now.getDate() - 365);
                    commentPrevEndDate = new Date(commentStartDate);
                    commentPrevStartDate = new Date();
                    commentPrevStartDate.setDate(commentPrevEndDate.getDate() - 365);
                    break;
                default:
                    commentStartDate = new Date(0);
            }
            commentMatchStage.createdAt = { $gte: commentStartDate };
        }
        if (username) {
            commentMatchStage.username = username;
        }
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
        let commentPercentageChange = null;
        if (commentStartDate && commentPrevStartDate && commentPrevEndDate) {
            const prevCommentMatch = {
                postType: 'comment',
                createdAt: { $gte: commentPrevStartDate, $lt: commentPrevEndDate },
            };
            if (username) {
                prevCommentMatch.username = username;
            }
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
                commentPercentageChange = 100; // Infinite growth from zero
            }
            else {
                commentPercentageChange = 0; // No change
            }
        }
        //**************COMMENT STATS*************//
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
