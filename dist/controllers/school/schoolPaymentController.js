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
exports.deleteSchoolPayment = exports.updateSchoolPayment = exports.getSchoolPayments = exports.getSchoolPaymentById = exports.createSchoolPayment = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const departmentModel_1 = require("../../models/school/departmentModel");
//-----------------PAYMENT--------------------//
const createSchoolPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, departmentModel_1.SchoolPayment, 'School payment was created successfully');
});
exports.createSchoolPayment = createSchoolPayment;
const getSchoolPaymentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield departmentModel_1.SchoolPayment.findById(req.params.id);
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
        const result = yield (0, query_1.queryData)(departmentModel_1.SchoolPayment, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getSchoolPayments = getSchoolPayments;
const updateSchoolPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, departmentModel_1.SchoolPayment, [], ['School payment not found', 'School payment was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateSchoolPayment = updateSchoolPayment;
const deleteSchoolPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, departmentModel_1.SchoolPayment, [], 'School payment not found');
});
exports.deleteSchoolPayment = deleteSchoolPayment;
