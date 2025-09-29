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
exports.deleteSubject = exports.updateSubject = exports.updateStaffSubject = exports.getStaffSubjectById = exports.getStaffSubjects = exports.getSubjects = exports.getPositions = exports.getSubjectById = exports.createSubject = exports.deleteCourse = exports.updateCourse = exports.getCourses = exports.getCourseById = exports.createCourse = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const courseModel_1 = require("../../models/school/courseModel");
const academicLevelModel_1 = require("../../models/school/academicLevelModel");
const staffPositionModel_1 = require("../../models/school/staffPositionModel");
//-----------------COURSES--------------------//
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, courseModel_1.Course, 'Course was created successfully');
});
exports.createCourse = createCourse;
const getCourseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield courseModel_1.Course.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Course not found' });
        }
        res.status(200).json(item);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getCourseById = getCourseById;
const getCourses = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(courseModel_1.Course, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getCourses = getCourses;
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, courseModel_1.Course, ['media', 'picture'], ['Course not found', 'Course was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateCourse = updateCourse;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, courseModel_1.Course, ['media', 'picture'], 'Course not found');
});
exports.deleteCourse = deleteCourse;
//-----------------SUBJECTS--------------------//
const createSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, courseModel_1.Subject, 'Subject was created successfully');
});
exports.createSubject = createSubject;
const getSubjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield courseModel_1.Subject.findById(req.params.id);
        if (!data) {
            return res.status(404).json({ message: 'Subject not found' });
        }
        res.status(200).json({ data });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getSubjectById = getSubjectById;
const getPositions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(staffPositionModel_1.StaffPosition, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getPositions = getPositions;
const getSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(courseModel_1.Subject, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getSubjects = getSubjects;
const getStaffSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(academicLevelModel_1.StaffSubject, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getStaffSubjects = getStaffSubjects;
const getStaffSubjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield academicLevelModel_1.StaffSubject.findById(req.params.id);
        res.status(200).json({ data });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getStaffSubjectById = getStaffSubjectById;
const updateStaffSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subject = yield academicLevelModel_1.StaffSubject.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!subject) {
            return res.status(400).json({ message: 'Subject not found' });
        }
        const result = yield (0, query_1.queryData)(academicLevelModel_1.StaffSubject, req);
        res
            .status(200)
            .json(Object.assign(Object.assign({}, result), { message: 'Subject is updated successfully.' }));
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateStaffSubject = updateStaffSubject;
const updateSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, courseModel_1.Subject, ['media', 'picture'], ['Subject not found', 'Subject was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateSubject = updateSubject;
const deleteSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, courseModel_1.Subject, ['media', 'picture'], 'Subject not found');
});
exports.deleteSubject = deleteSubject;
