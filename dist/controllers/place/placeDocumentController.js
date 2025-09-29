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
exports.deleteDocument = exports.getDocumentById = exports.getDocuments = exports.updateDocument = exports.createDocument = void 0;
const placeModel_1 = require("../../models/team/placeModel");
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
//-----------------DOCUMENT--------------------//
const createDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, placeModel_1.Document, 'Document was created successfully');
});
exports.createDocument = createDocument;
const updateDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, placeModel_1.Document, [], ['Document  not found', 'Document was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateDocument = updateDocument;
const getDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(placeModel_1.Document, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getDocuments = getDocuments;
const getDocumentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield placeModel_1.Document.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Document not found' });
        }
        res.status(200).json(item);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getDocumentById = getDocumentById;
const deleteDocument = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, placeModel_1.Document, [], 'Document not found');
});
exports.deleteDocument = deleteDocument;
