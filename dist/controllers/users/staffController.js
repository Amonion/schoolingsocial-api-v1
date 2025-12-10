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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStaffs = exports.searchStaff = exports.updateStaff = exports.getAStaff = exports.removeStaff = exports.makeStaff = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const fileUpload_1 = require("../../utils/fileUpload");
const sendEmail_1 = require("../../utils/sendEmail");
const bioUser_1 = require("../../models/users/bioUser");
const staffModel_1 = require("../../models/users/staffModel");
const makeStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield bioUser_1.BioUser.findById(req.params.d);
        const userObj = user.toObject();
        const { _id, __v } = userObj, safeData = __rest(userObj, ["_id", "__v"]);
        const staff = yield staffModel_1.Staff.create(safeData);
        yield (0, sendEmail_1.sendEmail)('', req.body.email, 'welcome');
        res.status(200).json({
            staff,
            message: 'User created successfully',
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.makeStaff = makeStaff;
const removeStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield bioUser_1.BioUser.findById(req.params.d);
        const userObj = user.toObject();
        const { _id, __v } = userObj, safeData = __rest(userObj, ["_id", "__v"]);
        const staff = yield staffModel_1.Staff.create(safeData);
        yield (0, sendEmail_1.sendEmail)('', req.body.email, 'welcome');
        res.status(200).json({
            staff,
            message: 'User created successfully',
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.removeStaff = removeStaff;
const getAStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield staffModel_1.Staff.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ data: user });
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getAStaff = getAStaff;
const updateStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
        uploadedFiles.forEach((file) => {
            req.body[file.fieldName] = file.s3Url;
        });
        const user = yield staffModel_1.Staff.findOneAndUpdate({ username: req.params.username }, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            message: 'The staff profile was updated successfully',
            data: user,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateStaff = updateStaff;
const searchStaff = (req, res) => {
    return (0, query_1.search)(staffModel_1.Staff, req, res);
};
exports.searchStaff = searchStaff;
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
