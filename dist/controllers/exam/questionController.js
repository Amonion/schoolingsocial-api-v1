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
exports.getObjectives = exports.createObjectives = exports.StartSchoolQuestionPapersCountDown = exports.assignSchoolQuestionPaper = exports.deleteSchoolQuestionPaper = exports.updateSchoolQuestionPaper = exports.searchSchoolQuestionPapers = exports.getSchoolQuestionPapers = exports.getSchoolQuestionPaperById = exports.createSchoolQuestionPaper = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const questionPaperModel_1 = require("../../models/exam/questionPaperModel");
const objectiveModel_1 = require("../../models/exam/objectiveModel");
//-----------------PAPER--------------------//
const createSchoolQuestionPaper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, questionPaperModel_1.SchoolQuestion, 'Question Paper was created successfully');
});
exports.createSchoolQuestionPaper = createSchoolQuestionPaper;
const getSchoolQuestionPaperById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield questionPaperModel_1.SchoolQuestion.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Question Paper not found' });
        }
        res.status(200).json({ data: item });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getSchoolQuestionPaperById = getSchoolQuestionPaperById;
const getSchoolQuestionPapers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(questionPaperModel_1.SchoolQuestion, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getSchoolQuestionPapers = getSchoolQuestionPapers;
const searchSchoolQuestionPapers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return (0, query_1.search)(questionPaperModel_1.SchoolQuestion, req, res);
});
exports.searchSchoolQuestionPapers = searchSchoolQuestionPapers;
const updateSchoolQuestionPaper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, questionPaperModel_1.SchoolQuestion, [], ['Question Paper not found', 'Question Paper was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateSchoolQuestionPaper = updateSchoolQuestionPaper;
const deleteSchoolQuestionPaper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield questionPaperModel_1.SchoolQuestion.findByIdAndDelete(req.params.id);
        yield objectiveModel_1.Objective.deleteMany({ paperId: req.params.id });
        const result = yield (0, query_1.queryData)(questionPaperModel_1.SchoolQuestion, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.deleteSchoolQuestionPaper = deleteSchoolQuestionPaper;
const assignSchoolQuestionPaper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const papers = req.body.selectedQuestions;
        const selectedClass = req.body.selectedClass;
        for (let i = 0; i < papers.length; i++) {
            const el = papers[i];
            for (let x = 0; x < selectedClass.length; x++) {
                const item = selectedClass[x];
                yield questionPaperModel_1.SchoolQuestion.findByIdAndUpdate(el._id, {
                    arm: item.arm,
                    level: item.level,
                    levelName: item.levelName,
                });
            }
        }
        const result = yield (0, query_1.queryData)(questionPaperModel_1.SchoolQuestion, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.assignSchoolQuestionPaper = assignSchoolQuestionPaper;
const StartSchoolQuestionPapersCountDown = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.query.isExpired = 'false';
    req.query.isOn = 'false';
    const { results } = yield (0, query_1.queryData)(questionPaperModel_1.SchoolQuestion, req);
    for (let i = 0; i < results.length; i++) {
        const el = results[i];
        const timeDiff = new Date().getTime() -
            new Date(el.questionDate).getTime() +
            el.startingTime;
        if (timeDiff <= 0) {
            yield questionPaperModel_1.SchoolQuestion.findByIdAndUpdate(el._id, {
                $set: { isOn: false, startingTime: 0, isExpired: true },
            });
        }
    }
    delete req.query.isExpired;
    delete req.query.isOn;
    next();
});
exports.StartSchoolQuestionPapersCountDown = StartSchoolQuestionPapersCountDown;
//-----------------OBJECTIVE--------------------//
const createObjectives = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const questions = JSON.parse(req.body.questions);
        const deletedIDs = JSON.parse(req.body.deletedIDs);
        for (let i = 0; i < deletedIDs.length; i++) {
            const id = deletedIDs[i];
            yield objectiveModel_1.Objective.findByIdAndDelete(id);
        }
        for (let i = 0; i < questions.length; i++) {
            const el = questions[i];
            if (el._id) {
                yield objectiveModel_1.Objective.findByIdAndUpdate(el._id, {
                    $set: {
                        question: el.question,
                        options: el.options,
                        index: el.index,
                        paperId: req.query.paperId,
                    },
                }, { upsert: true });
            }
            else {
                yield objectiveModel_1.Objective.create({
                    question: el.question,
                    options: el.options,
                    paperId: el.paperId,
                    index: el.index,
                });
            }
        }
        const result = yield (0, query_1.queryData)(objectiveModel_1.Objective, req);
        const numberOfQuestions = yield objectiveModel_1.Objective.countDocuments({
            paperId: req.query.paperId,
        });
        yield questionPaperModel_1.SchoolQuestion.findOneAndUpdate({ _id: req.query.paperId }, {
            totalQuestions: numberOfQuestions,
        });
        res.status(200).json({
            message: 'The question was saved successfully',
            count: result.count,
            results: result.results,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.createObjectives = createObjectives;
const getObjectives = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(objectiveModel_1.Objective, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getObjectives = getObjectives;
