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
exports.deleteFaculty = exports.updateFaculty = exports.getFaculties = exports.getFacultyById = exports.createFaculty = exports.deleteDepartment = exports.updateDepartment = exports.getDepartments = exports.getDepartmentById = exports.createDepartment = exports.deleteCourse = exports.updateCourse = exports.getCourses = exports.getCourseById = exports.createCourse = exports.searchSchools = exports.deleteSchoolPayment = exports.updateSchoolPayment = exports.getSchoolPayments = exports.getSchoolPaymentById = exports.createSchoolPayment = exports.updateLevels = exports.searchSchool = exports.deleteSchool = exports.recordAll = exports.updateSchool = exports.getSchools = exports.getSchoolByUsername = exports.createSchool = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const schoolModel_1 = require("../../models/team/schoolModel");
const query_1 = require("../../utils/query");
const createSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const levels = JSON.parse(req.body.levels);
    const institutions = levels.map((item) => item.institution);
    req.body.levels = levels;
    req.body.institutions = institutions;
    req.body.isRecorded = true;
    (0, query_1.createItem)(req, res, schoolModel_1.School, 'School was created successfully');
});
exports.createSchool = createSchool;
const getSchoolByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield schoolModel_1.School.findOne({ username: req.params.username });
        if (!item) {
            return res.status(404).json({ message: 'School not found' });
        }
        res.status(200).json(item);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getSchoolByUsername = getSchoolByUsername;
const getSchools = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(schoolModel_1.School, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getSchools = getSchools;
const updateSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const levels = JSON.parse(req.body.levels);
        const institutions = levels.map((item) => item.institution);
        req.body.levels = levels;
        req.body.institutions = institutions;
        (0, query_1.updateItem)(req, res, schoolModel_1.School, ['logo', 'media', 'picture'], ['School not found', 'School was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateSchool = updateSchool;
const recordAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield schoolModel_1.School.updateMany({}, // No filter — update all documents
        { $set: { isRecorded: true } });
        res.status(200).json({ response });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.recordAll = recordAll;
const deleteSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, schoolModel_1.School, ['logo', 'media', 'picture'], 'School not found');
});
exports.deleteSchool = deleteSchool;
const searchSchool = (req, res) => {
    (0, query_1.search)(schoolModel_1.School, req, res);
};
exports.searchSchool = searchSchool;
const updateLevels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield schoolModel_1.School.find();
        for (let i = 0; i < items.length; i++) {
            const el = items[i];
            if (el.levelNames.length === 0 ||
                el.levelNames[i] === null ||
                el.levelNames === null ||
                el.levelNames === undefined) {
                const levels = JSON.parse(el.levels);
                const arr = [];
                for (let x = 0; x < levels.length; x++) {
                    const elm = levels[x];
                    arr.push(elm.levelName);
                }
                yield schoolModel_1.School.findByIdAndUpdate(el._id, { levelNames: arr });
            }
        }
        return res.status(200).json({ message: 'Schools updated successfully.' });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateLevels = updateLevels;
//-----------------PAYMENT--------------------//
const createSchoolPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, schoolModel_1.SchoolPayment, 'School payment was created successfully');
});
exports.createSchoolPayment = createSchoolPayment;
const getSchoolPaymentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield schoolModel_1.SchoolPayment.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'School payment not found' });
        }
        res.status(200).json(item);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getSchoolPaymentById = getSchoolPaymentById;
const getSchoolPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(schoolModel_1.SchoolPayment, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getSchoolPayments = getSchoolPayments;
const updateSchoolPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, schoolModel_1.SchoolPayment, [], ['School payment not found', 'School payment was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateSchoolPayment = updateSchoolPayment;
const deleteSchoolPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, schoolModel_1.SchoolPayment, [], 'School payment not found');
});
exports.deleteSchoolPayment = deleteSchoolPayment;
const searchSchools = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.query.name;
        const skip = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.page_size) || 10;
        const schools = yield schoolModel_1.School.aggregate([
            {
                $group: {
                    _id: name ? `$${name}` : '$name',
                    place: { $first: '$$ROOT' },
                },
            },
            {
                $sort: { _id: 1 },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
            {
                $replaceRoot: { newRoot: '$place' },
            },
        ]);
        res.status(200).json({
            results: schools,
        });
    }
    catch (error) {
        console.error('Error fetching unique places:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.searchSchools = searchSchools;
//-----------------COURSES--------------------//
const createCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, schoolModel_1.Course, 'Course was created successfully');
});
exports.createCourse = createCourse;
const getCourseById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield schoolModel_1.Course.findById(req.params.id);
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
        const result = yield (0, query_1.queryData)(schoolModel_1.Course, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getCourses = getCourses;
const updateCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, schoolModel_1.Course, ['media', 'picture'], ['Course not found', 'Course was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateCourse = updateCourse;
const deleteCourse = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, schoolModel_1.Course, ['media', 'picture'], 'Course not found');
});
exports.deleteCourse = deleteCourse;
//-----------------DEPARTMENTS--------------------//
const createDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, schoolModel_1.Department, 'Department was created successfully');
});
exports.createDepartment = createDepartment;
const getDepartmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield schoolModel_1.Department.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Department not found' });
        }
        res.status(200).json(item);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getDepartmentById = getDepartmentById;
const getDepartments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(schoolModel_1.Department, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getDepartments = getDepartments;
const updateDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, schoolModel_1.Department, ['media', 'picture'], ['Department not found', 'Department was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateDepartment = updateDepartment;
const deleteDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, schoolModel_1.Department, ['media', 'picture'], 'Department not found');
});
exports.deleteDepartment = deleteDepartment;
//-----------------FACULTY--------------------//
const createFaculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, schoolModel_1.Faculty, 'Faculty was created successfully');
});
exports.createFaculty = createFaculty;
const getFacultyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield schoolModel_1.Faculty.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Faculty not found' });
        }
        res.status(200).json(item);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getFacultyById = getFacultyById;
const getFaculties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(schoolModel_1.Faculty, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getFaculties = getFaculties;
const updateFaculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, schoolModel_1.Faculty, ['media', 'picture'], ['Faculty not found', 'Faculty was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateFaculty = updateFaculty;
const deleteFaculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, schoolModel_1.Faculty, ['media', 'picture'], 'Faculty not found');
});
exports.deleteFaculty = deleteFaculty;
