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
exports.deleteUpload = exports.updateUpload = exports.getUploads = exports.getUploadById = exports.createUploadVideo = exports.createUpload = void 0;
const uploadModel_1 = require("../../models/users/uploadModel");
const query_1 = require("../../utils/query");
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
