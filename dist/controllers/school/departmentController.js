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
exports.deleteDepartment = exports.updateDepartment = exports.getDepartments = exports.getDepartmentById = exports.createDepartment = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const departmentModel_1 = require("../../models/school/departmentModel");
//-----------------DEPARTMENTS--------------------//
const createDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, departmentModel_1.Department, 'Department was created successfully');
});
exports.createDepartment = createDepartment;
const getDepartmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield departmentModel_1.Department.findById(req.params.id);
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
        const result = yield (0, query_1.queryData)(departmentModel_1.Department, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getDepartments = getDepartments;
const updateDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, departmentModel_1.Department, ['media', 'picture'], ['Department not found', 'Department was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateDepartment = updateDepartment;
const deleteDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, departmentModel_1.Department, ['media', 'picture'], 'Department not found');
});
exports.deleteDepartment = deleteDepartment;
