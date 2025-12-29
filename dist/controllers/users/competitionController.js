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
exports.searchExamInfo = exports.updateExam = exports.getExams = exports.getUserExam = exports.getExamById = exports.initExam = exports.selectAnswer = exports.submitTest = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const competitionModel_1 = require("../../models/exam/competitionModel");
const query_1 = require("../../utils/query");
const competitionModel_2 = require("../../models/users/competitionModel");
const user_1 = require("../../models/users/user");
const objectiveModel_1 = require("../../models/exam/objectiveModel");
const bioUserState_1 = require("../../models/users/bioUserState");
const app_1 = require("../../app");
//-----------------Exam--------------------//
const submitTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paperId = req.body.paperId;
        const bioUserId = req.body.bioUserId;
        const ended = Number(req.body.ended);
        const started = Number(req.body.started);
        const questions = yield competitionModel_2.UserObjective.find({ paperId, bioUserId });
        const rate = (1000 * questions.length) / (ended - started);
        const paper = yield competitionModel_2.UserTestExam.findOne({
            paperId: paperId,
            bioUserId: bioUserId,
        });
        const attempts = !paper || (paper === null || paper === void 0 ? void 0 : paper.isFirstTime) ? 1 : Number(paper === null || paper === void 0 ? void 0 : paper.attempts) + 1;
        const correctAnswer = questions.filter((item) => item.isCorrect).length;
        const accuracy = correctAnswer / questions.length;
        const metric = accuracy * rate;
        const exam = yield competitionModel_2.UserTestExam.findOneAndUpdate({
            paperId,
            bioUserId,
        }, {
            $set: {
                ended,
                attempts,
                rate,
                accuracy,
                metric,
                attemptedQuestions: questions.length,
                totalCorrectAnswer: correctAnswer,
            },
        }, {
            new: true,
            upsert: true,
        });
        const docs = yield competitionModel_2.UserObjective.find({ paperId, bioUserId });
        if (docs.length) {
            const bulk = docs.map((doc) => {
                const newQuestions = doc.options.map((q) => (Object.assign(Object.assign({}, q), { isClicked: false, isSelected: false })));
                return {
                    updateOne: {
                        filter: { _id: doc._id },
                        update: { $set: { questions: newQuestions } },
                    },
                };
            });
            yield competitionModel_2.UserObjective.bulkWrite(bulk);
        }
        yield competitionModel_2.LastUserObjective.deleteMany({
            bioUserId: bioUserId,
            paperId: paperId,
        });
        yield competitionModel_2.LastUserObjective.insertMany(questions);
        const result = yield (0, query_1.queryData)(competitionModel_2.LastUserObjective, req);
        const data = {
            exam,
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
const selectAnswer = (body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let mainObjective = yield objectiveModel_1.Objective.findById(body.questionId);
        if (mainObjective) {
            let selectedOption = body.option;
            const options = mainObjective.options.map((item) => item.index === selectedOption.index
                ? Object.assign(Object.assign({}, selectedOption), { isSelected: item.isSelected, isClicked: item.value === selectedOption.value, objectiveId: body.questionId }) : item);
            const paper = yield competitionModel_2.UserObjective.findOneAndUpdate({ objectiveId: body.questionId }, { $set: { options: options } }, { new: true, upsert: true });
            app_1.io.emit(`test_${body.bioUserId}`, {
                paper,
            });
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.selectAnswer = selectAnswer;
const initExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paperId = req.body.paperId;
        const bioUserId = req.body.bioUserId;
        const questions = yield objectiveModel_1.Objective.find({ paperId });
        const ops = questions.map((el) => ({
            updateOne: {
                filter: { paperId, bioUserId, objectiveId: el._id },
                update: {
                    $set: Object.assign(Object.assign({}, el.toObject()), { bioUserId: bioUserId, objectiveId: el._id }),
                },
                upsert: true,
            },
        }));
        yield competitionModel_2.UserObjective.bulkWrite(ops);
        const exam = yield competitionModel_2.UserTestExam.findOneAndUpdate({
            paperId,
            bioUserId,
        }, {
            $set: req.body,
        }, {
            new: true,
            upsert: true,
        });
        yield competitionModel_1.Exam.updateOne({ _id: paperId }, {
            $inc: {
                participants: 1,
            },
        });
        yield bioUserState_1.BioUserState.findByIdAndUpdate({ bioUserId: bioUserId }, { $inc: { examAttempts: 1 } }, { new: true, upsert: true });
        yield user_1.User.updateMany({ bioUserId: bioUserId }, { $inc: { totalAttempts: 1 } });
        res.status(200).json({ exam });
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
            bioUserId: req.query.bioUserId,
            paperId: req.query.paperId,
        });
        const result = yield (0, query_1.queryData)(competitionModel_2.UserObjective, req);
        const last = yield (0, query_1.queryData)(competitionModel_2.LastUserObjective, req);
        const data = {
            exam,
            results: result.results,
            last: result.results,
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
