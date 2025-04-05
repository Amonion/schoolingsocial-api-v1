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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.followUser = exports.searchUserInfo = exports.getUserInfoById = exports.updateUserInfo = exports.deleteUser = exports.updateUser = exports.getUsers = exports.getUserById = exports.createUser = void 0;
const userModel_1 = require("../../models/users/userModel");
const userInfoModel_1 = require("../../models/users/userInfoModel");
const staffModel_1 = require("../../models/team/staffModel");
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const fileUpload_1 = require("../../utils/fileUpload");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const postModel_1 = require("../../models/users/postModel");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, phone, signupIp, password } = req.body;
        const userBio = new userInfoModel_1.UserInfo({ email, phone, signupIp });
        yield userBio.save();
        const newUser = new userModel_1.User({
            userId: userBio._id,
            email,
            phone,
            signupIp,
            password: yield bcryptjs_1.default.hash(password, 10),
        });
        yield newUser.save();
        yield userInfoModel_1.UserInfo.updateOne({ _id: userBio._id }, { $set: { accountId: newUser._id } });
        res.status(201).json({
            message: "User created successfully",
            user: newUser,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.createUser = createUser;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.User.findById(req.params.id);
        const followerId = req.query.userId;
        const follow = yield postModel_1.Follower.findOne({
            userId: user === null || user === void 0 ? void 0 : user._id,
            followerId: followerId,
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const followedUser = Object.assign(Object.assign({}, user.toObject()), { isFollowed: !!follow });
        res.status(200).json(followedUser);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getUserById = getUserById;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(userModel_1.User, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getUsers = getUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
        uploadedFiles.forEach((file) => {
            req.body[file.fieldName] = file.s3Url;
        });
        const user = yield userModel_1.User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        yield userInfoModel_1.UserInfo.findByIdAndUpdate(user.userId, req.body, {
            new: true,
            runValidators: true,
        });
        if (req.body.picture) {
            yield postModel_1.Post.updateMany({ userId: req.params.id }, { picture: req.body.picture });
        }
        if (req.body.isStaff) {
            const staff = yield staffModel_1.Staff.findOne({ userId: req.params.id });
            if (staff) {
                yield staffModel_1.Staff.findOneAndUpdate({ userId: req.body.id }, req.body);
            }
            else {
                yield staffModel_1.Staff.create(req.body);
            }
            const result = yield (0, query_1.queryData)(userModel_1.User, req);
            const { page, page_size, count, results } = result;
            res.status(200).json({
                message: "User was updated successfully",
                results,
                count,
                page,
                page_size,
            });
        }
        else if (req.body.media || req.body.picture || req.body.intro) {
            res.status(200).json({
                message: "Your profile was updated successfully",
                data: user,
            });
        }
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateUser = updateUser;
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
//-----------------INFO--------------------//
const updateUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.isEducationHistory) {
            req.body.pastSchool = JSON.parse(req.body.pastSchools);
        }
        if (req.body.isEducationDocument) {
            const pastSchools = JSON.parse(req.body.pastSchools);
            const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
            uploadedFiles.forEach((file) => {
                req.body[file.fieldName] = file.s3Url;
            });
            pastSchools[req.body.number].schoolCertificate = req.body.certificate;
            pastSchools[req.body.number].schoolTempCertificate = undefined;
            req.body.pastSchool = pastSchools;
            req.body.pastSchools = JSON.stringify(pastSchools);
        }
        if (req.body.isDocument) {
            const user = yield userInfoModel_1.UserInfo.findById(req.params.id);
            const documents = user === null || user === void 0 ? void 0 : user.documents;
            const id = req.body.id;
            if (documents) {
                const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
                uploadedFiles.forEach((file) => {
                    req.body[file.fieldName] = file.s3Url;
                });
                const result = documents.find((item) => item.docId === id);
                if (result) {
                    result.doc = uploadedFiles[0].s3Url;
                    result.name = req.body.name;
                    documents.map((item) => (item.docId === id ? result : item));
                    yield userInfoModel_1.UserInfo.updateOne({ _id: req.params.id }, { documents: documents }, {
                        new: true,
                        upsert: true,
                    });
                }
                else {
                    const doc = {
                        doc: uploadedFiles[0].s3Url,
                        name: req.body.name,
                        docId: id,
                        tempDoc: "",
                    };
                    documents.push(doc);
                    yield userInfoModel_1.UserInfo.updateOne({ _id: req.params.id }, { documents: documents }, {
                        new: true,
                        upsert: true,
                    });
                }
            }
        }
        yield userInfoModel_1.UserInfo.updateOne({ _id: req.params.id }, req.body, {
            new: true,
        });
        const user = yield userModel_1.User.findByIdAndUpdate(req.body.ID, req.body, {
            new: true,
            runValidators: false,
        });
        res.status(200).json({
            user,
            results: req.body.pastSchool,
            message: "your account is updated  successfully",
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateUserInfo = updateUserInfo;
const getUserInfoById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userInfoModel_1.UserInfo.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getUserInfoById = getUserInfoById;
const searchUserInfo = (req, res) => {
    return (0, query_1.search)(userInfoModel_1.UserInfo, req, res);
};
exports.searchUserInfo = searchUserInfo;
//-----------------FOLLOW USER--------------------//
const followUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { follow, message } = yield (0, query_1.followAccount)(req, res);
        const user = req.body.user;
        user.isFollowed = follow ? false : true;
        user.followers = follow
            ? Number(user.followers) - 1
            : Number(user.followers) + 1;
        res.status(200).json({
            message: message,
            data: user,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.followUser = followUser;
