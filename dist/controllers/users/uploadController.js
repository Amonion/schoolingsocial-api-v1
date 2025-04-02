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
exports.multiSearch = exports.deleteUpload = exports.updateUpload = exports.getUploads = exports.getUploadById = exports.createUploadVideo = exports.createUpload = void 0;
const uploadModel_1 = require("../../models/users/uploadModel");
const query_1 = require("../../utils/query");
const errorHandler_1 = require("../../utils/errorHandler");
const userModel_1 = require("../../models/users/userModel");
const postModel_1 = require("../../models/users/postModel");
const schoolModel_1 = require("../../models/team/schoolModel");
const competitionModel_1 = require("../../models/team/competitionModel");
//--------------------UPLOADS-----------------------//
const createUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, uploadModel_1.Upload, "Uploads was created successfully");
});
exports.createUpload = createUpload;
const createUploadVideo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, uploadModel_1.Upload, "Uploads was created successfully");
});
exports.createUploadVideo = createUploadVideo;
const getUploadById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.getItemById)(req, res, uploadModel_1.Upload, "Upload was not found");
});
exports.getUploadById = getUploadById;
const getUploads = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.getItems)(req, res, uploadModel_1.Upload);
});
exports.getUploads = getUploads;
const updateUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.updateItem)(req, res, uploadModel_1.Upload, ["media"], ["Upload not found", "Upload was updated successfully"]);
});
exports.updateUpload = updateUpload;
const deleteUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, uploadModel_1.Upload, ["media"], "Upload not found");
});
exports.deleteUpload = deleteUpload;
const multiSearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const setType = (model) => {
            if (model === "User") {
                return "User";
            }
            else if (model === "Post") {
                return "Post";
            }
            else if (model === "School") {
                return "School";
            }
            else if (model === "Exam") {
                return "Exam";
            }
            else {
                return model;
            }
        };
        const setMedia = (media) => {
            if (media) {
                const item = {
                    type: media.type,
                    source: media.source,
                };
                return item;
            }
            else {
                return media;
            }
        };
        const models = [userModel_1.User, postModel_1.Post, schoolModel_1.School, competitionModel_1.Exam];
        const { filter, page, page_size } = (0, query_1.generalSearchQuery)(req);
        const searchPromises = models.map((model) => model
            .find(filter)
            .skip((page - 1) * page_size)
            .limit(page_size)
            .then((docs) => docs.map((doc) => (Object.assign(Object.assign({}, doc.toObject()), { model: model.modelName })))));
        const results = yield Promise.all(searchPromises);
        const combinedResults = results.flat();
        const formattedResults = combinedResults.map((item) => ({
            picture: item.picture || "",
            name: item.name || item.displayName || "",
            title: item.title || "",
            subtitle: item.subtitle || "",
            displayName: item.displayName || "",
            content: item.content || "",
            intro: item.intro || "",
            username: item.username || "",
            media: item.media ? setMedia(item.media[0]) : "",
            type: setType(item.model) || "",
            id: item._id.toString(),
            country: item.country,
            state: item.state,
            area: item.area,
            description: item.description,
            nature: item.type,
            subject: item.subjects,
        }));
        res.json(formattedResults);
    }
    catch (error) {
        console.error("Search Error:", error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.multiSearch = multiSearch;
