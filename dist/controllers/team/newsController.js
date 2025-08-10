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
exports.deleteNews = exports.updateNews = exports.getNews = exports.updateExamQuestions = exports.updateExams = exports.getNewsById = exports.createNews = void 0;
const newsModel_1 = require("../../models/team/newsModel");
const query_1 = require("../../utils/query");
const competitionModel_1 = require("../../models/team/competitionModel");
const createNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, newsModel_1.News, 'News was created successfully');
});
exports.createNews = createNews;
const getNewsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.getItemById)(req, res, newsModel_1.News, 'News was not found');
});
exports.getNewsById = getNewsById;
const updateExams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const waecLogo = yield newsModel_1.News.find({ tags: 'JAMBLogo' });
        yield competitionModel_1.Exam.updateMany({ name: 'JAMB' }, { logo: waecLogo[0].picture });
        const waecNews = yield newsModel_1.News.find({ tags: { $in: ['JAMB', 'WAEC'] } });
        const waecExams = yield competitionModel_1.Exam.find({ name: 'JAMB' });
        let x = 0;
        for (let i = 0; i < waecExams.length; i++) {
            const el = waecExams[i];
            yield competitionModel_1.Exam.findByIdAndUpdate(el._id, { picture: waecNews[x].picture });
            if (x === waecNews.length - 1) {
                x = 0;
            }
            else {
                x++;
            }
        }
        res.status(200).json({ message: 'News updated successfully.' });
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateExams = updateExams;
const updateExamQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exams = yield competitionModel_1.Exam.find().select('_id');
        for (let i = 0; i < exams.length; i++) {
            const el = exams[i];
            const questions = yield competitionModel_1.Objective.countDocuments({ paperId: el._id });
            yield competitionModel_1.Exam.findByIdAndUpdate(el, { questions: questions });
        }
        res.status(200).json({ message: 'News updated successfully.' });
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateExamQuestions = updateExamQuestions;
const getNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.getItems)(req, res, newsModel_1.News);
});
exports.getNews = getNews;
const updateNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.updateItem)(req, res, newsModel_1.News, ['picture', 'video'], ['News not found', 'News was updated successfully']);
});
exports.updateNews = updateNews;
const deleteNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, newsModel_1.News, ['picture', 'video'], 'News not found');
});
exports.deleteNews = deleteNews;
