"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postScore = void 0;
const postScore = (likes, comments, shares, bookmarks, views, following) => {
    return (likes * 2 +
        comments * 3 +
        shares * 4 +
        bookmarks * 5 +
        views * 0.5 +
        following * 10);
};
exports.postScore = postScore;
