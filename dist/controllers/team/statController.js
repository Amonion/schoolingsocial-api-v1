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
exports.getUsersStat = exports.updateVisit = void 0;
const usersStatMode_1 = require("../../models/users/usersStatMode");
const app_1 = require("../../app");
const userModel_1 = require("../../models/users/userModel");
const chatModel_1 = require("../../models/users/chatModel");
const errorHandler_1 = require("../../utils/errorHandler");
const date_fns_1 = require("date-fns");
const updateVisit = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const visitor = yield usersStatMode_1.UserStat.findOne({
        $or: [
            { _id: data.userId, online: true },
            { ip: data.ip, online: true },
        ],
    });
    if (!visitor) {
        yield usersStatMode_1.UserStat.findOneAndUpdate({
            $or: [{ _id: data.userId }, { username: data.username }],
        }, {
            $set: {
                visitedAt: new Date(),
                online: true,
                ip: data.ip,
                country: data.country,
                countryCode: data.countryCode,
                username: data.username,
                bioId: data.bioId,
                userId: data.userId,
            },
        }, {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true,
        });
        if (data.userId) {
            yield userModel_1.User.findByIdAndUpdate(data.userId, {
                visitedAt: data.visitedAt,
                online: true,
            });
            const chats = yield chatModel_1.Chat.find({
                connection: { $regex: data.userId },
            });
            for (let i = 0; i < chats.length; i++) {
                const el = chats[i];
                app_1.io.emit(el.connection, { action: "visit" });
            }
        }
        app_1.io.emit("team", { action: "visit", type: "stat" });
    }
});
exports.updateVisit = updateVisit;
const getUsersStat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const now = new Date();
        const currentMonthStart = (0, date_fns_1.startOfMonth)(now);
        const lastMonthStart = (0, date_fns_1.startOfMonth)((0, date_fns_1.subMonths)(now, 1));
        const onlineUsers = yield usersStatMode_1.UserStat.countDocuments({ online: true });
        const verifyingUsers = yield userModel_1.User.countDocuments({
            isOnVerification: true,
        });
        const totalUsers = yield userModel_1.User.countDocuments();
        const thisMonthOnline = yield usersStatMode_1.UserStat.countDocuments({
            online: true,
            createdAt: { $gte: currentMonthStart },
        });
        const thisMonthOnVerification = yield userModel_1.User.countDocuments({
            isOnVerification: true,
            verifyingAt: { $gte: currentMonthStart },
        });
        const thisMonthUsers = yield userModel_1.User.countDocuments({
            createdAt: { $gte: currentMonthStart },
        });
        const lastMonthOnline = yield usersStatMode_1.UserStat.countDocuments({
            online: true,
            createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
        });
        const lastMonthOnVerification = yield userModel_1.User.countDocuments({
            isOnVerification: true,
            verifyingAt: { $gte: lastMonthStart, $lt: currentMonthStart },
        });
        const lastMonthUsers = yield userModel_1.User.countDocuments({
            createdAt: { $gte: lastMonthStart, $lt: currentMonthStart },
        });
        let onlineIncrease = 0;
        if (lastMonthOnline > 0) {
            onlineIncrease =
                ((thisMonthOnline - lastMonthOnline) / lastMonthOnline) * 100;
        }
        else if (thisMonthOnline > 0) {
            onlineIncrease = 100;
        }
        let verificationIncrease = 0;
        if (lastMonthOnVerification > 0) {
            verificationIncrease =
                ((thisMonthOnVerification - lastMonthOnVerification) /
                    lastMonthOnVerification) *
                    100;
        }
        else if (thisMonthOnVerification > 0) {
            verificationIncrease = 100;
        }
        let totalUsersIncrease = 0;
        if (lastMonthUsers > 0) {
            totalUsersIncrease =
                ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100;
        }
        else if (thisMonthUsers > 0) {
            totalUsersIncrease = 100;
        }
        res.status(200).json({
            onlineUsers,
            onlineIncrease,
            verifyingUsers,
            verificationIncrease,
            totalUsers,
            totalUsersIncrease,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getUsersStat = getUsersStat;
