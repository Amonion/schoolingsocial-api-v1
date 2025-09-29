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
exports.getOfficeMessageTemplates = exports.createOfficeMessageTemplate = exports.searchOffice = exports.assignClass = exports.assignSubjects = exports.assignStaffRole = exports.getOfficeByUsername = exports.updateOfficeMessageTemplateById = exports.getOfficeMessageTemplateById = exports.getOffices = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const officeModel_1 = require("../../models/utility/officeModel");
const officeMessageTemplateModel_1 = require("../../models/message/officeMessageTemplateModel");
const bioUserState_1 = require("../../models/users/bioUserState");
const app_1 = require("../../app");
const staffPositionModel_1 = require("../../models/school/staffPositionModel");
const academicLevelModel_1 = require("../../models/school/academicLevelModel");
const bioUserSchoolInfo_1 = require("../../models/users/bioUserSchoolInfo");
const schoolModel_1 = require("../../models/school/schoolModel");
const getOffices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield (0, query_1.queryData)(officeModel_1.Office, req);
        res.status(200).json(results);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getOffices = getOffices;
const getOfficeMessageTemplateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield officeMessageTemplateModel_1.OfficeMessageTemplate.findById(req.params.id);
        res.status(200).json({ data });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getOfficeMessageTemplateById = getOfficeMessageTemplateById;
const updateOfficeMessageTemplateById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield officeMessageTemplateModel_1.OfficeMessageTemplate.findByIdAndUpdate(req.params.id, req.body);
        const results = yield (0, query_1.queryData)(officeMessageTemplateModel_1.OfficeMessageTemplate, req);
        res.status(200).json(results);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateOfficeMessageTemplateById = updateOfficeMessageTemplateById;
const getOfficeByUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield officeModel_1.Office.findOne({
            username: req.params.username,
            bioUserUsername: req.query.bioUserUsername,
        });
        res.status(200).json({ data });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getOfficeByUsername = getOfficeByUsername;
const assignStaffRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const staffPositions = req.body.staffPositions;
        const selectedStaffs = req.body.selectedStaffs;
        const staffType = req.body.staffType;
        for (let i = 0; i < selectedStaffs.length; i++) {
            const staff = selectedStaffs[i];
            for (let x = 0; x < staffPositions.length; x++) {
                const position = staffPositions[x];
                yield staffPositionModel_1.StaffPosition.findOneAndUpdate({
                    officeUsername: req.query.username,
                    bioUserUsername: staff.bioUserUsername,
                    level: position.index + 1,
                    levelName: position.name,
                    arm: position.arm,
                }, {
                    officeUsername: req.query.username,
                    bioUserUsername: staff.bioUserUsername,
                    bioUserDisplayName: staff.bioUserDisplayName,
                    bioUserPicture: staff.bioUserPicture,
                    level: position.index + 1,
                    levelName: position.name,
                    arm: position.arm,
                }, { upsert: true });
            }
            const office = yield officeModel_1.Office.findOne({
                bioUserUsername: staff.bioUserUsername,
                username: staff.username,
                userType: staffType,
            });
            const bioUserState = yield bioUserState_1.BioUserState.findOneAndUpdate({
                bioUserUsername: staff.bioUserUsername,
                'offices.username': office.username,
            }, {
                $set: {
                    'activeOffice.position': staffType,
                    'offices.$.position': staffType,
                },
            }, { new: true });
            app_1.io.emit(`school_staff_${staff.bioUserUsername}`, {
                bioUserState,
                office,
                action: 'role_assignment',
            });
        }
        const results = yield (0, query_1.queryData)(officeModel_1.Office, req);
        res.status(200).json(Object.assign(Object.assign({}, results), { message: 'The positions has been assigned successfully' }));
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.assignStaffRole = assignStaffRole;
const assignSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const selectedSubjects = req.body.selectedSubjects;
        const selectedStaffs = req.body.selectedStaffs;
        for (let i = 0; i < selectedStaffs.length; i++) {
            const staff = selectedStaffs[i];
            for (let x = 0; x < selectedSubjects.length; x++) {
                const subject = selectedSubjects[x];
                yield academicLevelModel_1.StaffSubject.findOneAndUpdate({
                    officeUsername: req.query.username,
                    bioUserUsername: staff.bioUserUsername,
                    level: subject.level,
                    levelName: subject.levelName,
                    name: subject.name,
                }, {
                    officeUsername: req.query.username,
                    bioUserUsername: staff.bioUserUsername,
                    level: subject.level,
                    bioUserDisplayName: staff.bioUserDisplayName,
                    levelName: subject.levelName,
                    curriculumTitle: subject.curriculumTitle,
                    description: subject.description,
                    name: subject.name,
                    subjectCode: subject.subjectCode,
                    staffPicture: subject.picture,
                }, { upsert: true });
            }
        }
        const results = yield (0, query_1.queryData)(officeModel_1.Office, req);
        res.status(200).json(Object.assign(Object.assign({}, results), { message: 'The positions has been assigned successfully' }));
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.assignSubjects = assignSubjects;
const assignClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const selectedClass = req.body.selectedClass;
        const selectedStudents = req.body.selectedStudents;
        const school = yield schoolModel_1.School.findOne({ username: req.query.username });
        const academicLevel = yield academicLevelModel_1.AcademicLevel.findOne({
            levelName: selectedClass.name,
        });
        for (let i = 0; i < selectedStudents.length; i++) {
            const student = selectedStudents[i];
            yield officeModel_1.Office.findByIdAndUpdate(student._id, {
                bioUserUsername: student.bioUserUsername,
                schoolLevel: selectedClass.index + 1,
                schoolLevelName: selectedClass.name,
                arm: selectedClass.arm,
            });
            const bioUserState = yield bioUserState_1.BioUserState.findOneAndUpdate({
                bioUserUsername: student.bioUserUsername,
                'offices.username': student.username,
            }, {
                $set: {
                    'activeOffice.position': 'Student',
                    'offices.$.position': 'Student',
                },
            }, { new: true });
            const bioUserSchoolInfo = yield bioUserSchoolInfo_1.BioUserSchoolInfo.findOneAndUpdate({
                bioUserUsername: student.bioUserUsername,
            }, {
                $set: {
                    admittedAt: new Date(),
                    inSchool: true,
                    isAdvanced: false,
                    isSchoolVerified: true,
                    schoolAcademicLevel: academicLevel,
                    schoolArea: school.area,
                    schoolArm: selectedClass.arm,
                    schoolClass: selectedClass.name,
                    schoolClassLevel: selectedClass.index + 1,
                    schoolContinent: school.continent,
                    schoolCountry: school.country,
                    schoolCountryFlag: school.countryFlag,
                    schoolCountrySymbol: school.countrySymbol,
                    schoolId: school._id.toString(),
                    schoolLogo: school.logo,
                    schoolName: school.name,
                    schoolPicture: school.picture,
                    schoolPlaceId: school.placeId,
                    schoolState: school.state,
                    schoolUsername: school.username,
                },
            }, { new: true });
            app_1.io.emit(`school_student_${student.bioUserUsername}`, {
                bioUserState,
                bioUserSchoolInfo,
                student,
                action: 'role_assignment',
            });
        }
        const result = yield (0, query_1.queryData)(officeModel_1.Office, req);
        res.status(200).json({
            results: result.results,
            count: result.count,
            message: 'The positions has been assigned successfully',
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.assignClass = assignClass;
const searchOffice = (req, res) => {
    return (0, query_1.search)(officeModel_1.Office, req, res);
};
exports.searchOffice = searchOffice;
const createOfficeMessageTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, officeMessageTemplateModel_1.OfficeMessageTemplate, 'The notification template was created successfully');
});
exports.createOfficeMessageTemplate = createOfficeMessageTemplate;
const getOfficeMessageTemplates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield (0, query_1.queryData)(officeMessageTemplateModel_1.OfficeMessageTemplate, req);
        res.status(200).json(results);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getOfficeMessageTemplates = getOfficeMessageTemplates;
