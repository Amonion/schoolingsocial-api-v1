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
exports.getStaffs = exports.searchStaff = exports.updateStaff = exports.getAStaff = exports.makeStaffUser = exports.makeUserStaff = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const fileUpload_1 = require("../../utils/fileUpload");
const bioUser_1 = require("../../models/users/bioUser");
const staffModel_1 = require("../../models/users/staffModel");
const user_1 = require("../../models/users/user");
const makeUserStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (let i = 0; i < req.body.usersIds.length; i++) {
            const id = req.body.usersIds[i];
            const bioUser = yield bioUser_1.BioUser.findById(id);
            yield staffModel_1.Staff.findOneAndUpdate({ bioUserId: id }, {
                firstName: bioUser.firstName,
                middleName: bioUser.middleName,
                lastName: bioUser.lastName,
                bioUserUsername: bioUser.bioUserUsername,
                bioUserDisplayName: bioUser.bioUserDisplayName,
                picture: bioUser.bioUserPicture,
            }, { upsert: true });
            yield user_1.User.updateMany({ bioUserId: id }, {
                status: 'Staff',
            }, {
                runValidators: false,
            });
        }
        res.status(200).json({
            message: 'The users have been successfully made staffs.',
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.makeUserStaff = makeUserStaff;
const makeStaffUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (let i = 0; i < req.body.usersIds.length; i++) {
            const id = req.body.usersIds[i];
            yield staffModel_1.Staff.findOneAndUpdate({ bioUserId: id }, {
                isActive: false,
            });
            yield user_1.User.updateMany({ bioUserId: id }, {
                status: 'User',
            }, {
                runValidators: false,
            });
        }
        const result = yield (0, query_1.queryData)(staffModel_1.Staff, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.makeStaffUser = makeStaffUser;
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
