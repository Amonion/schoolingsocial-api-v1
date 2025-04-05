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
exports.getChats = exports.createChat = exports.confirmChat = void 0;
const chatModel_1 = require("../../models/users/chatModel");
const errorHandler_1 = require("../../utils/errorHandler");
const setConnectionKey = (id1, id2) => {
    const participants = [id1, id2].sort();
    return participants.join("");
};
const confirmChat = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield chatModel_1.Chat.findByIdAndUpdate(data._id, {
            received: true,
        }, { new: true });
        return {
            key: post === null || post === void 0 ? void 0 : post.connection,
            data: post,
        };
    }
    catch (error) {
        console.log(error);
    }
});
exports.confirmChat = confirmChat;
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
const getChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const groupedChats = yield chatModel_1.Chat.aggregate([
            {
                $match: {
                    connection: setConnectionKey(String(req.query.senderId), String(req.query.receiverId)),
                },
            },
            {
                $group: {
                    _id: "$day",
                    chats: { $push: "$$ROOT" },
                },
            },
            {
                $project: {
                    _id: 0,
                    day: "$_id",
                    chats: 1,
                },
            },
            {
                $sort: {
                    day: 1, // or -1 for descending
                },
            },
        ]);
        res.status(200).json(groupedChats);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getChats = getChats;
