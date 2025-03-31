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
    try {
        const paperId = req.body.paperId;
        const userId = req.body.userId;
        const picture = req.body.picture;
        const started = Number(req.body.started);
        const ended = Number(req.body.ended);
        const attempts = Number(req.body.attempts);
        const instruction = req.body.instruction;
        const questions = req.body.questions ? JSON.parse(req.body.questions) : [];
        const rate = (1000 * questions.length) / (ended - started);
        let mainObjective = yield competitionModel_1.Objective.find({ paperId: paperId });
        let correctAnswer = 0;
        for (let i = 0; i < questions.length; i++) {
            const el = questions[i];
            for (let x = 0; x < el.options.length; x++) {
                const opt = el.options[x];
                if (opt.isSelected === opt.isClicked &&
                    opt.isSelected &&
                    opt.isClicked) {
                    correctAnswer++;
                }
            }
        }
        const accuracy = correctAnswer / questions.length;
        const metric = accuracy * rate;
        const updatedQuestions = [];
        for (let i = 0; i < mainObjective.length; i++) {
            const el = mainObjective[i];
            const objIndex = questions.findIndex((obj) => obj._id == el._id);
            if (objIndex !== -1) {
                const obj = {
                    isClicked: true,
                    paperId: paperId,
                    userId: userId,
                    question: el.question,
                    options: questions[objIndex].options,
                };
                updatedQuestions.push(obj);
            }
            else {
                const obj = {
                    isClicked: false,
                    paperId: paperId,
                    userId: userId,
                    question: el.question,
                    options: el.options,
                };
                updatedQuestions.push(obj);
            }
        }
        yield competitionModel_2.UserTestExam.updateOne({
            paperId,
            userId,
        }, {
            $set: {
                paperId,
                userId,
                picture,
                started,
                ended,
                attempts,
                rate,
                accuracy,
                metric,
                instruction,
                questions: mainObjective.length,
                attemptedQuestions: questions.length,
                totalCorrectAnswer: correctAnswer,
            },
        }, {
            upsert: true,
        });
        yield competitionModel_2.UserTest.deleteMany({ userId: userId, paperId: paperId });
        const insertedDocs = yield competitionModel_2.UserTest.insertMany(updatedQuestions);
        res
            .status(200)
            .json({ message: "Exam submitted successfully", results: insertedDocs });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.createExam = createExam;
const getExamById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.id);
    try {
        const item = yield competitionModel_1.Exam.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Exam not found" });
        }
        res.status(200).json(item);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getExamById = getExamById;
const getExams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(competitionModel_2.UserTest, req);
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
        yield competitionModel_1.Objective.findByIdAndDelete(id);
    }
    for (let i = 0; i < questions.length; i++) {
        const el = questions[i];
        if (el._id && el._id !== undefined && el._id !== "") {
            yield competitionModel_1.Objective.updateOne({ _id: el._id }, {
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
