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
exports.deleteNews = exports.updateNews = exports.getNews = exports.getNewsById = exports.createNews = void 0;
const newsModel_1 = require("../../models/team/newsModel");
const query_1 = require("../../utils/query");
const createNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, newsModel_1.News, "News was created successfully");
});
exports.createNews = createNews;
const getNewsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.getItemById)(req, res, newsModel_1.News, "News was not found");
});
exports.getNewsById = getNewsById;
const getNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.getItems)(req, res, newsModel_1.News);
});
exports.getNews = getNews;
const updateNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.updateItem)(req, res, newsModel_1.News, ["picture", "video"], ["News not found", "News was updated successfully"]);
});
exports.updateNews = updateNews;
const deleteNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, newsModel_1.News, ["picture", "video"], "News not found");
});
exports.deleteNews = deleteNews;
