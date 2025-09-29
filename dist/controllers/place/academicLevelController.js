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
exports.getActivityById = exports.getActivities = exports.updateActivity = exports.createActivity = exports.deleteAcademicLevel = exports.getAcademicLevels = exports.getAcademicLevelById = exports.updateAcademicLevel = exports.createAcademicLevel = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const academicLevelModel_1 = require("../../models/school/academicLevelModel");
//-----------------ACADEMIC LEVEL--------------------//
const createAcademicLevel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, academicLevelModel_1.AcademicLevel, 'Academic Level was created successfully');
});
exports.createAcademicLevel = createAcademicLevel;
const updateAcademicLevel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, academicLevelModel_1.AcademicLevel, ['logo'], ['Academic Level not found', 'Academic Level was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateAcademicLevel = updateAcademicLevel;
const getAcademicLevelById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield academicLevelModel_1.AcademicLevel.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'AcademicLevel not found' });
        }
        res.status(200).json(item);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getAcademicLevelById = getAcademicLevelById;
const getAcademicLevels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(academicLevelModel_1.AcademicLevel, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getAcademicLevels = getAcademicLevels;
const deleteAcademicLevel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, academicLevelModel_1.AcademicLevel, ['logo'], 'AcademicLevel not found');
});
exports.deleteAcademicLevel = deleteAcademicLevel;
//-----------------ACTIVITY--------------------//
const createActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bd = req.body;
    (0, query_1.createItem)(req, res, academicLevelModel_1.Activity, 'Academic Level was created successfully');
});
exports.createActivity = createActivity;
const updateActivity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, academicLevelModel_1.Activity, ['picture'], ['Activity  not found', 'Activity was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateActivity = updateActivity;
const getActivities = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(academicLevelModel_1.Activity, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getActivities = getActivities;
const getActivityById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield academicLevelModel_1.Activity.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: 'Activity not found' });
        }
        res.status(200).json({ data });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getActivityById = getActivityById;
