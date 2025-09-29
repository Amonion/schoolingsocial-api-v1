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
exports.sendOfficesMessage = exports.getOfficialMessage = exports.getOfficialMessages = exports.readOfficeMessages = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const officeModel_1 = require("../../models/utility/officeModel");
const officialMessageModel_1 = require("../../models/message/officialMessageModel");
const sendMessage_1 = require("../../utils/sendMessage");
const readOfficeMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ids = req.body.ids ? JSON.parse(req.body.ids) : [];
        yield officialMessageModel_1.OfficialMessage.updateMany({ _id: { $in: ids } }, {
            $set: {
                unread: false,
            },
        });
        const unread = yield officialMessageModel_1.OfficialMessage.countDocuments({
            receiverUsername: req.query.username,
            unread: true,
        });
        res.status(200).json({
            unread,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.readOfficeMessages = readOfficeMessages;
const getOfficialMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(officialMessageModel_1.OfficialMessage, req);
        const unread = yield officialMessageModel_1.OfficialMessage.countDocuments({
            receiverUsername: req.query.senderUsername,
            unread: true,
        });
        res.status(200).json({
            page: result.page,
            page_size: result.page_size,
            results: result.results,
            count: result.count,
            unread,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getOfficialMessages = getOfficialMessages;
const getOfficialMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield officialMessageModel_1.OfficialMessage.findById(req.params.id);
        res.status(200).json({
            data: result,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getOfficialMessage = getOfficialMessage;
const sendOfficesMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const selectedStaffs = req.body.selectedStaffs;
        const message = req.body.message;
        const office = yield officeModel_1.Office.findOne({ username: req.body.officeUsername });
        for (let i = 0; i < selectedStaffs.length; i++) {
            const el = selectedStaffs[i];
            const officialMessage = yield (0, sendMessage_1.sendOfficialMessage)({
                greetings: message.greetings.replace('[Receiver]', el.bioUserDisplayName),
                title: message.title,
                senderUsername: office.username,
                receiverUsername: el.bioUserUsername,
                senderName: office.name,
                receiverName: el.bioUserDisplayName,
                senderPicture: office.logo,
                receiverPicture: el.bioUserPicture,
                senderAddress: office.address,
                senderArea: office.area,
                senderState: office.state,
                senderCountry: office.country,
                receiverAddress: el.residentAddress,
                receiverArea: el.residentArea,
                receiverState: el.residentState,
                receiverCountry: el.residentCountry,
                content: message.content,
                unread: true,
            });
            console.log(el, message);
        }
        res.status(200).json({
            message: 'The message has been successfully sent to the users',
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.sendOfficesMessage = sendOfficesMessage;
