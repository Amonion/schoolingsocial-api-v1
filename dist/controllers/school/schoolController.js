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
exports.updatePosition = exports.updateLevels = exports.searchSchools = exports.searchSchool = exports.deleteSchool = exports.recordAll = exports.updateSchool = exports.getStaff = exports.getSchoolNotifications = exports.getSchoolStaffs = exports.getSchools = exports.getSchoolByUsername = exports.getSchoolById = exports.cancelApplication = exports.approveSchoolApplication = exports.schoolApplication = exports.approveSchool = exports.createSchool = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const app_1 = require("../../app");
const fileUpload_1 = require("../../utils/fileUpload");
const user_1 = require("../../models/users/user");
const schoolModel_1 = require("../../models/school/schoolModel");
const bioUserState_1 = require("../../models/users/bioUserState");
const officeModel_1 = require("../../models/utility/officeModel");
const schoolStaffModel_1 = require("../../models/school/schoolStaffModel");
const bioUser_1 = require("../../models/users/bioUser");
const sendNotification_1 = require("../../utils/sendNotification");
const sendMessage_1 = require("../../utils/sendMessage");
const officialMessageModel_1 = require("../../models/message/officialMessageModel");
const socialNotificationModel_1 = require("../../models/message/socialNotificationModel");
const officeMessageTemplateModel_1 = require("../../models/message/officeMessageTemplateModel");
const createSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.levels = JSON.parse(req.body.levels);
    req.body.createdLocation = JSON.parse(req.body.createdLocation);
    req.body.isNew = true;
    try {
        const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
        uploadedFiles.forEach((file) => {
            req.body[file.fieldName] = file.s3Url;
        });
        const school = yield schoolModel_1.School.create(req.body);
        req.body.officeId = school._id;
        const office = yield officeModel_1.Office.create(req.body);
        const pendingOffice = {
            id: office._id,
            name: office.name,
            officeId: req.body.officeId,
            type: 'School',
            username: school.username,
        };
        const bioUserState = yield bioUserState_1.BioUserState.findOneAndUpdate({ bioUserId: school.bioUserId }, {
            $set: {
                processingOffice: true,
                bioUserUsername: school.bioUserUsername,
                pendingOffice: pendingOffice,
            },
        }, { upsert: true, new: true });
        app_1.io.emit(`notification_${school.bioUserUsername}`, { bioUserState });
        res.status(200).json({
            message: 'School was created successfully',
            data: school,
            office: office,
            bioUserState,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.createSchool = createSchool;
const approveSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const approved = req.body.isApproved;
        const school = yield schoolModel_1.School.findOneAndUpdate({ username: req.params.username }, req.body);
        const bioUser = yield bioUser_1.BioUser.findById(school.bioUserId);
        if (approved) {
            /////////////CREATE SOCIAL ACCOUNT////////////
            yield user_1.User.findOneAndUpdate({ username: school.username }, {
                isVerified: true,
                username: school.username,
                displayName: school.name,
                status: 'School',
                picture: school.logo,
                media: school.media,
                email: school.email,
                intro: school.description,
            }, { new: true, upsert: true });
            /////////////UPDATE OFFICE APPROVED////////////
            const office = yield officeModel_1.Office.findOneAndUpdate({ officeId: school._id }, {
                isApproved: approved,
                username: school.username,
                name: school.name,
                type: 'School',
                isUserActive: true,
                bioUserId: bioUser._id,
                bioUserPicture: bioUser.bioUserPicture,
                bioUserUsername: bioUser.bioUserUsername,
                level: 10,
                userType: 'Owner',
            }, { new: true, upsert: true });
            const offices = yield officeModel_1.Office.countDocuments({
                bioUserId: school.bioUserId,
                isApproved: approved,
            });
            const activeOffice = {
                id: office._id,
                name: school.name,
                officeId: school._id.toString(),
                type: office.type,
                username: school.username,
                position: 'Owner',
                level: 10,
                isUserActive: true,
            };
            yield bioUserState_1.BioUserState.findOneAndUpdate({ bioUserId: school.bioUserId }, {
                $addToSet: { offices: activeOffice },
                $set: {
                    processingOffice: false,
                    numberOfOffices: offices,
                    bioUserUsername: school.bioUserUsername,
                    activeOffice: activeOffice,
                },
            }, { upsert: true, new: true });
        }
        const bioUserState = yield bioUserState_1.BioUserState.findOne({
            bioUserId: school.bioUserId,
        });
        const newNotification = yield (0, sendNotification_1.sendPersonalNotification)(approved ? 'school_creation_approval' : 'school_creation_failed', {
            senderUsername: 'Schooling',
            receiverUsername: bioUser.bioUserUsername,
            senderName: 'Schooling Social',
            receiverName: bioUser.bioUserDisplayName,
            senderPicture: 'active-icon.png',
            receiverPicture: bioUser.bioUserPicture,
        });
        if (school.institutions.includes('Nursery') ||
            school.institutions.includes('Primary') ||
            school.institutions.includes('Secondary') ||
            school.levels.map((item) => item.levelName.includes('Nursery')) ||
            school.levels.map((item) => item.levelName.includes('Primary')) ||
            school.levels.map((item) => item.levelName.includes('Secondary'))) {
            (0, exports.updatePosition)(school, []);
        }
        const activeOffice = yield officeModel_1.Office.findOne({ officeId: school._id });
        const userOffices = yield officeModel_1.Office.find({ bioUserId: bioUser._id });
        app_1.io.emit(`notification_${school.bioUserUsername}`, Object.assign(Object.assign({}, newNotification), { bioUserState,
            activeOffice,
            userOffices }));
        res.status(200).json({
            message: approved
                ? 'School is approved successfully'
                : 'School is declined successfully',
            data: school,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.approveSchool = approveSchool;
const schoolApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bioUser = yield bioUser_1.BioUser.findById(req.body.bioUserId);
        const school = yield schoolModel_1.School.findById(req.params.id);
        const staff = yield officeModel_1.Office.findOneAndUpdate({ bioUserId: req.body.bioUserId, officeId: req.params.id }, {
            $set: {
                bioUserId: bioUser._id,
                bioUserDisplayName: bioUser.bioUserDisplayName,
                bioUserIntro: bioUser.bioUserIntro,
                bioUserMedia: bioUser.bioUserMedia,
                bioUserPicture: bioUser.bioUserPicture,
                bioUserUsername: bioUser.bioUserUsername,
                userType: req.body.userRegistration,
                schoolLevel: req.body.level,
                schoolLevelName: req.body.levelName,
                isUserApplied: true,
                name: school.name,
                username: school.username,
                officeId: school._id,
                logo: school.logo,
                area: school.area,
                state: school.state,
                country: school.country,
                continent: school.continent,
            },
        }, { new: true, upsert: true });
        if (req.body.userRegistration === 'Staff') {
            const officeMessage = yield (0, sendMessage_1.sendOfficialMessage)({
                senderUsername: bioUser.bioUserUsername,
                receiverUsername: school.username,
                senderName: bioUser.bioUserDisplayName,
                receiverName: school.name,
                senderPicture: bioUser.bioUserPicture,
                receiverPicture: school.logo,
                senderAddress: bioUser.residentAddress,
                senderArea: bioUser.residentArea,
                senderState: bioUser.residentState,
                senderCountry: bioUser.residentCountry,
                receiverAddress: school.address,
                receiverArea: school.area,
                receiverState: school.state,
                receiverCountry: school.country,
                title: req.body.title,
                content: req.body.content,
                greetings: req.body.greetings,
                unread: true,
            });
            const unreadStaffs = yield officeModel_1.Office.countDocuments({
                officeId: school._id,
                isUserApplied: true,
                userType: 'Staff',
            });
            app_1.io.emit(`official_message_${school.username}`, Object.assign(Object.assign({}, officeMessage), { unreadStaffs,
                staff }));
            app_1.io.emit(`official_message_${bioUser.bioUserUsername}`, Object.assign({}, officeMessage));
        }
        else {
            const socialNotification = yield (0, sendNotification_1.sendSocialNotification)('school_application', {
                senderUsername: bioUser.bioUserUsername,
                receiverUsername: school.username,
                senderName: bioUser.bioUserDisplayName,
                receiverName: school.name,
                senderPicture: bioUser.bioUserPicture,
                receiverPicture: school.logo,
            });
            const unreadStudents = yield officeModel_1.Office.countDocuments({
                officeId: school._id,
                isUserApplied: true,
                userType: 'Student',
            });
            app_1.io.emit(`school_social_notification_${school.username}`, Object.assign(Object.assign({}, socialNotification), { unreadStudents,
                staff }));
        }
        school.isApplied = true;
        res.status(200).json({
            message: 'Your school application was successful.',
            data: school,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.schoolApplication = schoolApplication;
const approveSchoolApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const applicants = req.body.selectedApplicants;
        const status = req.body.status;
        const office = yield officeModel_1.Office.findOne({ username: req.params.username });
        const message = yield officeMessageTemplateModel_1.OfficeMessageTemplate.findById(req.body.notificationId);
        const notifyUserApplication = (status, bioUser) => __awaiter(void 0, void 0, void 0, function* () {
            const officialMessage = yield (0, sendMessage_1.sendOfficialMessage)({
                greetings: message.greetings.replace('[Receiver]', bioUser.bioUserDisplayName),
                title: message.title,
                senderUsername: office.username,
                receiverUsername: bioUser.bioUserUsername,
                senderName: office.name,
                receiverName: bioUser.bioUserDisplayName,
                senderPicture: office.logo,
                receiverPicture: bioUser.bioUserPicture,
                senderAddress: office.address,
                senderArea: office.area,
                senderState: office.state,
                senderCountry: office.country,
                receiverAddress: bioUser.residentAddress,
                receiverArea: bioUser.residentArea,
                receiverState: bioUser.residentState,
                receiverCountry: bioUser.residentCountry,
                content: message.content,
                unread: true,
            });
            if (status) {
                const bioUserState = yield bioUserState_1.BioUserState.findOne({
                    bioUserId: bioUser._id,
                });
                app_1.io.emit(`official_message_${bioUser.bioUserUsername}`, Object.assign(Object.assign({}, officialMessage), { bioUserState }));
                app_1.io.emit(`school_staff_${req.params.username}`, Object.assign(Object.assign({}, officialMessage), { accepted: true, removeId: bioUser._id }));
            }
            else {
                app_1.io.emit(`official_message_${bioUser.bioUserUsername}`, officialMessage);
                app_1.io.emit(`school_staff_${req.body.senderUsername}`, Object.assign(Object.assign({}, officialMessage), { accepted: false }));
            }
        });
        for (let i = 0; i < applicants.length; i++) {
            const el = applicants[i];
            const bioUser = yield bioUser_1.BioUser.findOne({
                bioUserUsername: el.bioUserUsername,
            });
            if (status) {
                const activeOffice = {
                    id: office._id,
                    name: office.name,
                    officeId: office.officeId.toString(),
                    type: office.type,
                    username: office.username,
                    position: 'Unknown',
                    level: 1,
                    isUserActive: true,
                };
                yield bioUserState_1.BioUserState.findOneAndUpdate({ bioUserId: bioUser._id }, {
                    $addToSet: { offices: activeOffice },
                    $set: {
                        processingOffice: false,
                        bioUserUsername: bioUser.bioUserUsername,
                        activeOffice: activeOffice,
                    },
                    $inc: { numberOfOffices: 1 },
                }, { upsert: true, new: true });
                yield officeModel_1.Office.findOneAndUpdate({ username: office.username, bioUserId: bioUser._id }, {
                    $set: {
                        isUserActive: true,
                        isUserApplied: false,
                        name: office.name,
                        officeId: office.officeId.toString(),
                        type: office.type,
                        position: 'Unknown',
                        userType: req.body.userType,
                        level: 1,
                    },
                });
            }
            notifyUserApplication(status, bioUser);
        }
        const result = yield (0, query_1.queryData)(officeModel_1.Office, req);
        res.status(200).json({
            result,
            message: status
                ? 'The user application has been approved successfully.'
                : 'The user application has been declined successfully.',
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.approveSchoolApplication = approveSchoolApplication;
const cancelApplication = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bioUser = yield bioUser_1.BioUser.findById(req.query.bioUserId);
        const office = yield officeModel_1.Office.findOne({ officeId: req.params.id });
        const removeMsgId = yield officialMessageModel_1.OfficialMessage.findOne({
            senderUsername: req.query.username,
        }).select('_id');
        const msg = yield (0, sendNotification_1.sendSocialNotification)('school_application_removal', {
            senderUsername: bioUser.bioUserUsername,
            receiverUsername: office.username,
            senderName: bioUser.bioUserDisplayName,
            receiverName: office.name,
            senderPicture: bioUser.bioUserPicture,
            receiverPicture: office.logo,
            gender: bioUser.gender === 'Male' ? 'he' : 'she',
        });
        yield officeModel_1.Office.findOneAndDelete({
            bioUserId: req.query.bioUserId,
            officeId: req.params.id,
        });
        const unreadStaffs = yield officeModel_1.Office.countDocuments({
            officeId: req.params.id,
            isUserApplied: true,
        });
        app_1.io.emit(`school_staff_${office.username}`, Object.assign(Object.assign({}, msg), { removeId: removeMsgId._id, unreadStaffs, action: 'cancel_application', bioUserId: bioUser._id }));
        yield officialMessageModel_1.OfficialMessage.deleteMany({
            senderUsername: req.query.username,
        });
        const school = yield schoolModel_1.School.findById(req.params.id);
        school.isApplied = false;
        res.status(200).json({
            message: 'School application has been cancelled successfully.',
            data: school,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.cancelApplication = cancelApplication;
const getSchoolById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield schoolModel_1.School.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'School not found' });
        }
        res.status(200).json({ data: item });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getSchoolById = getSchoolById;
const getSchoolByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield schoolModel_1.School.findOne({ username: req.params.username });
        if (!item) {
            return res.status(404).json({ message: 'School not found' });
        }
        const isApplied = yield officeModel_1.Office.findOne({
            bioUserId: req.query.bioUserId,
            officeId: item._id,
        });
        const schoolPositions = yield officeModel_1.SchoolPosition.find({
            officeUsername: req.params.username,
        });
        item.isApplied = isApplied ? true : false;
        res.status(200).json({ data: item, schoolPositions });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getSchoolByUsername = getSchoolByUsername;
const getSchools = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(schoolModel_1.School, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getSchools = getSchools;
const getSchoolStaffs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(officeModel_1.Office, req);
        res.status(200).json({ count: result.count, results: result.results });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getSchoolStaffs = getSchoolStaffs;
const getSchoolNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const unreadStaffs = yield officeModel_1.Office.countDocuments({
            username: req.query.username,
            isUserApplied: true,
            userType: 'Staff',
        });
        const unreadStudents = yield officeModel_1.Office.countDocuments({
            username: req.query.username,
            isUserApplied: true,
            userType: 'Student',
        });
        const unreadMessages = yield officialMessageModel_1.OfficialMessage.countDocuments({
            receiverUsername: req.query.username,
            unread: true,
        });
        const unreadNotifications = yield socialNotificationModel_1.SocialNotification.countDocuments({
            receiverUsername: req.query.username,
            unread: true,
        });
        res.status(200).json({
            unreadStudents,
            unreadStaffs,
            unreadMessages,
            unreadNotifications,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getSchoolNotifications = getSchoolNotifications;
const getStaff = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staff = yield schoolStaffModel_1.SchoolStaff.findOne({
            bioUserId: req.params.id,
            schoolUsername: req.query.schoolUsername,
        });
        res.status(200).json({ staff: staff });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getStaff = getStaff;
const updateSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (req.body.studentRegistration) {
            req.body.studentRegistration = JSON.parse(req.body.studentRegistration);
        }
        if (req.body.staffRegistration) {
            req.body.staffRegistration = JSON.parse(req.body.staffRegistration);
        }
        if (req.body.isFirstTime) {
            req.body.isFirstTime = JSON.parse(req.body.isFirstTime);
        }
        if (req.body.createdLocation) {
            const createdLocation = JSON.parse(req.body.createdLocation);
            req.body.createdLocation = createdLocation;
        }
        if (req.body.levels) {
            const levels = JSON.parse(req.body.levels);
            const institutions = levels.map((item) => item.institution);
            req.body.institutions = institutions;
            req.body.levels = levels;
        }
        if (req.body.academicSession) {
            req.body.academicSession = JSON.parse(req.body.academicSession);
        }
        if (req.body.grading) {
            req.body.grading = JSON.parse(req.body.grading);
        }
        if (((_a = req.files) === null || _a === void 0 ? void 0 : _a.length) || req.file) {
            const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
            uploadedFiles.forEach((file) => {
                req.body[file.fieldName] = file.s3Url;
            });
        }
        if (req.body.officeId) {
            yield officeModel_1.Office.findOneAndUpdate({ officeId: req.body.officeId }, req.body, {
                upsert: true,
            });
        }
        else {
            yield officeModel_1.Office.create(req.body);
        }
        const school = yield schoolModel_1.School.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        const pendingOffice = {
            name: school.name,
            officeId: school._id.toString(),
            type: 'School',
            username: school.username,
        };
        const bioUserState = yield bioUserState_1.BioUserState.findOneAndUpdate({
            bioUserId: req.body.bioUserId,
        }, { processingOffice: true, pendingOffice: pendingOffice }, { upsert: true, new: true });
        if (school.institutions.includes('Nursery') ||
            school.institutions.includes('Primary') ||
            school.institutions.includes('Secondary') ||
            school.levels.map((item) => item.levelName.includes('Nursery')) ||
            school.levels.map((item) => item.levelName.includes('Primary')) ||
            school.levels.map((item) => item.levelName.includes('Secondary'))) {
            if (req.body.positions) {
                const positions = JSON.parse(req.body.positions);
                (0, exports.updatePosition)(school, positions);
            }
        }
        if (req.body.isFirstTime) {
            const bioUser = yield bioUser_1.BioUser.findById(req.body.bioUserId);
            const newNotification = yield (0, sendNotification_1.sendPersonalNotification)('school_creation', {
                senderUsername: 'Schooling',
                receiverUsername: bioUser.bioUserUsername,
                senderName: 'Schooling Social',
                receiverName: bioUser.bioUserDisplayName,
                senderPicture: 'active-icon.png',
                receiverPicture: bioUser.bioUserPicture,
            });
            app_1.io.emit(`notification_${bioUser === null || bioUser === void 0 ? void 0 : bioUser.bioUserUsername}`, Object.assign(Object.assign({}, newNotification), { bioUserState }));
        }
        res.status(200).json({
            data: school,
            bioUserState: req.body.bioUserId ? bioUserState : null,
            message: school.isApplied
                ? `Update on your school ${pendingOffice.name} is on review and you will be notified once approved.`
                : 'The school is updated successfully.',
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateSchool = updateSchool;
const recordAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield schoolModel_1.School.updateMany({}, // No filter — update all documents
        { $set: { isRecorded: true } });
        res.status(200).json({ response });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.recordAll = recordAll;
const deleteSchool = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, schoolModel_1.School, ['logo', 'media', 'picture'], 'School not found');
});
exports.deleteSchool = deleteSchool;
const searchSchool = (req, res) => {
    (0, query_1.search)(schoolModel_1.School, req, res);
};
exports.searchSchool = searchSchool;
const searchSchools = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const name = req.query.name;
        const skip = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.page_size) || 10;
        const schools = yield schoolModel_1.School.aggregate([
            {
                $group: {
                    _id: name ? `$${name}` : '$name',
                    place: { $first: '$$ROOT' },
                },
            },
            {
                $sort: { _id: 1 },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            },
            {
                $replaceRoot: { newRoot: '$place' },
            },
        ]);
        res.status(200).json({
            results: schools,
        });
    }
    catch (error) {
        console.error('Error fetching unique places:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.searchSchools = searchSchools;
const updateLevels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield schoolModel_1.School.find();
        for (let i = 0; i < items.length; i++) {
            const el = items[i];
            if (el.levelNames.length === 0 ||
                el.levelNames[i] === null ||
                el.levelNames === null ||
                el.levelNames === undefined) {
                // const levels: IAcademicLevel[] = JSON.parse(el.levels)
                // const arr = []
                // for (let x = 0; x < levels.length; x++) {
                //   const elm = levels[x]
                //   arr.push(elm.levelName)
                // }
                // await School.findByIdAndUpdate(el._id, { levelNames: arr })
            }
        }
        return res.status(200).json({ message: 'Schools updated successfully.' });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateLevels = updateLevels;
const updatePosition = (school, positions) => __awaiter(void 0, void 0, void 0, function* () {
    if (positions.length > 0) {
        for (let i = 0; i < positions.length; i++) {
            const el = positions[i];
            yield officeModel_1.SchoolPosition.findByIdAndUpdate({ _id: el._id }, { positionDivisions: el.positionDivisions });
        }
    }
    else {
        const oldPositions = yield officeModel_1.SchoolPosition.find({
            officeUsername: school.username,
        });
        if (oldPositions.length === 0) {
            for (let i = 0; i < school.levels.length; i++) {
                const level = school.levels[i];
                for (let x = 0; x < level.maxLevel; x++) {
                    yield officeModel_1.SchoolPosition.findOneAndUpdate({
                        officeUsername: school.username,
                        positionName: level.levelName,
                        positionsIndex: x,
                    }, {
                        officeName: school.name,
                        officeUsername: school.username,
                        positionName: level.levelName,
                        positionsIndex: Number(x),
                        positionDivisions: [{ arm: 'A', isChecked: false }],
                    }, { upsert: true });
                }
            }
        }
    }
});
exports.updatePosition = updatePosition;
