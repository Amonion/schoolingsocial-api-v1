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
exports.deleteChats = exports.deleteChat = exports.addSearchedChats = exports.unSaveChats = exports.pinChats = exports.saveChats = exports.getSaveChats = exports.readChats = exports.getUserChats = exports.friendsChats = exports.searchFavChats = exports.searchChats = exports.createChat = void 0;
const chatModel_1 = require("../../models/users/chatModel");
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const fileUpload_1 = require("../../utils/fileUpload");
const app_1 = require("../../app");
const sendEmail_1 = require("../../utils/sendEmail");
const setConnectionKey = (id1, id2) => {
    const participants = [id1, id2].sort();
    return participants.join("");
};
const createChat = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = setConnectionKey(data.username, data.receiverUsername);
        const prev = yield chatModel_1.Chat.findOne({
            connection: connection,
        }).sort({ createdAt: -1 });
        data.connection = connection;
        const received = yield chatModel_1.Chat.findOne({
            receiverUsername: data.username,
            connection: connection,
        });
        data.isFriends = received ? true : false;
        if (data.isFriends) {
            yield chatModel_1.Chat.updateMany({ connection: connection }, { $set: { isFriends: true } });
        }
        const unreadReceiver = yield chatModel_1.Chat.countDocuments({
            connection: connection,
            receiverUsername: data.receiverUsername,
            isRead: false,
        });
        const unreadUser = yield chatModel_1.Chat.countDocuments({
            connection: connection,
            username: data.username,
            isRead: false,
        });
        data.unreadReceiver = unreadReceiver + 1;
        data.unreadUser = unreadUser;
        data.isSent = true;
        const sendCreatedChat = (post, isFriends, totalUnread) => {
            app_1.io.emit(`createdChat${connection}`, {
                key: connection,
                data: post,
            });
            app_1.io.emit(`createdChat${data.username}`, {
                key: connection,
                data: post,
                message: data.action === "online" ? "online" : "",
                totalUnread: totalUnread,
            });
            if (isFriends) {
                app_1.io.emit(`createdChat${data.receiverUsername}`, {
                    key: connection,
                    data: post,
                    message: data.action === "online" ? "online" : "",
                    totalUnread: totalUnread,
                });
            }
        };
        if (prev) {
            const lastTime = new Date(prev.createdAt).getTime();
            const lastReceiverTime = new Date(prev.receiverTime).getTime();
            const currentTime = new Date().getTime();
            const receiverTime = new Date(currentTime - lastTime + lastReceiverTime);
            data.receiverTime = receiverTime;
            const post = yield chatModel_1.Chat.create(data);
            const totalUread = yield chatModel_1.Chat.countDocuments({
                isRead: false,
                isFriends: true,
                receiverUsername: data.receiverUsername,
            });
            sendCreatedChat(post, data.isFriends, totalUread);
        }
        else {
            const post = yield chatModel_1.Chat.create(data);
            sendCreatedChat(post, false);
            const newNotification = yield (0, sendEmail_1.sendNotification)("friend_request", data);
            app_1.io.emit(data.receiverUsername, newNotification);
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.createChat = createChat;
const searchChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchTerm = String(req.query.word || "").trim();
        const connection = String(req.query.connection || "").trim();
        const username = String(req.query.username || "").trim();
        if (!searchTerm) {
            return res.status(400).json({ message: "Search term is required" });
        }
        const regex = new RegExp(searchTerm, "i");
        const result = yield chatModel_1.Chat.find({
            connection,
            deletedUsername: { $ne: username },
            $or: [
                { content: { $regex: regex } },
                { "media.name": { $regex: regex } },
            ],
        })
            .select({ _id: 1, content: 1, "media.name": 1 })
            .sort({ createdAt: -1 })
            .limit(100);
        res.status(200).json({ results: result });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.searchChats = searchChats;
const searchFavChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchTerm = String(req.query.word || "").trim();
        const connection = String(req.query.connection || "").trim();
        const username = String(req.query.username || "").trim();
        if (!searchTerm) {
            return res.status(400).json({ message: "Search term is required" });
        }
        const regex = new RegExp(searchTerm, "i");
        const result = yield chatModel_1.Chat.find({
            connection,
            deletedUsername: { $ne: username },
            isSavedUsernames: { $in: username },
            $or: [
                { content: { $regex: regex } },
                { "media.name": { $regex: regex } },
            ],
        })
            .select({ _id: 1, content: 1, "media.name": 1 })
            .sort({ createdAt: -1 })
            .limit(100);
        res.status(200).json({ results: result });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.searchFavChats = searchFavChats;
const friendsChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = String(req.query.username || "").trim();
        const accountUsername = String(req.query.accountUsername || "").trim();
        const result = yield chatModel_1.Chat.aggregate([
            {
                $match: {
                    deletedUsername: { $nin: [username, accountUsername] },
                    connection: {
                        $in: [new RegExp(username, "i"), new RegExp(accountUsername, "i")],
                    },
                    $or: [
                        { isFriends: true },
                        { username: username },
                        { username: accountUsername },
                    ],
                },
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $group: {
                    _id: "$connection",
                    doc: { $first: "$$ROOT" },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ["$isRead", false] },
                                        {
                                            $or: [
                                                { $eq: ["$receiverUsername", username] },
                                                { $eq: ["$receiverUsername", accountUsername] },
                                            ],
                                        },
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
            {
                $addFields: {
                    "doc.unreadCount": "$unreadCount",
                },
            },
            {
                $replaceRoot: { newRoot: "$doc" },
            },
            {
                $project: {
                    _id: 1,
                    content: 1,
                    createdAt: 1,
                    picture: 1,
                    username: 1,
                    from: 1,
                    connection: 1,
                    receiverPicture: 1,
                    receiverId: 1,
                    unread: 1,
                    userId: 1,
                    receiverUsername: 1,
                    unreadCount: 1,
                },
            },
            {
                $limit: 10,
            },
        ]);
        const totalUnread = yield chatModel_1.Chat.countDocuments({
            isRead: false,
            isFriends: true,
            receiverUsername: username,
        });
        res.status(200).json({ results: result, totalUnread: totalUnread });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.friendsChats = friendsChats;
const getUserChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = req.query.username;
        delete req.query.username;
        const result = yield (0, query_1.queryData)(chatModel_1.Chat, req);
        const unread = yield chatModel_1.Chat.countDocuments({
            connection: req.query.connection,
            isRead: false,
            receiverUsername: username,
        });
        res.status(200).json({
            count: result.count,
            results: result.results,
            unread: unread,
            page: result.page,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getUserChats = getUserChats;
const readChats = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = setConnectionKey(data.username, data.receiverUsername);
        yield chatModel_1.Chat.updateMany({ _id: { $in: data.ids } }, { $set: { isRead: true } });
        const updatedChats = yield chatModel_1.Chat.find({ _id: { $in: data.ids } });
        const unreadCount = yield chatModel_1.Chat.countDocuments({
            connection: connection,
            isRead: false,
            isFriends: true,
            receiverUsername: data.username,
        });
        const unreadCount1 = yield chatModel_1.Chat.countDocuments({
            connection: connection,
            isRead: false,
            isFriends: true,
            receiverUsername: data.receiverUsername,
        });
        const totalUnread = yield chatModel_1.Chat.countDocuments({
            isRead: false,
            isFriends: true,
            receiverUsername: data.username,
        });
        const totalUnread1 = yield chatModel_1.Chat.countDocuments({
            isRead: false,
            isFriends: true,
            receiverUsername: data.receiverUsername,
        });
        app_1.io.emit(`readChat${data.username}`, {
            chats: updatedChats,
            totalUnread: totalUnread,
            username: data.username,
            unreadCount: unreadCount,
        });
        app_1.io.emit(`readChat${data.receiverUsername}`, {
            chats: updatedChats,
            totalUnread: totalUnread1,
            receiverUsername: data.receiverUsername,
            unreadCount: unreadCount1,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.readChats = readChats;
const getSaveChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(chatModel_1.Chat, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getSaveChats = getSaveChats;
const saveChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = JSON.parse(req.body.selectedItems);
        const username = req.body.username;
        const chatIds = chats.map((chat) => chat._id);
        yield chatModel_1.Chat.updateMany({ _id: { $in: chatIds } }, { $addToSet: { isSavedUsernames: username } });
        const updatedChats = yield chatModel_1.Chat.find({ _id: { $in: chatIds } });
        res.status(200).json({
            results: updatedChats,
            message: "The chats have been saved to your favorites",
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.saveChats = saveChats;
const pinChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = JSON.parse(req.body.selectedItems);
        const userId = req.body.userId;
        const chatIds = chats.map((chat) => chat._id);
        yield chatModel_1.Chat.updateMany({ _id: { $in: chatIds } }, { $addToSet: { isSavedIds: userId } });
        const updatedChats = yield chatModel_1.Chat.find({ _id: { $in: chatIds } });
        res.status(200).json({
            results: updatedChats,
            message: "The chats have been saved to your favorites",
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.pinChats = pinChats;
const unSaveChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = JSON.parse(req.body.selectedItems);
        const username = req.body.username;
        const chatIds = chats.map((chat) => chat._id);
        yield chatModel_1.Chat.updateMany({ _id: { $in: chatIds } }, { $pull: { isSavedUsernames: username } });
        const updatedChats = yield chatModel_1.Chat.find({ _id: { $in: chatIds } });
        res.status(200).json({
            results: updatedChats,
            message: "The chats have been removed to your favorites",
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.unSaveChats = unSaveChats;
const addSearchedChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.chatId;
        const maxDate = Number(req.query.oldest);
        const item = yield chatModel_1.Chat.findById(id);
        if (!item) {
            return res.status(400).json({ message: "Item not found in database." });
        }
        const minDate = item.time;
        const chats = yield chatModel_1.Chat.find({
            time: {
                $gte: minDate,
                $lt: maxDate,
            },
        });
        res.status(200).json({ results: chats });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.addSearchedChats = addSearchedChats;
const deleteChat = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (data.isSender) {
            const item = yield chatModel_1.Chat.findById(data.id);
            if (!item) {
                return { message: "This post has been deleted" };
            }
            if (item.media.length > 0) {
                for (let i = 0; i < item.media.length; i++) {
                    const el = item.media[i];
                    (0, fileUpload_1.deleteFileFromS3)(el.source);
                }
            }
            yield chatModel_1.Chat.findByIdAndDelete(data.id);
            app_1.io.emit(`deleteResponse${data.receiverUsername}`, {
                id: data.id,
                day: data.day,
            });
        }
        else {
            yield chatModel_1.Chat.findByIdAndUpdate(data.id, { deletedUsername: data.username });
        }
        app_1.io.emit(`deleteResponse${data.username}`, {
            id: data.id,
            day: data.day,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteChat = deleteChat;
const deleteChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = req.body;
        const senderUsername = req.query.senderUsername;
        for (let i = 0; i < chats.length; i++) {
            const el = chats[i];
            const isSender = el.username === senderUsername ? true : false;
            if (isSender) {
                if (el.media.length > 0) {
                    for (let i = 0; i < el.media.length; i++) {
                        const item = el.media[i];
                        (0, fileUpload_1.deleteFileFromS3)(item.source);
                    }
                }
                yield chatModel_1.Chat.findByIdAndDelete(el._id);
            }
            else {
                yield chatModel_1.Chat.findByIdAndUpdate(el._id, {
                    deletedUsername: senderUsername,
                });
            }
        }
        const results = chats.map((item) => item._id);
        res.status(200).json({
            results,
            message: "Chats deleted successfully.",
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.deleteChats = deleteChats;
