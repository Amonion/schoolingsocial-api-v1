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
exports.deleteChats = exports.deleteChat = exports.addSearchedChats = exports.unSaveChats = exports.pinChats = exports.saveChats = exports.getSaveChats = exports.friendsChats = exports.searchFavChats = exports.searchChats = exports.createChatMobile = exports.checkChatStatus = exports.readChats = exports.getFriends = exports.getChats = exports.sendPendingChats = exports.updateDeliveredChat = exports.createChat = exports.sendChatPushNotification = void 0;
const chatModel_1 = require("../../models/message/chatModel");
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const fileUpload_1 = require("../../utils/fileUpload");
const app_1 = require("../../app");
const usersStatMode_1 = require("../../models/users/usersStatMode");
const expo_server_sdk_1 = require("expo-server-sdk");
const sendNotification_1 = require("../../utils/sendNotification");
const socialNotificationModel_1 = require("../../models/message/socialNotificationModel");
const expo = new expo_server_sdk_1.Expo();
const sendCreatedChat = (post, connection, totalUnread) => __awaiter(void 0, void 0, void 0, function* () {
    const friend = yield chatModel_1.Friend.findOneAndUpdate({
        connection,
        'unreadMessages.username': post.receiverUsername,
    }, {
        $set: {
            'unreadMessages.$.unread': totalUnread,
        },
    }, { new: true });
    /////////////// SEND TO UPDATE PENDING ROOM CHAT //////////////
    app_1.io.emit(`updatePendingChat${post.senderUsername}`, {
        connection,
        chat: post,
        friend,
        pending: true,
        isFriends: friend.isFriends,
    });
    if (friend && friend && friend.isFriends) {
        /////////////// WHEN USER IS IN CHAT ROOM OR NOT //////////////
        app_1.io.emit(`addCreatedChat${post.receiverUsername}`, {
            connection,
            chat: post,
            pending: true,
            isFriends: friend.isFriends,
            friend,
        });
    }
    else {
        const notification = yield socialNotificationModel_1.SocialNotification.findOne({
            senderUsername: post.senderUsername,
            receiverName: post.receiverUsername,
            name: 'friend_request',
        });
        if (!notification) {
            const response = yield (0, sendNotification_1.sendSocialNotification)('friend_request', {
                senderUsername: friend.senderUsername,
                receiverUsername: friend.receiverUsername,
                senderPicture: friend.senderPicture,
                receiverPicture: friend.receiverPicture,
                senderName: friend.senderDisplayName,
                receiverName: friend.receiverDisplayName,
            });
            app_1.io.emit(`social_notification_${post.receiverUsername}`, response);
        }
        yield chatModel_1.Friend.findOneAndUpdate({ connection }, {
            $addToSet: {
                unreadMessages: {
                    $each: [
                        { username: post.senderUsername, unread: 0 },
                        { username: post.receiverUsername, unread: 1 },
                    ],
                },
            },
        }, { new: true, upsert: true });
    }
    /////////////// WHEN USER IS NOT IN THE APP //////////////
    // const onlineUser = await UserStatus.findOne({
    //   username: post.receiverUsername,
    // })
    // if (!onlineUser?.online) {
    //   const user = await User.findOne({
    //     username: post.receiverUsername,
    //   })
    //   const userInfo = await BioUser.findById(user?.bioUserId)
    //   if (!userInfo) return
    //   sendChatPushNotification({
    //     username: post.senderUsername,
    //     message: post.content,
    //     token: userInfo?.notificationToken,
    //   })
    // }
});
const sendChatPushNotification = (chatData) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, message, token } = chatData;
    const cleanContent = message.replace(/<[^>]*>?/gm, '').trim();
    const messages = [
        {
            to: token,
            sound: 'default',
            title: username,
            body: cleanContent,
            data: { type: 'chat', screen: `/chat/${username}` },
        },
    ];
    try {
        yield expo.sendPushNotificationsAsync(messages);
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendChatPushNotification = sendChatPushNotification;
const createChat = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = data.connection;
        const prev = yield chatModel_1.Chat.findOne({
            connection: connection,
        }).sort({ createdAt: -1 });
        const prevFriend = yield chatModel_1.Friend.findOne({
            connection: connection,
        }).sort({ createdAt: -1 });
        if (prev &&
            !data.isFriends &&
            prev.receiverUsername === data.senderUsername) {
            yield chatModel_1.Friend.findOneAndUpdate({ connection: connection }, { isFriends: true });
            data.isFriends = true;
        }
        data.status = 'sent';
        const createdFriends = yield chatModel_1.Friend.findOneAndUpdate({ connection: data.connection }, data, {
            new: true,
            upsert: true,
        });
        if (prev) {
            const lastTime = new Date(prev.createdAt).getTime();
            const lastReceiverTime = new Date(prev.receiverTime).getTime();
            const currentTime = new Date().getTime();
            const receiverTime = new Date(currentTime - lastTime + lastReceiverTime);
            data.receiverTime = receiverTime;
            const post = yield chatModel_1.Chat.findOneAndUpdate({ timeNumber: data.timeNumber, connection: data.connection }, data, { new: true, upsert: true });
            const totalUread = yield chatModel_1.Chat.countDocuments({
                isRead: false,
                receiverUsername: data.receiverUsername,
            });
            sendCreatedChat(post, connection, totalUread);
        }
        else {
            yield chatModel_1.Friend.findOneAndUpdate({ connection }, {
                $addToSet: {
                    unreadMessages: {
                        $each: [
                            { username: data.senderUsername, unread: 0 },
                            { username: data.receiverUsername, unread: 1 },
                        ],
                    },
                },
            }, { new: true, upsert: true });
            const post = yield chatModel_1.Chat.create(data);
            sendCreatedChat(post, connection);
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.createChat = createChat;
const updateDeliveredChat = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = data.connection;
        const friend = yield chatModel_1.Friend.findOneAndUpdate({ connection: connection }, { status: 'delivered' }, { new: true });
        const chat = yield chatModel_1.Chat.findByIdAndUpdate(data._id, { status: 'delivered' }, { new: true });
        app_1.io.emit(`updateDeliveredChat${chat.senderUsername}`, {
            connection,
            chat,
            friend,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateDeliveredChat = updateDeliveredChat;
const sendPendingChats = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (let i = 0; i < data.messages.length; i++) {
            const chat = data.messages[i];
            const connection = chat.connection;
            const justBecameFriends = !chat.isFriends && chat.receiverUsername !== chat.senderUsername;
            if (justBecameFriends) {
                yield chatModel_1.Friend.findOneAndUpdate({ connection: connection }, { isFriends: true });
            }
            const prev = yield chatModel_1.Chat.findOne({
                connection: connection,
            }).sort({ createdAt: -1 });
            chat.status = 'sent';
            delete chat._id;
            if (prev) {
                const lastTime = new Date(prev.createdAt).getTime();
                const lastReceiverTime = new Date(prev.receiverTime).getTime();
                const currentTime = new Date().getTime();
                const receiverTime = new Date(currentTime - lastTime + lastReceiverTime);
                chat.receiverTime = receiverTime;
                const post = yield chatModel_1.Chat.findOneAndUpdate({ timeNumber: chat.timeNumber, connection: chat.connection }, chat, { new: true, upsert: true });
                const totalUread = justBecameFriends
                    ? yield chatModel_1.Chat.countDocuments({
                        isRead: false,
                        receiverUsername: chat.receiverUsername,
                    })
                    : 0;
                sendCreatedChat(post, connection, totalUread);
            }
            else {
                const post = yield chatModel_1.Chat.findOneAndUpdate({ timeNumber: chat.timeNumber, connection: chat.connection }, chat, { new: true, upsert: true });
                sendCreatedChat(post, connection);
            }
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.sendPendingChats = sendPendingChats;
const getChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getChats = getChats;
const getFriends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const username = String(req.query.username);
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.page_size) || 10;
        const skip = (page - 1) * limit;
        const friends = yield chatModel_1.Friend.find({
            connection: { $regex: username, $options: 'i' },
        })
            .skip(skip)
            .limit(limit)
            .select('-__v')
            .lean();
        const total = yield chatModel_1.Friend.countDocuments({
            connection: { $regex: username, $options: 'i' },
        });
        res.status(200).json({
            count: total,
            results: friends,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getFriends = getFriends;
const readChats = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = data.connection;
        const receiverUsername = data.receiverUsername;
        const senderUsername = data.senderUsername;
        const ids = data.ids;
        yield chatModel_1.Chat.updateMany({ timeNumber: { $in: ids }, connection: connection }, { $set: { status: 'read', isRead: true } });
        yield chatModel_1.Friend.updateMany({ timeNumber: { $in: ids }, connection: connection }, { $set: { status: 'read' } });
        const unreadCount = yield chatModel_1.Chat.countDocuments({
            connection: connection,
            isRead: false,
            receiverUsername: receiverUsername,
        });
        const friend = yield chatModel_1.Friend.findOneAndUpdate({
            connection,
            'unreadMessages.username': receiverUsername,
        }, {
            $set: {
                'unreadMessages.$.unread': unreadCount,
            },
        }, { new: true });
        console.log(data);
        app_1.io.emit(`updateChatToRead${senderUsername}`, {
            ids,
            friend,
            connection,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.readChats = readChats;
const checkChatStatus = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = data.connection;
        const senderUsername = data.senderUsername;
        const ids = data.ids;
        const chats = yield chatModel_1.Chat.find({
            timeNumber: { $in: ids },
            connection: connection,
        }).select('timeNumber status');
        console.log(chats);
        app_1.io.emit(`updateCheckedChats${senderUsername}`, {
            ids,
            connection,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.checkChatStatus = checkChatStatus;
//////////////////////  ABOVE UPDATED CHATS //////////////////////
const createChatMobile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const connection = req.params.connection;
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
                message: data.action === 'online' ? 'online' : '',
                totalUnread: totalUnread,
            });
            if (isFriends) {
                app_1.io.emit(`createdChat${data.receiverUsername}`, {
                    key: connection,
                    data: post,
                    message: data.action === 'online' ? 'online' : '',
                    totalUnread: totalUnread,
                });
            }
        };
        let post;
        if (prev) {
            const lastTime = new Date(prev.createdAt).getTime();
            const lastReceiverTime = new Date(prev.receiverTime).getTime();
            const currentTime = new Date().getTime();
            const receiverTime = new Date(currentTime - lastTime + lastReceiverTime);
            data.receiverTime = receiverTime;
            post = yield chatModel_1.Chat.create(data);
            const totalUread = yield chatModel_1.Chat.countDocuments({
                isRead: false,
                isFriends: true,
                receiverUsername: data.receiverUsername,
            });
            sendCreatedChat(post, data.isFriends, totalUread);
        }
        else {
            post = yield chatModel_1.Chat.create(data);
            sendCreatedChat(post, false);
            const newNotification = yield (0, sendNotification_1.sendPersonalNotification)('friend_request', data);
            const onlineUser = yield usersStatMode_1.UserStat.findOne({
                username: data.receiverUsername,
            });
            app_1.io.emit(data.receiverUsername, newNotification);
        }
        res.status(200).json(post);
    }
    catch (error) {
        console.log(error);
    }
});
exports.createChatMobile = createChatMobile;
const searchChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchTerm = String(req.query.word || '').trim();
        const connection = String(req.query.connection || '').trim();
        const username = String(req.query.username || '').trim();
        if (!searchTerm) {
            return res.status(400).json({ message: 'Search term is required' });
        }
        const regex = new RegExp(searchTerm, 'i');
        const result = yield chatModel_1.Chat.find({
            connection,
            deletedUsername: { $ne: username },
            $or: [
                { content: { $regex: regex } },
                { 'media.name': { $regex: regex } },
            ],
        })
            .select({ _id: 1, content: 1, 'media.name': 1 })
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
        const searchTerm = String(req.query.word || '').trim();
        const connection = String(req.query.connection || '').trim();
        const username = String(req.query.username || '').trim();
        if (!searchTerm) {
            return res.status(400).json({ message: 'Search term is required' });
        }
        const regex = new RegExp(searchTerm, 'i');
        const result = yield chatModel_1.Chat.find({
            connection,
            deletedUsername: { $ne: username },
            isSavedUsernames: { $in: username },
            $or: [
                { content: { $regex: regex } },
                { 'media.name': { $regex: regex } },
            ],
        })
            .select({ _id: 1, content: 1, 'media.name': 1 })
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
        const username = String(req.query.username || req.query.id).trim();
        const accountUsername = String(req.query.accountUsername || req.query.id).trim();
        const result = yield chatModel_1.Chat.aggregate([
            {
                $match: {
                    deletedUsername: {
                        $nin: accountUsername ? [username, accountUsername] : [username],
                    },
                    $and: [
                        { isFriends: true },
                        {
                            $or: [
                                { username: { $in: [username, accountUsername] } },
                                { receiverUsername: { $in: [username, accountUsername] } },
                            ],
                        },
                    ],
                },
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $group: {
                    _id: '$connection',
                    doc: { $first: '$$ROOT' },
                    unreadCount: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$isRead', false] },
                                        {
                                            $or: [
                                                { $eq: ['$receiverUsername', username] },
                                                { $eq: ['$receiverUsername', accountUsername] },
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
                    'doc.unreadCount': '$unreadCount',
                },
            },
            {
                $replaceRoot: { newRoot: '$doc' },
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
            $or: [
                { receiverUsername: username },
                { receiverUsername: accountUsername },
            ],
        });
        res.status(200).json({ results: result, totalUnread: totalUnread });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.friendsChats = friendsChats;
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
            message: 'The chats have been saved to your favorites',
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
            message: 'The chats have been saved to your favorites',
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
            message: 'The chats have been removed to your favorites',
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
            console.log('not found');
            return res
                .status(400)
                .json({ message: 'Sorry this chat has been deleted.' });
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
                return { message: 'This post has been deleted' };
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
            message: 'Chats deleted successfully.',
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.deleteChats = deleteChats;
