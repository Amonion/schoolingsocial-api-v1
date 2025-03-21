"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTrendingScore = exports.postScore = void 0;
const postScore = (likes, comments, shares, bookmarks, views) => {
    return likes * 2 + comments * 3 + shares * 4 + bookmarks * 5 + views * 0.5;
};
exports.postScore = postScore;
const calculateTrendingScore = (post) => {
    const postAgeInHours = (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60);
    return ((post.likes * 2 +
        post.comments * 3 +
        post.shares * 4 +
        post.bookmarks * 5 +
        post.views * 0.5) /
        Math.pow(1 + postAgeInHours, 1.5));
};
exports.calculateTrendingScore = calculateTrendingScore;
