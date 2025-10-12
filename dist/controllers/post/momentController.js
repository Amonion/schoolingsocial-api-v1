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
exports.getMoments = exports.createMoment = void 0;
const app_1 = require("../../app");
const momentModel_1 = require("../../models/post/momentModel");
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const createMoment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const moment = yield momentModel_1.Moment.create(data);
        app_1.io.emit(`moment_${data.username}`, {
            message: 'Your moment was created successfully',
            data: moment,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.createMoment = createMoment;
const getMoments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const followerId = req.query.myId;
        delete req.query.myId;
        const result = yield (0, query_1.queryData)(momentModel_1.Moment, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getMoments = getMoments;
