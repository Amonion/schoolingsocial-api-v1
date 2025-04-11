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
exports.deleteChats = exports.deleteChat = exports.addSearchedChats = exports.readChats = exports.getUserChats = exports.friendsChats = exports.searchChats = exports.createChat = exports.confirmChats = void 0;
const chatModel_1 = require("../../models/users/chatModel");
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const fileUpload_1 = require("../../utils/fileUpload");
const setConnectionKey = (id1, id2) => {
    const participants = [id1, id2].sort();
    return participants.join("");
};
const confirmChats = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield chatModel_1.Chat.updateMany({ _id: { $in: data.ids } }, { $set: { received: true } });
        const updatedChats = yield chatModel_1.Chat.find({ _id: { $in: data.ids } });
        return {
            key: updatedChats[0].connection,
            data: updatedChats,
            receiverId: data.receiverId,
            userId: data.userId,
        };
    }
    catch (error) {
        console.log(error);
    }
});
exports.confirmChats = confirmChats;
const createChat = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = setConnectionKey(data.userId, data.receiverId);
        const prev = yield chatModel_1.Chat.findOne({
            connection: connection,
        }).sort({ createdAt: -1 });
        data.connection = connection;
        if (prev) {
            const lastTime = new Date(prev.createdAt).getTime();
            const lastReceiverTime = new Date(prev.receiverTime).getTime();
            const currentTime = new Date().getTime();
            const receiverTime = new Date(currentTime - lastTime + lastReceiverTime);
            data.receiverTime = receiverTime;
            const post = yield chatModel_1.Chat.create(data);
            return {
                key: connection,
                data: post,
            };
        }
        else {
            const post = yield chatModel_1.Chat.create(data);
            return {
                key: connection,
                data: post,
            };
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
        if (!searchTerm) {
            return res.status(400).json({ message: "Search term is required" });
        }
        const regex = new RegExp(searchTerm, "i");
        const result = yield chatModel_1.Chat.find({
            connection,
            isReceiverDeleted: false,
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
const friendsChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = String(req.query.id || "").trim();
        if (!id) {
            return res.status(400).json({ message: "User ID is required" });
        }
        const result = yield chatModel_1.Chat.find({
            $or: [{ userId: id }, { receiverId: id }],
            isReceiverDeleted: false,
            isFriends: true,
        })
            .select({
            _id: 1,
            content: 1,
            createdAt: 1,
            receiverPicture: 1,
            receiverId: 1,
            receiverUsername: 1,
        })
            .sort({ createdAt: -1 }) // Get latest first
            .limit(10);
        res.status(200).json({ results: result });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.friendsChats = friendsChats;
const getUserChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(chatModel_1.Chat, req);
        const unread = yield chatModel_1.Chat.countDocuments({
            connection: req.query.connection,
            isRead: false,
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
const readChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(chatModel_1.Chat, req);
        const unread = yield chatModel_1.Chat.countDocuments({
            connection: req.query.connection,
            isRead: false,
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
exports.readChats = readChats;
const addSearchedChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.chatId;
        const minDate = new Date(Number(req.query.oldest));
        const item = yield chatModel_1.Chat.findById(id);
        if (!item) {
            return res.status(400).json({ message: "Item not found in database." });
        }
        const maxDate = item.createdAt;
        const chats = yield chatModel_1.Chat.find({
            createdAt: {
                $gt: minDate,
                $lte: maxDate,
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
        }
        else {
            yield chatModel_1.Chat.findByIdAndUpdate(data.id, { deletedId: data.senderId });
        }
        const chat = yield chatModel_1.Chat.findById(data.id);
        return {
            id: data.id,
            key: data.connection,
            day: data.day,
            chat: chat,
        };
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteChat = deleteChat;
const deleteChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const chats = req.body;
        const senderId = req.query.senderId;
        for (let i = 0; i < chats.length; i++) {
            const el = chats[i];
            const isSender = el.userId === senderId ? true : false;
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
                yield chatModel_1.Chat.findByIdAndUpdate(el._id, { isReceiverDeleted: true });
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
