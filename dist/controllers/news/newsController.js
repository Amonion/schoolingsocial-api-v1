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
exports.processNews = exports.searchNews = exports.getInitialNews = exports.deleteNews = exports.updateNewsViews = exports.updateNews = exports.toggleSaveNews = exports.toggleLikeNews = exports.getNewsFeed = exports.getNews = exports.massDeleteNews = exports.getNewsById = exports.createNews = void 0;
const newsModel_1 = require("../../models/place/newsModel");
const query_1 = require("../../utils/query");
const errorHandler_1 = require("../../utils/errorHandler");
const computation_1 = require("../../utils/computation");
const statModel_1 = require("../../models/users/statModel");
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
const getNewsFeed = (_a) => __awaiter(void 0, [_a], void 0, function* ({ country, state, limit = 20, isFeatured, isMain, skip = 0, }) {
    const buildMatch = (priority, extra) => {
        const baseMatch = Object.assign({ priority: { $regex: new RegExp(`^${priority}$`, 'i') }, isPublished: true }, extra);
        if (isFeatured || isMain) {
            const orConditions = [];
            if (isFeatured)
                orConditions.push({ isFeatured: true });
            if (isMain)
                orConditions.push({ isMain: true });
            baseMatch.$or = orConditions;
        }
        return baseMatch;
    };
    const facets = {
        international: [
            { $match: buildMatch('international') },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
        ],
    };
    if (country) {
        facets.national = [
            {
                $match: buildMatch('national', {
                    country: { $regex: new RegExp(`^${country}$`, 'i') },
                }),
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
        ];
    }
    if (state) {
        facets.local = [
            {
                $match: buildMatch('local', {
                    state: { $regex: new RegExp(`^${state}$`, 'i') },
                }),
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
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
    ];
    const news = yield newsModel_1.News.aggregate(pipeline);
    return news;
});
exports.getNewsFeed = getNewsFeed;
const toggleLikeNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, id } = req.body;
        let score = 0;
        const news = yield newsModel_1.News.findById(id);
        if (!news) {
            return res.status(404).json({ message: 'news not found' });
        }
        const like = yield statModel_1.Like.findOne({ postId: id, userId });
        if (like) {
            yield statModel_1.Like.deleteOne({ postId: id, userId });
            score = Math.max(0, news.score - 2);
            yield newsModel_1.News.updateOne({ _id: id }, [
                {
                    $set: {
                        likes: { $max: [{ $subtract: ['$likes', 1] }, 0] },
                        score: score,
                    },
                },
            ]);
        }
        else {
            score = (0, computation_1.postScore)('likes', news.score);
            yield statModel_1.Like.create({ postId: id, userId });
            yield newsModel_1.News.updateOne({ _id: id }, [
                {
                    $set: {
                        likes: { $add: ['$likes', 1] },
                        score: score,
                    },
                },
            ]);
        }
        yield newsModel_1.News.updateOne({ _id: news._id }, {
            $set: { score: score },
        });
        return res.status(200).json({ message: null });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.toggleLikeNews = toggleLikeNews;
const toggleSaveNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, id } = req.body;
        let score = 0;
        const news = yield newsModel_1.News.findById(id);
        if (!news) {
            return res.status(404).json({ message: 'news not found' });
        }
        const save = yield statModel_1.Bookmark.findOne({ postId: id, userId });
        if (save) {
            yield statModel_1.Bookmark.deleteOne({ postId: id, userId });
            score = Math.max(0, news.score - 5);
            yield newsModel_1.News.updateOne({ _id: id }, [
                {
                    $set: {
                        bookmarks: { $max: [{ $subtract: ['$bookmarks', 1] }, 0] },
                        score: score,
                    },
                },
            ]);
        }
        else {
            score = (0, computation_1.postScore)('bookmarks', news.score);
            yield statModel_1.Bookmark.create({ postId: id, userId });
            yield newsModel_1.News.updateOne({ _id: id }, [
                {
                    $set: {
                        bookmarks: { $add: ['$bookmarks', 1] },
                        score: score,
                    },
                },
            ]);
        }
        yield newsModel_1.News.updateOne({ _id: news._id }, {
            $set: { score: score },
        });
        return res.status(200).json({ message: null });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.toggleSaveNews = toggleSaveNews;
const updateNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.updateItem)(req, res, newsModel_1.News, ['picture', 'video'], ['News not found', 'News was updated successfully']);
});
exports.updateNews = updateNews;
const updateNewsViews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, id } = req.body;
        let updateQuery = {};
        const view = yield statModel_1.View.findOne({ userId: userId, postId: id });
        if (view) {
            return res.status(200).json();
        }
        const news = yield newsModel_1.News.findOne({
            _id: id,
        });
        if (!news) {
            return res.status(200).json();
        }
        const score = (0, computation_1.postScore)('views', news.score);
        yield newsModel_1.News.updateOne({ _id: news._id }, {
            $set: { score: score },
        });
        if (!view) {
            updateQuery.$inc = { views: 1 };
            yield statModel_1.View.create({ userId: userId, postId: news._id });
            yield newsModel_1.News.findByIdAndUpdate(news._id, updateQuery, {
                new: true,
            });
        }
        return res.status(200).json({ message: null });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateNewsViews = updateNewsViews;
const deleteNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, newsModel_1.News, ['picture', 'video'], 'News not found');
});
exports.deleteNews = deleteNews;
const getInitialNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const country = String(req.query.country || '');
        const state = String(req.query.state || '');
        const limit = parseInt(req.query.page_size, 10) || 20;
        const skip = parseInt(req.query.page, 10) || 0;
        const news = yield (0, exports.getNewsFeed)({ country, state, limit, skip });
        const results = yield (0, exports.processNews)(news, String(req.query.userId));
        res.status(200).json({ results });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});
exports.getInitialNews = getInitialNews;
const searchNews = (req, res) => {
    return (0, query_1.search)(newsModel_1.News, req, res);
};
exports.searchNews = searchNews;
const processNews = (news, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const newsIds = news.map((item) => item._id);
    const likedNews = yield statModel_1.Like.find({
        userId: userId,
        postId: { $in: newsIds },
    }).select('postId');
    const bookmarkedPosts = yield statModel_1.Bookmark.find({
        userId: userId,
        postId: { $in: newsIds },
    }).select('postId');
    const viewedNews = yield statModel_1.View.find({
        userId: userId,
        postId: { $in: newsIds },
    }).select('postId');
    const likedPostIds = likedNews.map((like) => like.postId.toString());
    const bookmarkedPostIds = bookmarkedPosts.map((bookmark) => bookmark.postId.toString());
    const viewedPostIds = viewedNews.map((view) => view.postId.toString());
    const updatedPosts = [];
    for (let i = 0; i < news.length; i++) {
        const el = news[i];
        if (likedPostIds && likedPostIds.includes(el._id.toString())) {
            el.liked = true;
        }
        if (bookmarkedPostIds && bookmarkedPostIds.includes(el._id.toString())) {
            el.bookmarked = true;
        }
        if (viewedPostIds && viewedPostIds.includes(el._id.toString())) {
            el.viewed = true;
        }
        updatedPosts.push(el);
    }
    const results = updatedPosts;
    return results;
});
exports.processNews = processNews;
