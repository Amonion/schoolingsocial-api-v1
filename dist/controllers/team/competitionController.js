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
exports.searchExamInfo = exports.getObjectives = exports.createObjective = exports.updatePaper = exports.getPapers = exports.getPaperById = exports.createPaper = exports.updateLeague = exports.getLeagues = exports.getLeagueById = exports.createLeague = exports.updateExam = exports.getExams = exports.getExamById = exports.createExam = exports.updateWeekend = exports.getWeekends = exports.getWeekendById = exports.createWeekend = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const competitionModel_1 = require("../../models/team/competitionModel");
const query_1 = require("../../utils/query");
const competitionModel_2 = require("../../models/users/competitionModel");
const createWeekend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, competitionModel_1.Weekend, "Weekend was created successfully");
});
exports.createWeekend = createWeekend;
const getWeekendById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield competitionModel_1.Weekend.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Weekend not found" });
        }
        res.status(200).json(item);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getWeekendById = getWeekendById;
const getWeekends = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(competitionModel_1.Weekend, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getWeekends = getWeekends;
const updateWeekend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, competitionModel_1.Weekend, ["video", "picture"], ["Weekend not found", "Weekend was updated successfully"]);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateWeekend = updateWeekend;
//-----------------Exam--------------------//
const createExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.body.continents) {
        req.body.continents = JSON.parse(req.body.continents);
    }
    if (req.body.countries) {
        req.body.countries = JSON.parse(req.body.countries);
    }
    if (req.body.countriesId) {
        req.body.countriesId = JSON.parse(req.body.countriesId);
    }
    if (req.body.states) {
        req.body.states = JSON.parse(req.body.states);
    }
    if (req.body.statesId) {
        req.body.statesId = JSON.parse(req.body.statesId);
    }
    if (req.body.academicLevels) {
        req.body.academicLevels = JSON.parse(req.body.academicLevels);
    }
    (0, query_1.createItem)(req, res, competitionModel_1.Exam, "Exam was created successfully");
});
exports.createExam = createExam;
const getExamById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield competitionModel_1.Exam.findById(req.params.id);
        const attempt = yield competitionModel_2.Attempt.findOne({
            paperId: req.params.id,
            userId: req.query.userId,
        });
        if (!item) {
            return res.status(404).json({ message: "Exam not found" });
        }
        res.status(200).json({ exam: item, attempt: attempt === null || attempt === void 0 ? void 0 : attempt.attempts });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getExamById = getExamById;
const getExams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(competitionModel_1.Exam, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getExams = getExams;
const updateExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, competitionModel_1.Exam, [], ["Exam not found", "Exam was updated successfully"]);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateExam = updateExam;
//-------------------LEAGUE--------------------//
const createLeague = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, competitionModel_1.League, "League was created successfully");
});
exports.createLeague = createLeague;
const getLeagueById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield competitionModel_1.League.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "League not found" });
        }
        res.status(200).json(item);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getLeagueById = getLeagueById;
const getLeagues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(competitionModel_1.League, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getLeagues = getLeagues;
const updateLeague = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, competitionModel_1.Paper, ["media", "picture"], ["Paper not found", "Paper was updated successfully"]);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateLeague = updateLeague;
//-----------------PAPER--------------------//
const createPaper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, competitionModel_1.Paper, "Paper was created successfully");
});
exports.createPaper = createPaper;
const getPaperById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield competitionModel_1.Paper.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Paper not found" });
        }
        res.status(200).json(item);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getPaperById = getPaperById;
const getPapers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(competitionModel_1.Paper, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getPapers = getPapers;
const updatePaper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, competitionModel_1.Paper, [], ["Paper not found", "Paper was updated successfully"]);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updatePaper = updatePaper;
//-----------------OBJECTIVE--------------------//
const createObjective = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const questions = JSON.parse(req.body.questions);
    const deletedIDs = JSON.parse(req.body.deletedIDs);
    for (let i = 0; i < deletedIDs.length; i++) {
        const id = deletedIDs[i];
        // await Objective.findByIdAndDelete(id);
    }
    for (let i = 0; i < questions.length; i++) {
        const el = questions[i];
        if (el._id !== undefined && el._id !== "") {
            yield competitionModel_1.Objective.findByIdAndUpdate(el._id, {
                $set: {
                    question: el.question,
                    options: el.options,
                    index: el.index,
                    paperId: el.paperId,
                },
            }, { upsert: true });
        }
        else {
            yield competitionModel_1.Objective.create({
                question: el.question,
                options: el.options,
                paperId: el.paperId,
                index: el.index,
            });
        }
    }
    const result = yield (0, query_1.queryData)(competitionModel_1.Objective, req);
    yield competitionModel_1.Exam.findOneAndUpdate({ _id: result.results[0].paperId }, {
        questions: result.count,
    });
    res.status(200).json({
        message: "The question was saved successfully",
        count: result.count,
        results: result.results,
        page_size: result.page_size,
    });
});
exports.createObjective = createObjective;
const getObjectives = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(competitionModel_1.Objective, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getObjectives = getObjectives;
const searchExamInfo = (req, res) => {
    return (0, query_1.search)(competitionModel_1.Exam, req, res);
};
exports.searchExamInfo = searchExamInfo;
