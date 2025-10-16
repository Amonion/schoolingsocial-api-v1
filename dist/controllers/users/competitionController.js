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
exports.searchExamInfo = exports.updateExam = exports.getExams = exports.getUserExam = exports.getExamById = exports.initExam = exports.submitTest = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const competitionModel_1 = require("../../models/exam/competitionModel");
const query_1 = require("../../utils/query");
const competitionModel_2 = require("../../models/users/competitionModel");
const user_1 = require("../../models/users/user");
const objectiveModel_1 = require("../../models/exam/objectiveModel");
const bioUserState_1 = require("../../models/users/bioUserState");
//-----------------Exam--------------------//
const submitTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paperId = req.body.paperId;
        const bioUserId = req.body.bioUserId;
        const username = req.body.username;
        const picture = req.body.picture;
        const displayName = req.body.displayName;
        const started = Number(req.body.started);
        const ended = Number(req.body.ended);
        // const attempts = Number(req.body.attempts);
        const instruction = req.body.instruction;
        const questions = req.body.questions ? JSON.parse(req.body.questions) : [];
        const rate = (1000 * questions.length) / (ended - started);
        let mainObjective = yield objectiveModel_1.Objective.find({ paperId: paperId });
        const paper = yield competitionModel_2.UserTestExam.findOne({
            paperId: paperId,
            bioUserId: bioUserId,
        });
        const attempts = !paper || (paper === null || paper === void 0 ? void 0 : paper.isFirstTime) ? 1 : Number(paper === null || paper === void 0 ? void 0 : paper.attempts) + 1;
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
        const accuracy = correctAnswer / mainObjective.length;
        const metric = accuracy * rate;
        const updatedQuestions = [];
        for (let i = 0; i < mainObjective.length; i++) {
            const el = mainObjective[i];
            const objIndex = questions.findIndex((obj) => obj._id == el._id);
            if (objIndex !== -1) {
                const obj = {
                    isClicked: questions[objIndex].isClicked,
                    paperId: paperId,
                    bioUserId: bioUserId,
                    question: el.question,
                    options: questions[objIndex].options,
                };
                updatedQuestions.push(obj);
            }
            else {
                const obj = {
                    isClicked: false,
                    paperId: paperId,
                    bioUserId: bioUserId,
                    question: el.question,
                    options: el.options,
                };
                updatedQuestions.push(obj);
            }
        }
        const exam = yield competitionModel_2.UserTestExam.findOneAndUpdate({
            paperId,
            bioUserId,
        }, {
            $set: {
                paperId,
                bioUserId,
                username,
                displayName,
                picture,
                started,
                ended,
                attempts,
                rate,
                accuracy,
                metric,
                instruction,
                isFirstTime: false,
                questions: mainObjective.length,
                attemptedQuestions: questions.length,
                totalCorrectAnswer: correctAnswer,
            },
        }, {
            new: true,
            upsert: true,
        });
        const bioUserState = yield bioUserState_1.BioUserState.findOneAndUpdate({ bioUserId: bioUserId }, { $inc: { examAttempts: (paper === null || paper === void 0 ? void 0 : paper.isFirstTime) ? 0 : 1 } }, { new: true, upsert: true });
        yield competitionModel_2.UserObjective.deleteMany({ bioUserId: bioUserId, paperId: paperId });
        yield competitionModel_2.UserObjective.insertMany(updatedQuestions);
        if (!paper) {
            yield competitionModel_1.Exam.updateOne({ _id: paperId }, {
                $inc: {
                    participants: 1,
                },
            });
        }
        const result = yield (0, query_1.queryData)(competitionModel_2.UserObjective, req);
        const data = {
            exam,
            bioUserState,
            attempt: Number(exam === null || exam === void 0 ? void 0 : exam.attempts),
            results: result.results,
            message: 'Exam submitted successfull',
        };
        res.status(200).json(data);
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.submitTest = submitTest;
const initExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paperId = req.body.paperId;
        const userId = req.body.userId;
        const username = req.body.username;
        const picture = req.body.picture;
        const displayName = req.body.displayName;
        const started = Number(req.body.started);
        const instruction = req.body.instruction;
        let questions = yield objectiveModel_1.Objective.countDocuments({ paperId: paperId });
        yield competitionModel_2.UserTestExam.findOneAndUpdate({
            paperId,
            userId,
        }, {
            $set: {
                paperId,
                userId,
                username,
                displayName,
                picture,
                started,
                attempts: 1,
                isFirstTime: true,
                rate: 0,
                accuracy: 0,
                instruction,
                questions: questions,
                attemptedQuestions: 0,
                totalCorrectAnswer: 0,
            },
        }, {
            new: true,
            upsert: true,
        });
        yield competitionModel_1.Exam.updateOne({ _id: paperId }, {
            $inc: {
                participants: 1,
            },
        });
        yield bioUserState_1.BioUserState.findByIdAndUpdate(userId, { $inc: { examAttempts: 1 } }, { new: true, upsert: true });
        yield user_1.User.updateMany({ userId: userId }, { $inc: { totalAttempts: 1 } });
        res.status(200).json({ message: 'Exam is initialized' });
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.initExam = initExam;
const getExamById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield competitionModel_1.Exam.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Exam not found' });
        }
        res.status(200).json(item);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getExamById = getExamById;
const getUserExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exam = yield competitionModel_2.UserTestExam.findOne({
            userId: req.query.userId,
            paperId: req.query.paperId,
        });
        const result = yield (0, query_1.queryData)(competitionModel_2.UserObjective, req);
        const data = {
            exam,
            results: result.results,
        };
        res.status(200).json(data);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getUserExam = getUserExam;
const getExams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(competitionModel_2.UserTestExam, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getExams = getExams;
const updateExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, competitionModel_1.Exam, [], ['Exam not found', 'Exam was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateExam = updateExam;
const searchExamInfo = (req, res) => {
    return (0, query_1.search)(competitionModel_1.Exam, req, res);
};
exports.searchExamInfo = searchExamInfo;
