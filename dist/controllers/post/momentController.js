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
exports.deleteMoment = exports.getMoments = exports.updateMomentMedia = exports.updateMoment = exports.createMoment = void 0;
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
const updateMoment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const moment = yield momentModel_1.Moment.findByIdAndUpdate(data.id, {
            media: data.media,
        }, { new: true });
        app_1.io.emit(`update_moment_${data.username}`, {
            message: 'Your moment was updated successfully',
            data: moment,
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateMoment = updateMoment;
const updateMomentMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield momentModel_1.Moment.findByIdAndUpdate(req.params.id, {
            media: req.body.media,
        }, { new: true });
        res.status(200);
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateMomentMedia = updateMomentMedia;
const getMoments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const followerId = req.query.myId;
        delete req.query.myId;
        const result = yield (0, query_1.queryData)(momentModel_1.Moment, req);
        const results = result.results;
        const now = new Date();
        for (const el of results) {
            const createdAt = new Date(el.createdAt);
            const ageInHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
            if (ageInHours > 24) {
                yield momentModel_1.Moment.deleteOne({ _id: el._id });
            }
        }
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getMoments = getMoments;
const deleteMoment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mediaIndex = Number(req.query.mediaIndex);
        const mediaLength = Number(req.query.mediaLength);
        if (isNaN(mediaIndex) || isNaN(mediaLength)) {
            return res.status(400).json({ message: 'Invalid media index or length' });
        }
        if (mediaLength === 1) {
            const deletedMoment = yield momentModel_1.Moment.findByIdAndDelete(req.params.id);
            if (!deletedMoment) {
                return res.status(404).json({ message: 'Moment not found' });
            }
            return res.status(200).json({
                message: 'Moment deleted successfully.',
                id: req.params.id,
            });
        }
        yield momentModel_1.Moment.findByIdAndUpdate(req.params.id, {
            $unset: { [`media.${mediaIndex}`]: 1 },
        });
        const updatedMoment = yield momentModel_1.Moment.findByIdAndUpdate(req.params.id, { $pull: { media: null } }, { new: true });
        if (!updatedMoment) {
            return res.status(404).json({ message: 'Moment not found' });
        }
        res.status(200).json({
            moment: updatedMoment,
            id: req.params.id,
            message: 'Media deleted successfully.',
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.deleteMoment = deleteMoment;
