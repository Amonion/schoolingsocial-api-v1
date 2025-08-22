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
exports.followUserAccount = exports.updateUserVerification = exports.searchAccounts = exports.searchUserInfo = exports.getExistingUsername = exports.getManyUserDetails = exports.getUserDetails = exports.getUserInfo = exports.getUserSchoolInfo = exports.getUserAccountInfo = exports.updateUserAccountInfo = exports.update = exports.updateUserInfoApp = exports.updateUserSchoolInfo = exports.updateUserInfo = exports.deleteUser = exports.updateInfo = exports.updateUserSettings = exports.updateUser = exports.getUsers = exports.deleteMyData = exports.getUserSettings = exports.getAUser = exports.createUser = void 0;
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
const competitionModel_1 = require("../../models/users/competitionModel");
const usersStatMode_1 = require("../../models/users/usersStatMode");
const expo_server_sdk_1 = require("expo-server-sdk");
const statModel_1 = require("../../models/users/statModel");
const emailModel_1 = require("../../models/team/emailModel");
const placeModel_1 = require("../../models/team/placeModel");
const walletModel_1 = require("../../models/users/walletModel");
const expo = new expo_server_sdk_1.Expo();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Run once to remove trailing/leading spaces in all documents
        // await Place.updateMany({}, [
        //   { $set: { country: { $trim: { input: '$country' } } } },
        // ])
        const country = req.country;
        const newCountry = country ? country : 'Nigeria';
        const signupCountry = yield placeModel_1.Place.findOne({
            country: new RegExp(`^${newCountry.trim()}\\s*$`, 'i'),
        });
        const { email, signupIp, password, operatingSystem } = req.body;
        const userBio = new userInfoModel_1.UserInfo({
            email,
            signupIp,
            operatingSystem,
            residentCountry: signupCountry,
        });
        yield userBio.save();
        yield userInfoModel_1.UserSchoolInfo.create({ userId: userBio._id });
        yield userInfoModel_1.UserFinanceInfo.create({ userId: userBio._id });
        console.log('country is: ', signupCountry);
        const newUser = new userModel_1.User({
            userId: userBio._id,
            email,
            signupIp,
            country: signupCountry === null || signupCountry === void 0 ? void 0 : signupCountry.country.trim(),
            signupCountry: signupCountry === null || signupCountry === void 0 ? void 0 : signupCountry.country.trim(),
            signupCountryFlag: signupCountry === null || signupCountry === void 0 ? void 0 : signupCountry.countryFlag.trim(),
            signupCountrySymbol: signupCountry === null || signupCountry === void 0 ? void 0 : signupCountry.countrySymbol.trim(),
            password: yield bcryptjs_1.default.hash(password, 10),
        });
        yield newUser.save();
        yield walletModel_1.Wallet.create({
            userId: newUser._id,
            bioId: userBio._id,
            country: signupCountry === null || signupCountry === void 0 ? void 0 : signupCountry.country.trim(),
            countryFlag: signupCountry === null || signupCountry === void 0 ? void 0 : signupCountry.countryFlag,
            countrySymbol: signupCountry === null || signupCountry === void 0 ? void 0 : signupCountry.countrySymbol.trim(),
            currency: signupCountry === null || signupCountry === void 0 ? void 0 : signupCountry.currency.trim(),
            currencySymbol: signupCountry === null || signupCountry === void 0 ? void 0 : signupCountry.currencySymbol.trim(),
        });
        yield (0, sendEmail_1.sendEmail)('', email, 'welcome');
        res.status(200).json({
            message: 'User created successfully',
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
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const followerId = req.query.userId;
        const follow = yield postModel_1.Follower.findOne({
            userId: user === null || user === void 0 ? void 0 : user._id,
            followerId: followerId,
        });
        const followedUser = Object.assign(Object.assign({}, user.toObject()), { isFollowed: !!follow });
        res.status(200).json(followedUser);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getAUser = getAUser;
const getUserSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield userModel_1.UserSettings.findOne({ userId: req.params.id });
        if (!user) {
            user = yield userModel_1.UserSettings.create({ userId: req.params.id });
        }
        return res.status(200).json(user);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getUserSettings = getUserSettings;
const deleteMyData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.User.findById(req.params.id);
        yield userModel_1.DeletedUser.create({
            email: user === null || user === void 0 ? void 0 : user.email,
            username: user === null || user === void 0 ? void 0 : user.username,
            displayName: user === null || user === void 0 ? void 0 : user.displayName,
            picture: user === null || user === void 0 ? void 0 : user.picture,
            userId: user === null || user === void 0 ? void 0 : user.userId,
        });
        yield statModel_1.Bookmark.deleteMany({ userId: req.params.id });
        yield postModel_1.Follower.deleteMany({ userId: req.params.id });
        yield statModel_1.Like.deleteMany({ userId: req.params.id });
        yield postModel_1.Mute.deleteMany({ userId: req.params.id });
        yield postModel_1.Pin.deleteMany({ userId: req.params.id });
        yield postModel_1.Poll.deleteMany({ userId: req.params.id });
        yield postModel_1.Post.deleteMany({ userId: req.params.id });
        yield statModel_1.Repost.deleteMany({ userId: req.params.id });
        yield emailModel_1.UserNotification.deleteMany({ userId: req.params.id });
        yield usersStatMode_1.UserStatus.deleteMany({ bioId: user === null || user === void 0 ? void 0 : user.userId });
        yield statModel_1.View.deleteMany({ userId: req.params.id });
        yield userModel_1.User.findByIdAndDelete(req.params.id);
        return res
            .status(200)
            .json({ message: 'Your account has been deleted successfully.' });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.deleteMyData = deleteMyData;
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
            return res.status(404).json({ message: 'User not found' });
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
                message: 'User was updated successfully',
                results,
                count,
                page,
                page_size,
            });
        }
        else if (req.body.media || req.body.picture || req.body.intro) {
            res.status(200).json({
                message: 'Your profile was updated successfully',
                data: user,
            });
        }
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateUser = updateUser;
const updateUserSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userModel_1.UserSettings.findOneAndUpdate({ userId: req.params.id }, req.body, {
            new: true,
            runValidators: true,
            upsert: true,
        });
        res.status(200).json({
            message: 'Your profile settings was updated successfully',
            data: user,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateUserSettings = updateUserSettings;
const updateInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
        uploadedFiles.forEach((file) => {
            req.body[file.fieldName] = file.s3Url;
        });
        const userInfo = yield userInfoModel_1.UserInfo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        const user = yield userModel_1.User.findOneAndUpdate({ userId: req.params.id }, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            message: 'Your profile was updated successfully',
            data: user,
            userInfo: userInfo,
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
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.deleteUser = deleteUser;
//-----------------INFO--------------------//
const updateUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    switch (req.body.action) {
        case 'Contact':
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
        case 'Public':
            req.body.isPublic = true;
            const uploadedProfileFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
            uploadedProfileFiles.forEach((file) => {
                req.body[file.fieldName] = file.s3Url;
            });
            req.body.location = JSON.parse(req.body.location);
            (0, exports.update)(req, res);
            break;
        case 'Education':
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
                    if (!req.body.currentAcademicLevelName.includes('Primary') &&
                        !req.body.currentAcademicLevelName.includes('Secondary') &&
                        req.body.inSchool === 'Yes') {
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
                    app_1.io.emit('team', { action: 'new', type: 'school', newSchools });
                }
                else {
                    yield schoolModel_1.School.findByIdAndUpdate(level === null || level === void 0 ? void 0 : level._id, form);
                }
            }
            req.body.currentAcademicLevel = JSON.parse(req.body.currentAcademicLevel);
            req.body.inSchool = req.body.inSchool === 'Yes' ? true : false;
            (0, exports.update)(req, res);
            break;
        case 'EducationHistory':
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
                    app_1.io.emit('team', { action: 'new', type: 'school', newSchools });
                }
                else if (el.isNew && result) {
                    yield schoolModel_1.School.findByIdAndUpdate(level === null || level === void 0 ? void 0 : level._id, form);
                }
            }
            (0, exports.update)(req, res);
            break;
        case 'EducationDocument':
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
        case 'Profile':
            const uploadedProfileFiles1 = yield (0, fileUpload_1.uploadFilesToS3)(req);
            uploadedProfileFiles1.forEach((file) => {
                req.body[file.fieldName] = file.s3Url;
            });
            (0, exports.update)(req, res);
            break;
        case 'Document':
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
                        tempDoc: '',
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
const updateUserSchoolInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.action === 'Education') {
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
                    if (!req.body.currentAcademicLevelName.includes('Primary') &&
                        !req.body.currentAcademicLevelName.includes('Secondary') &&
                        req.body.inSchool === 'Yes') {
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
                    app_1.io.emit('team', { action: 'new', type: 'school', newSchools });
                }
                else {
                    yield schoolModel_1.School.findByIdAndUpdate(level === null || level === void 0 ? void 0 : level._id, form);
                }
            }
            req.body.currentAcademicLevel = JSON.parse(req.body.currentAcademicLevel);
            req.body.inSchool =
                req.body.inSchool === 'Yes' || req.body.inSchool === true ? true : false;
        }
        else if (req.body.action === 'EducationHistory') {
            req.body.pastSchools = JSON.parse(req.body.pastSchools);
            if (req.body.inSchool === 'true' || req.body.inSchool) {
                const currentSchoolInfo = req.body.pastSchools[req.body.pastSchools.length - 1];
                req.body.currentSchoolArea = currentSchoolInfo.schoolArea;
                req.body.currentSchoolState = currentSchoolInfo.schoolState;
                req.body.currentSchoolCountry = currentSchoolInfo.schoolCountry;
                req.body.currentSchoolContinent = currentSchoolInfo.schoolContinent;
                req.body.currentSchoolCountryFlag = currentSchoolInfo.schoolCountryFlag;
                req.body.currentSchoolName = currentSchoolInfo.schoolName;
                req.body.currentAcademicLevelName = currentSchoolInfo.academicLevelName;
                req.body.currentSchoolLogo = currentSchoolInfo.schoolLogo;
                req.body.currentSchoolId = currentSchoolInfo.schoolId;
                req.body.currentFaculty = currentSchoolInfo.faculty;
                req.body.currentFacultyUsername = currentSchoolInfo.facultyUsername;
                req.body.currentDepartment = currentSchoolInfo.department;
                req.body.currentDepartmentUsername =
                    currentSchoolInfo.departmentUsername;
            }
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
                    app_1.io.emit('team', { action: 'new', type: 'school', newSchools });
                }
                else if (el.isNew && result) {
                    yield schoolModel_1.School.findByIdAndUpdate(level === null || level === void 0 ? void 0 : level._id, form);
                }
            }
        }
        else if (req.body.action === 'EducationDocument') {
            const pastSchools = JSON.parse(req.body.pastSchools);
            const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
            uploadedFiles.forEach((file) => {
                req.body[file.fieldName] = file.s3Url;
            });
            pastSchools[req.body.number].schoolCertificate = req.body.certificate;
            pastSchools[req.body.number].schoolTempCertificate = undefined;
            req.body.pastSchools = pastSchools;
        }
        const userInfo = yield userInfoModel_1.UserSchoolInfo.findOneAndUpdate({ userId: req.params.id }, req.body, {
            new: true,
            runValidators: true,
        });
        const user = yield userModel_1.User.findOneAndUpdate({ userId: req.params.id }, req.body.isPublic ? { isPublic: true } : req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            res.status(400).json({
                message: 'Sorry, user not found to update',
            });
            return;
        }
        const newUser = yield getUser(user, req.params.id);
        res.status(200).json({
            message: 'Your education profile was updated successfully',
            user: newUser,
            userInfo: userInfo,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateUserSchoolInfo = updateUserSchoolInfo;
const updateUserInfoApp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
                        tempDoc: '',
                    };
                    documents.push(doc);
                    yield userInfoModel_1.UserInfo.updateOne({ _id: req.params.id }, { documents: documents }, {
                        new: true,
                        upsert: true,
                    });
                }
            }
        }
        else if (req.body.isBio || req.body.isPublic) {
            const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
            uploadedFiles.forEach((file) => {
                req.body[file.fieldName] = file.s3Url;
            });
        }
        if (req.body.isPublic) {
            req.body.location = JSON.parse(req.body.location);
            yield userInfoModel_1.UserSchoolInfo.findOneAndUpdate({ userId: req.params.id }, req.body, {
                new: true,
                runValidators: true,
            });
        }
        const userInfo = yield userInfoModel_1.UserInfo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        const user = yield userModel_1.User.findOneAndUpdate({ userId: req.params.id }, req.body.isPublic ? { isPublic: true } : req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            res.status(400).json({
                message: 'Sorry, user not found to update',
            });
            return;
        }
        const newUser = yield getUser(user, req.params.id);
        res.status(200).json({
            message: 'Your profile was updated successfully',
            user: newUser,
            userInfo: userInfo,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateUserInfoApp = updateUserInfoApp;
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
        const schoolInfo = yield userInfoModel_1.UserSchoolInfo.findOneAndUpdate({ userId: req.params.id }, req.body, {
            new: true,
        });
        yield userInfoModel_1.UserFinanceInfo.findOneAndUpdate({ userId: req.params.id }, req.body, {
            new: true,
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
            const newNotification = yield (0, sendEmail_1.sendNotification)('verification_processing', {
                username: String(user === null || user === void 0 ? void 0 : user.username),
                receiverUsername: String(user.username),
                userId: user._id,
                from: user._id,
            });
            const verifyingUsers = yield userModel_1.User.countDocuments({
                isOnVerification: true,
            });
            app_1.io.emit(String(user === null || user === void 0 ? void 0 : user.username), newNotification);
            app_1.io.emit('team', { action: 'verifying', type: 'stat', verifyingUsers });
        }
        res.status(200).json({
            schoolInfo,
            userInfo,
            user,
            results: req.body.pastSchool,
            message: 'your account is updated  successfully',
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.update = update;
const updateUserAccountInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userInfoModel_1.UserFinanceInfo.findOneAndUpdate({ userId: req.params.id }, req.body, {
            new: true,
        });
        yield userModel_1.User.findOneAndUpdate({ userId: req.params.id }, { isAccountSet: true }, {
            new: true,
        });
        res.status(200).json(user);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateUserAccountInfo = updateUserAccountInfo;
const getUserAccountInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userInfoModel_1.UserFinanceInfo.findOne({ userId: req.params.id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getUserAccountInfo = getUserAccountInfo;
const getUserSchoolInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userInfoModel_1.UserSchoolInfo.findOne({ userId: req.params.id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getUserSchoolInfo = getUserSchoolInfo;
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.query.school) {
            const user = yield userInfoModel_1.UserSchoolInfo.findOne({ userId: req.params.id });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        }
        else {
            const user = yield userInfoModel_1.UserInfo.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        }
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
const getManyUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield (0, query_1.queryData)(userInfoModel_1.UserInfo, req);
        res.status(200).json(results);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getManyUserDetails = getManyUserDetails;
const getExistingUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = (yield userInfoModel_1.UserInfo.findOne({ username: req.params.username })) ||
            (yield userModel_1.User.findOne({ username: req.params.username }));
        res.status(200).json(user);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getExistingUsername = getExistingUsername;
const searchUserInfo = (req, res) => {
    return (0, query_1.search)(userInfoModel_1.UserSchoolInfo, req, res);
};
exports.searchUserInfo = searchUserInfo;
const searchAccounts = (req, res) => {
    return (0, query_1.search)(userModel_1.User, req, res);
};
exports.searchAccounts = searchAccounts;
const updateUserVerification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    try {
        if (req.body.action === 'bio') {
            req.body.isBio = false;
        }
        else if (req.body.action === 'ori') {
            req.body.isOrigin = false;
        }
        else if (req.body.action === 'cont') {
            req.body.isContact = false;
        }
        else if (req.body.action === 'rel') {
            req.body.isRelated = false;
        }
        else if (req.body.action === 'doc') {
            req.body.isDocument = false;
        }
        else if (req.body.action === 'edu') {
            req.body.isEducation = false;
        }
        else if (req.body.action === 'pas') {
            req.body.isEducationHistory = false;
        }
        if (req.body.status === 'Approved') {
            req.body.isOnVerification = false;
            req.body.isVerified = true;
            req.body.displayName = `${(_b = (_a = req.body.lastName) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.toUpperCase()}. ${(_d = (_c = req.body.middleName) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.toUpperCase()}. ${req.body.firstName}`;
        }
        const oldUser = yield userModel_1.User.findOne({ email: req.body.email });
        const userInfo = yield userInfoModel_1.UserInfo.findOneAndUpdate({ username: req.params.username }, req.body, {
            new: true,
        });
        yield userInfoModel_1.UserSchoolInfo.findOneAndUpdate({ username: req.params.username }, req.body, {
            new: true,
        });
        yield postModel_1.Post.updateMany({ userId: oldUser === null || oldUser === void 0 ? void 0 : oldUser._id }, { isVerified: req.body.isVerified });
        delete req.body.displayName;
        const user = yield userModel_1.User.findByIdAndUpdate(oldUser === null || oldUser === void 0 ? void 0 : oldUser._id, req.body, {
            new: true,
            runValidators: false,
        });
        if (req.body.status === 'Rejected') {
            const newNotification = yield (0, sendEmail_1.sendNotification)('verification_fail', {
                username: String(user === null || user === void 0 ? void 0 : user.username),
                receiverUsername: String(user === null || user === void 0 ? void 0 : user.username),
                userId: String(user === null || user === void 0 ? void 0 : user._id),
                from: String(user === null || user === void 0 ? void 0 : user._id),
            });
            app_1.io.emit(req.body.id, newNotification);
        }
        else {
            const newNotification = yield (0, sendEmail_1.sendNotification)('verification_successful', {
                username: String(user === null || user === void 0 ? void 0 : user.username),
                receiverUsername: String(user === null || user === void 0 ? void 0 : user.username),
                userId: String(user === null || user === void 0 ? void 0 : user._id),
                from: String(user === null || user === void 0 ? void 0 : user._id),
            });
            const userStatus = yield usersStatMode_1.UserStatus.findOne({ bioId: user === null || user === void 0 ? void 0 : user.userId });
            if (!(userStatus === null || userStatus === void 0 ? void 0 : userStatus.online)) {
                const notificationData = newNotification.data;
                const cleanContent = (_e = notificationData === null || notificationData === void 0 ? void 0 : notificationData.content) === null || _e === void 0 ? void 0 : _e.replace(/<[^>]*>?/gm, '').trim();
                const messages = [
                    {
                        to: String(userInfo === null || userInfo === void 0 ? void 0 : userInfo.notificationToken),
                        sound: 'default',
                        title: notificationData === null || notificationData === void 0 ? void 0 : notificationData.title,
                        body: cleanContent,
                        data: { type: 'notifications', screen: '/home/notifications' },
                    },
                ];
                yield expo.sendPushNotificationsAsync(messages);
            }
            else {
                const notificationData = Object.assign(Object.assign({}, newNotification), { user });
                app_1.io.emit(String(userInfo === null || userInfo === void 0 ? void 0 : userInfo.username), notificationData);
            }
        }
        yield competitionModel_1.UserTestExam.findOneAndUpdate({ userId: userInfo === null || userInfo === void 0 ? void 0 : userInfo._id }, {
            username: userInfo === null || userInfo === void 0 ? void 0 : userInfo.username,
            picture: userInfo === null || userInfo === void 0 ? void 0 : userInfo.picture,
            displayName: userInfo === null || userInfo === void 0 ? void 0 : userInfo.displayName,
        });
        res.status(200).json({
            userInfo,
            user,
            results: req.body.pastSchool,
            message: 'The verification status has been sent to the user successfully.',
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateUserVerification = updateUserVerification;
//-----------------FOLLOW USER--------------------//
const followUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { follow } = yield (0, query_1.followAccount)(req, res);
        let isFollowed = req.body.isFollowed;
        let followers = yield postModel_1.Follower.countDocuments({ userId: req.params.id });
        isFollowed = follow ? false : true;
        res.status(200).json({
            isFollowed: isFollowed,
            followers: followers,
            id: req.params.id,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.followUserAccount = followUserAccount;
const getUser = (user, id) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield userModel_1.User.findByIdAndUpdate(user._id, {
            isOnVerification: true,
            verifyingAt: new Date(),
        });
        yield userInfoModel_1.UserInfo.findByIdAndUpdate(id, {
            isOnVerification: true,
            verifyingAt: new Date(),
        });
        const newNotification = yield (0, sendEmail_1.sendNotification)('verification_processing', {
            username: String(user === null || user === void 0 ? void 0 : user.username),
            receiverUsername: String(user.username),
            userId: user._id,
            from: user._id,
        });
        const verifyingUsers = yield userModel_1.User.countDocuments({
            isOnVerification: true,
        });
        app_1.io.emit(String(user === null || user === void 0 ? void 0 : user._id), newNotification);
        app_1.io.emit('team', { action: 'verifying', type: 'stat', verifyingUsers });
    }
    const newUser = yield userModel_1.User.findById(user._id);
    return newUser;
});
