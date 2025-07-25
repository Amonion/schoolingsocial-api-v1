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
exports.deleteUser = exports.updateStaff = exports.getStaffs = exports.getStaffById = void 0;
const userModel_1 = require("../../models/users/userModel");
const staffModel_1 = require("../../models/team/staffModel");
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const getStaffById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staff = yield staffModel_1.Staff.findById(req.params.id);
        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }
        res.status(200).json(staff);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getStaffById = getStaffById;
const getStaffs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(staffModel_1.Staff, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getStaffs = getStaffs;
const updateStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staff = yield staffModel_1.Staff.findById(req.params.id);
        if (!staff) {
            return res.status(404).json({ message: "Staff not found" });
        }
        const user = yield userModel_1.User.findOne({ _id: staff.userId });
        req.body.staffPositions = req.body.duties;
        yield userModel_1.User.findByIdAndUpdate(user === null || user === void 0 ? void 0 : user._id, req.body);
        (0, query_1.updateItem)(req, res, staffModel_1.Staff, [], ["Staff not found", "Staff was updated successfully"]);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateStaff = updateStaff;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.deleteUser = deleteUser;
