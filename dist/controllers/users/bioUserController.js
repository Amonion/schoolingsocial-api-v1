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
exports.searchBioUserState = exports.searchBioUserSchoolInfo = exports.checkIsUserVerified = exports.getBioUsersState = exports.getBioUserSchoolByUsername = exports.getBioUserByUsername = exports.searchBioUsersSchool = exports.getTotalVerifyingUsers = exports.getBioUserPastSchools = exports.getBioUsers = exports.getBioUser = exports.getBioUserBank = exports.approveUser = exports.updateBioUserBank = exports.updateBioUserSettings = exports.updateBioSchool = exports.updateBioUserSchool = exports.updateBio = exports.updateBioUser = void 0;
const bioUser_1 = require("../../models/users/bioUser");
const fileUpload_1 = require("../../utils/fileUpload");
const app_1 = require("../../app");
const bioUserState_1 = require("../../models/users/bioUserState");
const errorHandler_1 = require("../../utils/errorHandler");
const schoolModel_1 = require("../../models/school/schoolModel");
const bioUserSchoolInfo_1 = require("../../models/users/bioUserSchoolInfo");
const academicLevelModel_1 = require("../../models/school/academicLevelModel");
const bioUserSettings_1 = require("../../models/users/bioUserSettings");
const bioUserBank_1 = require("../../models/users/bioUserBank");
const query_1 = require("../../utils/query");
const facultyModel_1 = require("../../models/school/facultyModel");
const departmentModel_1 = require("../../models/school/departmentModel");
const user_1 = require("../../models/users/user");
const postModel_1 = require("../../models/post/postModel");
const sendNotification_1 = require("../../utils/sendNotification");
const placeModel_1 = require("../../models/place/placeModel");
const officeModel_1 = require("../../models/utility/officeModel");
const updateBioUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    switch (req.body.action) {
        case 'Contact':
            const result = yield bioUser_1.BioUser.findOne({
                phone: req.body.phone,
                _id: { $ne: req.params.id },
            });
            if (result) {
                res.status(400).json({
                    message: `Sorry a user with this phone number: ${result.phone} already exist`,
                });
            }
            else {
                (0, exports.updateBio)(req, res);
            }
            break;
        case 'Public':
            req.body.isPublic = true;
            const uploadedProfileFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
            uploadedProfileFiles.forEach((file) => {
                req.body[file.fieldName] = file.s3Url;
            });
            req.body.verificationLocation = JSON.parse(req.body.location);
            (0, exports.updateBio)(req, res);
            break;
        case 'Bio':
            const uploadedProfileFiles1 = yield (0, fileUpload_1.uploadFilesToS3)(req);
            uploadedProfileFiles1.forEach((file) => {
                req.body[file.fieldName] = file.s3Url;
            });
            const firstName = req.body.firstName.charAt(0).toUpperCase() +
                req.body.firstName.slice(1).toLowerCase();
            const bioUserDisplayName = `${(_a = req.body.lastName) === null || _a === void 0 ? void 0 : _a[0].toUpperCase()}. ${(_b = req.body.middleName) === null || _b === void 0 ? void 0 : _b[0].toUpperCase()}. ${firstName}`;
            req.body.bioUserDisplayName = bioUserDisplayName;
            (0, exports.updateBio)(req, res);
            break;
        case 'Document':
            const user = yield bioUser_1.BioUser.findById(req.params.id);
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
                    yield bioUser_1.BioUser.updateOne({ _id: req.params.id }, { documents: documents }, {
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
                    yield bioUser_1.BioUser.updateOne({ _id: req.params.id }, { documents: documents }, {
                        new: true,
                        upsert: true,
                    });
                }
            }
            (0, exports.updateBio)(req, res);
            break;
        default:
            (0, exports.updateBio)(req, res);
            break;
    }
});
exports.updateBioUser = updateBioUser;
const updateBio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bioUser = yield bioUser_1.BioUser.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        yield bioUserSchoolInfo_1.BioUserSchoolInfo.findOneAndUpdate({ bioUserId: req.params.id }, {
            bioUserUsername: bioUser.bioUserUsername,
            bioUserPicture: bioUser.bioUserPicture,
            bioUserMedia: bioUser.bioUserMedia,
            bioUserDisplayName: bioUser.bioUserDisplayName,
            bioUserIntro: bioUser.bioUserIntro,
        }, {
            new: true,
            runValidators: false,
        });
        yield user_1.User.updateMany({ bioUserId: req.params.id }, {
            bioUserUsername: bioUser.bioUserUsername,
        }, {
            new: true,
            runValidators: false,
        });
        const bioUserState = yield bioUserState_1.BioUserState.findOneAndUpdate({ bioUserId: req.params.id }, req.body, {
            new: true,
            runValidators: false,
        });
        const isUserReady = yield (0, exports.checkIsUserVerified)(String(bioUser._id));
        if (isUserReady &&
            !bioUserState.isOnVerification &&
            !bioUserState.isVerified) {
            sendVerificationProcessingNotifications(bioUser._id.toString());
            yield bioUserState_1.BioUserState.findOneAndUpdate({ bioUserId: req.params.id }, { isOnVerification: true }, {
                new: true,
                runValidators: false,
            });
        }
        res.status(200).json({
            bioUserState,
            bioUser,
            results: req.body.pastSchool,
            message: 'your account is updated  successfully',
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateBio = updateBio;
const updateBioUserSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    switch (req.body.action) {
        case 'Education':
            if (req.body.schoolAcademicLevel) {
                req.body.schoolAcademicLevel = JSON.parse(req.body.schoolAcademicLevel);
            }
            req.body.isEducation = true;
            if (req.body.isNew && req.body.inSchool) {
                const academicLevel = req.body.schoolAcademicLevel;
                const result = yield schoolModel_1.School.findOne({
                    isNew: true,
                    name: req.body.schoolName,
                });
                const level = yield academicLevelModel_1.AcademicLevel.findOne({
                    country: req.body.schoolCountry,
                    levelName: academicLevel.levelName,
                });
                const form = {
                    institutions: [level === null || level === void 0 ? void 0 : level.institution],
                    levels: [level],
                    name: req.body.schoolName,
                    area: req.body.schoolArea,
                    state: req.body.schoolState,
                    country: req.body.schoolCountry,
                    countrySymbol: req.body.schoolCountrySymbol,
                    continent: req.body.schoolContinent,
                    isNew: true,
                };
                if (!result) {
                    const school = yield schoolModel_1.School.create(form);
                    if (academicLevel &&
                        !academicLevel.levelName.includes('Primary') &&
                        !academicLevel.levelName.includes('Secondary') &&
                        req.body.inSchool === 'Yes') {
                        const facultyForm = {
                            schoolId: school._id,
                            school: school.name,
                            name: req.body.schoolFaculty,
                            isNew: true,
                        };
                        const faculty = yield facultyModel_1.Faculty.create(facultyForm);
                        const departmentForm = {
                            facultyId: faculty._id,
                            faculty: faculty.name,
                            name: req.body.schoolDepartment,
                            isNew: true,
                        };
                        yield departmentModel_1.Department.create(departmentForm);
                    }
                    const newSchools = yield schoolModel_1.School.countDocuments({ isNew: true });
                    app_1.io.emit('team', { action: 'new', type: 'school', newSchools });
                }
                else {
                    yield schoolModel_1.School.findByIdAndUpdate(result === null || result === void 0 ? void 0 : result._id, form);
                }
            }
            (0, exports.updateBioSchool)(req, res);
            break;
        case 'EducationHistory':
            if (req.body.hasPastSchool) {
                req.body.pastSchools = JSON.parse(req.body.pastSchools);
                const pasts = req.body.pastSchools;
                for (let i = 0; i < pasts.length; i++) {
                    const el = pasts[i];
                    const level = yield academicLevelModel_1.AcademicLevel.findOne({
                        country: el.schoolCountry,
                        level: el.level,
                    });
                    const { _id } = el, rest = __rest(el, ["_id"]);
                    if (_id) {
                        yield bioUserSchoolInfo_1.PastSchool.findByIdAndUpdate(_id, rest);
                    }
                    else {
                        yield bioUserSchoolInfo_1.PastSchool.findOneAndUpdate({
                            bioUserId: el.bioUserId,
                            schoolName: el.schoolName,
                        }, { $set: rest }, { upsert: true });
                    }
                    if (!el.schoolUsername && level) {
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
                        yield schoolModel_1.School.create(form);
                        const newSchools = yield schoolModel_1.School.countDocuments({ isNew: true });
                        app_1.io.emit('team', { action: 'new', type: 'school', newSchools });
                    }
                }
            }
            (0, exports.updateBioSchool)(req, res);
            break;
        case 'EducationDocument':
            const pastSchools = JSON.parse(req.body.pastSchools);
            const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
            uploadedFiles.forEach((file) => {
                req.body[file.fieldName] = file.s3Url;
            });
            pastSchools[req.body.number].schoolCertificate = req.body.certificate;
            pastSchools[req.body.number].schoolTempCertificate = undefined;
            for (let i = 0; i < pastSchools.length; i++) {
                const el = pastSchools[i];
                const { _id } = el, rest = __rest(el, ["_id"]);
                yield bioUserSchoolInfo_1.PastSchool.findByIdAndUpdate(_id, rest);
            }
            req.body.isEducationDocument = true;
            (0, exports.updateBioSchool)(req, res);
            break;
        default:
            (0, exports.updateBioSchool)(req, res);
            break;
    }
});
exports.updateBioUserSchool = updateBioUserSchool;
const updateBioSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pastSchools = yield bioUserSchoolInfo_1.PastSchool.find({ bioUserId: req.params.id });
        const bioUserSchoolInfo = yield bioUserSchoolInfo_1.BioUserSchoolInfo.findOneAndUpdate({ bioUserId: req.params.id }, req.body, {
            new: true,
        });
        const bioUserState = yield bioUserState_1.BioUserState.findOneAndUpdate({
            bioUserId: bioUserSchoolInfo.bioUserId,
        }, req.body, {
            new: true,
        });
        const isUserReady = yield (0, exports.checkIsUserVerified)(String(bioUserSchoolInfo.bioUserId));
        if (isUserReady &&
            !bioUserState.isOnVerification &&
            !bioUserState.isVerified) {
            sendVerificationProcessingNotifications(bioUserSchoolInfo.bioUserId);
        }
        res.status(200).json({
            bioUserState,
            bioUserSchoolInfo,
            pastSchools: pastSchools,
            message: 'your account is updated  successfully',
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateBioSchool = updateBioSchool;
const updateBioUserSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userSettings = JSON.parse(req.body.bioUserSettings);
        const { bioUserId } = userSettings, settings = __rest(userSettings, ["bioUserId"]);
        const bioUserSettings = yield bioUserSettings_1.BioUserSettings.findOneAndUpdate({ bioUserId: req.params.id }, settings, {
            new: true,
        });
        res.status(200).json({
            bioUserSettings,
            message: 'Your settings is updated successfully',
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateBioUserSettings = updateBioUserSettings;
const updateBioUserBank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bioUserBank = yield bioUserBank_1.BioUserBank.findOneAndUpdate({ bioUserId: req.params.id }, req.body, {
            new: true,
        });
        res.status(200).json({
            data: bioUserBank,
            message: 'Your bank details is updated successfully',
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateBioUserBank = updateBioUserBank;
const approveUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verificationStatus = req.body.verificationStatus === 'Approved' ? true : false;
        req.body.isVerified = verificationStatus;
        req.body.isOnVerification = !verificationStatus;
        const authorityName = req.body.authorityName;
        const authorityLevel = req.body.authorityLevel;
        yield user_1.User.updateMany({ bioUserUsername: req.params.username }, req.body);
        const bioUser = yield bioUser_1.BioUser.findOneAndUpdate({ bioUserUsername: req.params.username }, req.body, {
            new: true,
        });
        const user = yield user_1.User.findOneAndUpdate({
            bioUserId: bioUser._id,
            isVerified: true,
        });
        yield postModel_1.Post.updateMany({ bioUserId: bioUser._id }, req.body);
        const bioUserSchoolInfo = yield bioUserSchoolInfo_1.BioUserSchoolInfo.findOneAndUpdate({ bioUserUsername: req.params.username }, req.body, {
            new: true,
        });
        const bioUserState = yield bioUserState_1.BioUserState.findOneAndUpdate({ bioUserUsername: req.params.username }, req.body, {
            new: true,
        });
        const verifyingUsers = yield bioUserState_1.BioUserState.countDocuments({
            isOnVerification: true,
        });
        if (authorityName) {
            const country = yield placeModel_1.Place.findOne({ area: bioUser.homeArea });
            const office = yield officeModel_1.Office.findOneAndUpdate({ bioUserId: req.body.bioUserId, officeId: req.params.id }, {
                $set: {
                    bioUserId: bioUser._id,
                    bioUserDisplayName: bioUser.bioUserDisplayName,
                    bioUserIntro: bioUser.bioUserIntro,
                    bioUserMedia: bioUser.bioUserMedia,
                    bioUserPicture: bioUser.bioUserPicture,
                    bioUserUsername: bioUser.bioUserUsername,
                    userType: authorityName,
                    level: authorityLevel,
                    isUserApplied: true,
                    name: country.country,
                    username: authorityName.replace(' ', '_'),
                    officeId: country._id,
                    logo: country.countryFlag,
                    area: country.area,
                    state: country.state,
                    country: country.country,
                    continent: country.continent,
                    type: 'Authority',
                },
            }, { new: true, upsert: true });
            const activeOffice = {
                id: office._id,
                name: office.name,
                officeId: office.officeId.toString(),
                type: office.type,
                username: office.username,
                position: authorityName,
                level: authorityLevel,
                isUserActive: true,
            };
            yield bioUserState_1.BioUserState.findOneAndUpdate({ bioUserId: bioUser._id }, {
                $addToSet: { offices: activeOffice },
                $set: {
                    activeOffice: activeOffice,
                },
                $inc: { numberOfOffices: 1 },
            });
            yield bioUser_1.BioUser.findOneAndUpdate({ _id: bioUser._id }, {
                $set: {
                    authorityLevel: authorityLevel,
                    authorityName: authorityName,
                },
            });
            app_1.io.emit(`update_state_${String(bioUser === null || bioUser === void 0 ? void 0 : bioUser.bioUserUsername)}`, {
                bioUserState,
            });
        }
        const newNotification = yield (0, sendNotification_1.sendPersonalNotification)(verificationStatus ? 'verification_successful' : 'verification_failed', {
            senderUsername: 'Schooling',
            receiverUsername: bioUser.bioUserUsername,
            senderPicture: 'active-icon.png',
            receiverPicture: bioUser.bioUserPicture,
            senderName: 'Schooling Social',
            receiverName: bioUser.bioUserDisplayName,
        });
        app_1.io.emit(`personal_notification_${String(bioUser === null || bioUser === void 0 ? void 0 : bioUser._id)}`, Object.assign(Object.assign({}, newNotification), { bioUser,
            bioUserSchoolInfo,
            bioUserState,
            user }));
        res.status(200).json({
            data: bioUser,
            bioUserSchoolInfo,
            bioUserState,
            verifyingUsers,
            message: 'The user has been verified successfully.',
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.approveUser = approveUser;
const getBioUserBank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bioUserBank = yield bioUserBank_1.BioUserBank.findOne({ bioUserId: req.params.id });
        res.status(200).json({
            data: bioUserBank,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getBioUserBank = getBioUserBank;
const getBioUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bioUser = yield bioUser_1.BioUser.findById(req.params.id);
        res.status(200).json({
            data: bioUser,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getBioUser = getBioUser;
const getBioUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(bioUser_1.BioUser, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getBioUsers = getBioUsers;
const getBioUserPastSchools = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pastSchools = yield bioUserSchoolInfo_1.PastSchool.find({
            bioUserUsername: req.params.username,
        });
        res.status(200).json({ pastSchools });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getBioUserPastSchools = getBioUserPastSchools;
const getTotalVerifyingUsers = (user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifyingUsers = yield bioUserState_1.BioUserState.countDocuments({
            isOnVerification: true,
        });
        app_1.io.emit(`verifying_users${user.username}`, { verifyingUsers });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getTotalVerifyingUsers = getTotalVerifyingUsers;
const searchBioUsersSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, query_1.search)(bioUserSchoolInfo_1.BioUserSchoolInfo, req, res);
});
exports.searchBioUsersSchool = searchBioUsersSchool;
const getBioUserByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bioUser = yield bioUser_1.BioUser.findOne({
            bioUserUsername: req.params.username,
        });
        res.status(200).json({
            data: bioUser,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getBioUserByUsername = getBioUserByUsername;
const getBioUserSchoolByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bioUser = yield bioUserSchoolInfo_1.BioUserSchoolInfo.findOne({
            bioUserUsername: req.params.username,
        });
        res.status(200).json({
            data: bioUser,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getBioUserSchoolByUsername = getBioUserSchoolByUsername;
const getBioUsersState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(bioUserState_1.BioUserState, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getBioUsersState = getBioUsersState;
const checkIsUserVerified = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bioUserState = yield bioUserState_1.BioUserState.findOne({ bioUserId: id });
        if (bioUserState &&
            bioUserState.isBio &&
            bioUserState.isContact &&
            bioUserState.isDocument &&
            bioUserState.isOrigin &&
            bioUserState.isEducation &&
            bioUserState.isEducationHistory &&
            bioUserState.isPublic &&
            bioUserState.isEducationDocument &&
            bioUserState.isRelated) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        return false;
    }
});
exports.checkIsUserVerified = checkIsUserVerified;
const sendVerificationProcessingNotifications = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const bioUser = yield bioUser_1.BioUser.findById(id);
    yield bioUserState_1.BioUserState.findOneAndUpdate({ bioUserId: id }, { isOnVerification: true }, {
        new: true,
        runValidators: false,
    });
    const newNotification = yield (0, sendNotification_1.sendPersonalNotification)('verification_processing', {
        senderUsername: 'Schooling',
        receiverUsername: bioUser.bioUserUsername,
        senderPicture: 'active-icon.png',
        receiverPicture: bioUser.bioUserPicture,
        senderName: 'Schooling Social',
        receiverName: bioUser.bioUserDisplayName,
    });
    const verifyingUsers = yield bioUserState_1.BioUserState.countDocuments({
        isOnVerification: true,
    });
    app_1.io.emit(`personal_notification_${bioUser === null || bioUser === void 0 ? void 0 : bioUser._id}`, newNotification);
    app_1.io.emit('team', { action: 'verifying', type: 'stat', verifyingUsers });
});
const searchBioUserSchoolInfo = (req, res) => {
    return (0, query_1.search)(bioUserSchoolInfo_1.BioUserSchoolInfo, req, res);
};
exports.searchBioUserSchoolInfo = searchBioUserSchoolInfo;
const searchBioUserState = (req, res) => {
    return (0, query_1.search)(bioUserState_1.BioUserState, req, res);
};
exports.searchBioUserState = searchBioUserState;
