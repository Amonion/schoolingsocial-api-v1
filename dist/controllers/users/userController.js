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
exports.followUser = exports.updateUserVerification = exports.searchUserInfo = exports.getUserDetails = exports.getUserInfo = exports.update = exports.updateUserInfo = exports.deleteUser = exports.updateInfo = exports.updateUser = exports.getUsers = exports.getAUser = exports.createUser = void 0;
const userModel_1 = require("../../models/users/userModel");
const userInfoModel_1 = require("../../models/users/userInfoModel");
const staffModel_1 = require("../../models/team/staffModel");
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const fileUpload_1 = require("../../utils/fileUpload");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const postModel_1 = require("../../models/users/postModel");
const app_1 = require("../../app");
const sendEmail_1 = require("../../utils/sendEmail");
const academicLevelModel_1 = require("../../models/team/academicLevelModel");
const schoolModel_1 = require("../../models/team/schoolModel");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, signupIp, password } = req.body;
        const userBio = new userInfoModel_1.UserInfo({ email, signupIp });
        yield userBio.save();
        const newUser = new userModel_1.User({
            userId: userBio._id,
            email,
            signupIp,
            password: yield bcryptjs_1.default.hash(password, 10),
        });
        yield newUser.save();
        yield userInfoModel_1.UserInfo.updateOne({ _id: userBio._id }, {
            $push: {
                userAccounts: {
                    _id: newUser._id,
                    email: newUser.email,
                    username: newUser.username,
                    displayName: newUser.displayName,
                    phone: newUser.phone,
                    picture: newUser.picture,
                    following: 0,
                    followers: 0,
                    posts: 0,
                },
            },
        });
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
const getAUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.User.findOne({ username: req.params.username });
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
exports.getAUser = getAUser;
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
const updateInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
        uploadedFiles.forEach((file) => {
            req.body[file.fieldName] = file.s3Url;
        });
        const user = yield userInfoModel_1.UserInfo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            message: "Your profile was updated successfully",
            data: user,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateInfo = updateInfo;
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
    switch (req.body.action) {
        case "Contact":
            const result = yield userInfoModel_1.UserInfo.findOne({ phone: req.body.phone });
            if (result) {
                res.status(400).json({
                    message: `Sorry a user with this phone number: ${result.phone} already exist`,
                });
            }
            else {
                (0, exports.update)(req, res);
            }
            break;
        case "Public":
            req.body.isPublic = true;
            (0, exports.update)(req, res);
            break;
        case "Education":
            if (req.body.isNew) {
                const result = yield schoolModel_1.School.findOne({
                    isNew: true,
                    name: req.body.currentSchoolName,
                });
                const level = yield academicLevelModel_1.AcademicLevel.findOne({
                    country: req.body.currentSchoolCountry,
                    levelName: req.body.currentAcademicLevelName,
                });
                const form = {
                    institutions: [level === null || level === void 0 ? void 0 : level.institution],
                    levels: [level],
                    name: req.body.currentSchoolName,
                    area: req.body.currentSchoolArea,
                    state: req.body.currentSchoolState,
                    country: req.body.currentSchoolCountry,
                    countrySymbol: req.body.currentSchoolCountrySymbol,
                    continent: req.body.currentSchoolContinent,
                    isNew: true,
                };
                if (!result) {
                    const school = yield schoolModel_1.School.create(form);
                    if (!req.body.currentAcademicLevelName.includes("Primary") &&
                        !req.body.currentAcademicLevelName.includes("Secondary") &&
                        req.body.inSchool === "Yes") {
                        const facultyForm = {
                            schoolId: school._id,
                            school: school.name,
                            name: req.body.currentFaculty,
                            isNew: true,
                        };
                        const faculty = yield schoolModel_1.Faculty.create(facultyForm);
                        const departmentForm = {
                            facultyId: faculty._id,
                            faculty: faculty.name,
                            name: req.body.currentDepartment,
                            isNew: true,
                        };
                        yield schoolModel_1.Department.create(departmentForm);
                    }
                    const newSchools = yield schoolModel_1.School.countDocuments({ isNew: true });
                    app_1.io.emit("team", { action: "new", type: "school", newSchools });
                }
                else {
                    yield schoolModel_1.School.findByIdAndUpdate(level === null || level === void 0 ? void 0 : level._id, form);
                }
            }
            (0, exports.update)(req, res);
            break;
        case "EducationHistory":
            req.body.pastSchools = JSON.parse(req.body.pastSchools);
            const pasts = req.body.pastSchools;
            for (let i = 0; i < pasts.length; i++) {
                const el = pasts[i];
                const result = yield schoolModel_1.School.findOne({
                    isNew: true,
                    name: el.schoolName,
                });
                const level = yield academicLevelModel_1.AcademicLevel.findOne({
                    country: el.schoolCountry,
                    level: el.academicLevel,
                });
                const form = {
                    institutions: [level === null || level === void 0 ? void 0 : level.institution],
                    levels: [level],
                    name: el.schoolName,
                    area: el.schoolArea,
                    state: el.schoolState,
                    country: el.schoolCountry,
                    continent: el.schoolContinent,
                    isNew: true,
                };
                if (el.isNew && !result) {
                    yield schoolModel_1.School.create(form);
                    const newSchools = yield schoolModel_1.School.countDocuments({ isNew: true });
                    app_1.io.emit("team", { action: "new", type: "school", newSchools });
                }
                else if (el.isNew && result) {
                    yield schoolModel_1.School.findByIdAndUpdate(level === null || level === void 0 ? void 0 : level._id, form);
                }
            }
            (0, exports.update)(req, res);
            break;
        case "EducationDocument":
            const pastSchools = JSON.parse(req.body.pastSchools);
            const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
            uploadedFiles.forEach((file) => {
                req.body[file.fieldName] = file.s3Url;
            });
            pastSchools[req.body.number].schoolCertificate = req.body.certificate;
            pastSchools[req.body.number].schoolTempCertificate = undefined;
            req.body.pastSchools = pastSchools;
            // req.body.pastSchools = JSON.stringify(pastSchools);
            (0, exports.update)(req, res);
            break;
        case "Profile":
            const uploadedProfileFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
            uploadedProfileFiles.forEach((file) => {
                req.body[file.fieldName] = file.s3Url;
            });
            (0, exports.update)(req, res);
            break;
        case "Document":
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
            (0, exports.update)(req, res);
            break;
        default:
            (0, exports.update)(req, res);
            break;
    }
});
exports.updateUserInfo = updateUserInfo;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInfo = yield userInfoModel_1.UserInfo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        const updateData = req.body.isPublic ? { isPublic: true } : req.body;
        const user = yield userModel_1.User.findByIdAndUpdate(req.body.ID, updateData, {
            new: true,
            runValidators: false,
        });
        if (user &&
            user.isBio &&
            user.isContact &&
            user.isDocument &&
            user.isOrigin &&
            user.isEducation &&
            user.isEducationHistory &&
            user.isPublic &&
            user.isEducationDocument &&
            !user.isOnVerification &&
            user.isRelated &&
            !user.isVerified) {
            yield userModel_1.User.findByIdAndUpdate(req.body.ID, {
                isOnVerification: true,
                verifyingAt: new Date(),
            });
            yield userInfoModel_1.UserInfo.findByIdAndUpdate(req.params.id, {
                isOnVerification: true,
                verifyingAt: new Date(),
            });
            const newNotification = yield (0, sendEmail_1.sendNotification)("verification_processing", {
                username: String(user === null || user === void 0 ? void 0 : user.username),
                receiverUsername: String(user.username),
                userId: user._id,
            });
            const verifyingUsers = yield userModel_1.User.countDocuments({
                isOnVerification: true,
            });
            app_1.io.emit(String(user === null || user === void 0 ? void 0 : user.username), newNotification);
            app_1.io.emit("team", { action: "verifying", type: "stat", verifyingUsers });
        }
        res.status(200).json({
            userInfo,
            user,
            results: req.body.pastSchool,
            message: "your account is updated  successfully",
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.update = update;
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.getUserInfo = getUserInfo;
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userInfoModel_1.UserInfo.findOne({ username: req.params.username });
        res.status(200).json(user);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getUserDetails = getUserDetails;
const searchUserInfo = (req, res) => {
    return (0, query_1.search)(userInfoModel_1.UserInfo, req, res);
};
exports.searchUserInfo = searchUserInfo;
const updateUserVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.action === "bio") {
            req.body.isBio = false;
        }
        else if (req.body.action === "ori") {
            req.body.isOrigin = false;
        }
        else if (req.body.action === "cont") {
            req.body.isContact = false;
        }
        else if (req.body.action === "rel") {
            req.body.isRelated = false;
        }
        else if (req.body.action === "doc") {
            req.body.isDocument = false;
        }
        else if (req.body.action === "edu") {
            req.body.isEducation = false;
        }
        else if (req.body.action === "pas") {
            req.body.isEducationHistory = false;
        }
        if (req.body.status === "Approved") {
            req.body.isOnVerification = false;
            req.body.isVerified = true;
        }
        const oldUser = yield userModel_1.User.findOne({ username: req.params.username });
        const userInfo = yield userInfoModel_1.UserInfo.findByIdAndUpdate(oldUser === null || oldUser === void 0 ? void 0 : oldUser.userId, req.body, {
            new: true,
        });
        const user = yield userModel_1.User.findByIdAndUpdate(oldUser === null || oldUser === void 0 ? void 0 : oldUser._id, req.body, {
            new: true,
            runValidators: false,
        });
        if (req.body.status === "Rejected") {
            const newNotification = yield (0, sendEmail_1.sendNotification)("verification_fail", {
                username: String(user === null || user === void 0 ? void 0 : user.username),
                receiverUsername: String(user === null || user === void 0 ? void 0 : user.username),
                userId: String(user === null || user === void 0 ? void 0 : user._id),
            });
            // sendEmail(
            //   String(user?.username),
            //   String(user?.email),
            //   "verification_fail"
            // );
            app_1.io.emit(req.body.id, newNotification);
        }
        else {
            const newNotification = yield (0, sendEmail_1.sendNotification)("verification_successful", {
                username: String(user === null || user === void 0 ? void 0 : user.username),
                receiverUsername: String(user === null || user === void 0 ? void 0 : user.username),
                userId: String(user === null || user === void 0 ? void 0 : user._id),
            });
            const notificationData = Object.assign(Object.assign({}, newNotification), { user });
            app_1.io.emit(String(user === null || user === void 0 ? void 0 : user.username), notificationData);
        }
        res.status(200).json({
            userInfo,
            user,
            results: req.body.pastSchool,
            message: "The verification status has been sent to the user successfully.",
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateUserVerification = updateUserVerification;
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
