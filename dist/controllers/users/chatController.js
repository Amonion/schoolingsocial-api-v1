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
exports.deleteChat = exports.getUserChats = exports.searchChats = exports.createChat = exports.confirmChats = void 0;
const chatModel_1 = require("../../models/users/chatModel");
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
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
            .limit(10);
        res.status(200).json({ results: result });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.searchChats = searchChats;
const getUserChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(chatModel_1.Chat, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getUserChats = getUserChats;
const deleteChat = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (data.isSender) {
            yield chatModel_1.Chat.findByIdAndDelete(data.id);
        }
        else {
            yield chatModel_1.Chat.findByIdAndUpdate(data.id, { isReceiverDeleted: true });
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
