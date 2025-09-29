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
exports.deleteFaculty = exports.updateFaculty = exports.getFaculties = exports.getFacultyById = exports.createFaculty = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const facultyModel_1 = require("../../models/school/facultyModel");
//-----------------FACULTY--------------------//
const createFaculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, facultyModel_1.Faculty, 'Faculty was created successfully');
});
exports.createFaculty = createFaculty;
const getFacultyById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield facultyModel_1.Faculty.findById(req.params.id);
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
        const result = yield (0, query_1.queryData)(facultyModel_1.Faculty, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getFaculties = getFaculties;
const updateFaculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, facultyModel_1.Faculty, ['media', 'picture'], ['Faculty not found', 'Faculty was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateFaculty = updateFaculty;
const deleteFaculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, facultyModel_1.Faculty, ['media', 'picture'], 'Faculty not found');
});
exports.deleteFaculty = deleteFaculty;
