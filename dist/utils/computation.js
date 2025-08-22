"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPeriodRange = exports.calculateTrendingScore = exports.postScore = void 0;
const postScore = (likes, comments, shares, bookmarks, reposts, views) => {
    return (likes * 2 +
        comments * 3 +
        shares * 4 +
        bookmarks * 5 +
        reposts * 6 +
        views * 0.5);
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
const getPeriodRange = (period) => {
    const now = new Date();
    let startDate = null;
    let prevStartDate = null;
    let prevEndDate = null;
    switch (period) {
        case 'week': {
            // Start of this week (Monday as first day)
            startDate = new Date(now);
            const day = startDate.getDay(); // Sunday=0, Monday=1...
            const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
            startDate.setDate(diff);
            startDate.setHours(0, 0, 0, 0);
            prevEndDate = new Date(startDate);
            prevStartDate = new Date(prevEndDate);
            prevStartDate.setDate(prevStartDate.getDate() - 7);
            break;
        }
        case 'month': {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            prevEndDate = new Date(startDate);
            prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            break;
        }
        case 'year': {
            startDate = new Date(now.getFullYear(), 0, 1);
            prevEndDate = new Date(startDate);
            prevStartDate = new Date(now.getFullYear() - 1, 0, 1);
            break;
        }
        default:
            startDate = new Date(0);
    }
    return { startDate, prevStartDate, prevEndDate };
};
exports.getPeriodRange = getPeriodRange;
// export const getPeriodRange = (period: string) => {
//   const now = new Date()
//   let startDate: Date = new Date(0)
//   let prevStartDate: Date = new Date(0)
//   let prevEndDate: Date = new Date(0)
//   switch (period) {
//     case 'week': {
//       // Start of this week (Monday as first day)
//       startDate = new Date(now)
//       const day = startDate.getDay() // Sunday=0, Monday=1...
//       const diff = startDate.getDate() - day + (day === 0 ? -6 : 1)
//       startDate.setDate(diff)
//       startDate.setHours(0, 0, 0, 0)
//       prevEndDate = new Date(startDate)
//       prevStartDate = new Date(prevEndDate)
//       prevStartDate.setDate(prevStartDate.getDate() - 7)
//       break
//     }
//     case 'month': {
//       startDate = new Date(now.getFullYear(), now.getMonth(), 1)
//       prevEndDate = new Date(startDate)
//       prevStartDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
//       break
//     }
//     case 'year': {
//       startDate = new Date(now.getFullYear(), 0, 1)
//       prevEndDate = new Date(startDate)
//       prevStartDate = new Date(now.getFullYear() - 1, 0, 1)
//       break
//     }
//     default:
//       startDate = new Date(0)
//       prevStartDate = new Date(0)
//       prevEndDate = new Date(0)
//   }
//   return { startDate, prevStartDate, prevEndDate }
// }
