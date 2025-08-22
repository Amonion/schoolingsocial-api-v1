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
exports.getUniquePlaces = exports.searchPlaces = exports.searchPlace = exports.deletePlaces = exports.deletePlace = exports.updatePlace = exports.getAllPlaces = exports.getPlaces = exports.getPlaceById = exports.createPlace = exports.deleteBank = exports.getBankById = exports.getBanks = exports.updateBank = exports.createBank = exports.deleteDocument = exports.getDocumentById = exports.getDocuments = exports.updateDocument = exports.createDocument = exports.deleteAcademicLevel = exports.getAcademicLevels = exports.getAcademicLevelById = exports.updateAcademicLevel = exports.createAcademicLevel = exports.deleteAd = exports.updateAd = exports.getAds = exports.getAdById = exports.cleanPlaces = exports.createAd = exports.deletePayment = exports.updatePayment = exports.getPayments = exports.getPaymentById = exports.createPayment = void 0;
const academicLevelModel_1 = require("../../models/team/academicLevelModel");
const placeModel_1 = require("../../models/team/placeModel");
const paymentModel_1 = require("../../models/team/paymentModel");
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const fileUpload_1 = require("../../utils/fileUpload");
const adModel_1 = require("../../models/utility/adModel");
const competitionModel_1 = require("../../models/team/competitionModel");
const newsModel_1 = require("../../models/team/newsModel");
const schoolModel_1 = require("../../models/team/schoolModel");
//--------------------PAYMENTS-----------------------//
const createPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, paymentModel_1.Payment, 'Payments was created successfully');
});
exports.createPayment = createPayment;
const getPaymentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.getItemById)(req, res, paymentModel_1.Payment, 'Payment was not found');
});
exports.getPaymentById = getPaymentById;
const getPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.getItems)(req, res, paymentModel_1.Payment);
});
exports.getPayments = getPayments;
const updatePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.updateItem)(req, res, paymentModel_1.Payment, ['logo'], ['Payment not found', 'Payment was updated successfully']);
});
exports.updatePayment = updatePayment;
const deletePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, paymentModel_1.Payment, ['logo'], 'Payment not found');
});
exports.deletePayment = deletePayment;
//--------------------ADS-----------------------//
const createAd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, adModel_1.Ad, 'Ads was created successfully');
});
exports.createAd = createAd;
const cleanPlaces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield placeModel_1.Place.updateMany({}, [
            {
                $set: {
                    landmark: { $trim: { input: '$landmark' } },
                    area: { $trim: { input: '$area' } },
                    state: { $trim: { input: '$state' } },
                    country: { $trim: { input: '$country' } },
                    continent: { $trim: { input: '$continent' } },
                },
            },
        ]);
        yield placeModel_1.Document.updateMany({}, [
            {
                $set: {
                    country: { $trim: { input: '$country' } },
                },
            },
        ]);
        yield schoolModel_1.School.updateMany({}, [
            {
                $set: {
                    name: { $trim: { input: '$name' } },
                    username: { $trim: { input: '$username' } },
                    state: { $trim: { input: '$state' } },
                    country: { $trim: { input: '$country' } },
                    continent: { $trim: { input: '$continent' } },
                },
            },
        ]);
        yield newsModel_1.News.updateMany({}, [
            {
                $set: {
                    state: { $trim: { input: '$state' } },
                    country: { $trim: { input: '$country' } },
                    continent: { $trim: { input: '$continent' } },
                },
            },
        ]);
        yield newsModel_1.News.updateMany({}, [
            {
                $set: {
                    country: { $trim: { input: '$country' } },
                    continent: { $trim: { input: '$continent' } },
                },
            },
        ]);
        yield competitionModel_1.Exam.updateMany({}, [
            {
                $set: {
                    country: { $trim: { input: '$country' } },
                    continent: { $trim: { input: '$continent' } },
                },
            },
        ]);
        yield placeModel_1.Bank.updateMany({}, [
            {
                $set: {
                    country: { $trim: { input: '$country' } },
                    continent: { $trim: { input: '$continent' } },
                },
            },
        ]);
        yield academicLevelModel_1.AcademicLevel.updateMany({}, [
            {
                $set: {
                    country: { $trim: { input: '$country' } },
                },
            },
        ]);
        res.status(200).json({ message: 'Places updated successfully.' });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.cleanPlaces = cleanPlaces;
const getAdById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield adModel_1.Ad.findById(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Ad not found' });
        }
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getAdById = getAdById;
const getAds = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(adModel_1.Ad, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getAds = getAds;
const updateAd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, adModel_1.Ad, ['picture'], ['Ad not found', 'Ad was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateAd = updateAd;
const deleteAd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItems)(req, res, placeModel_1.Place, ['countryFlag'], 'Place not found');
});
exports.deleteAd = deleteAd;
//-----------------ACADEMIC LEVEL--------------------//
const createAcademicLevel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, academicLevelModel_1.AcademicLevel, 'Academic Level was created successfully');
});
exports.createAcademicLevel = createAcademicLevel;
const updateAcademicLevel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, academicLevelModel_1.AcademicLevel, ['logo'], ['Academic Level not found', 'Academic Level was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateAcademicLevel = updateAcademicLevel;
const getAcademicLevelById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield academicLevelModel_1.AcademicLevel.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'AcademicLevel not found' });
        }
        res.status(200).json(item);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getAcademicLevelById = getAcademicLevelById;
const getAcademicLevels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(academicLevelModel_1.AcademicLevel, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getAcademicLevels = getAcademicLevels;
const deleteAcademicLevel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, academicLevelModel_1.AcademicLevel, ['logo'], 'AcademicLevel not found');
});
exports.deleteAcademicLevel = deleteAcademicLevel;
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
//-----------------BANK--------------------//
const createBank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, placeModel_1.Bank, 'Bank was created successfully');
});
exports.createBank = createBank;
const updateBank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, query_1.updateItem)(req, res, placeModel_1.Bank, [], ['Bank  not found', 'Bank was updated successfully']);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateBank = updateBank;
const getBanks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(placeModel_1.Bank, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getBanks = getBanks;
const getBankById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield placeModel_1.Bank.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Bank not found' });
        }
        res.status(200).json(item);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getBankById = getBankById;
const deleteBank = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItem)(req, res, placeModel_1.Bank, [], 'Bank not found');
});
exports.deleteBank = deleteBank;
//--------------------PLACE-----------------------//
const createPlace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    (0, query_1.createItem)(req, res, placeModel_1.Place, 'Country was created successfully');
});
exports.createPlace = createPlace;
const getPlaceById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield placeModel_1.Place.findById(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Place not found' });
        }
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getPlaceById = getPlaceById;
const getPlaces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(placeModel_1.Place, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getPlaces = getPlaces;
const getAllPlaces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchTerm = req.query.place;
        const limit = Math.min(Number(req.query.page_size) || 50, 100); // max 100 results
        const skip = Math.max(Number(req.query.page) || 0, 0); // min 0
        const result = yield placeModel_1.Place.aggregate([
            {
                $match: {
                    $or: [
                        { country: { $regex: `^${searchTerm}`, $options: 'i' } },
                        { state: { $regex: `^${searchTerm}`, $options: 'i' } },
                        { area: { $regex: `^${searchTerm}`, $options: 'i' } },
                    ],
                },
            },
            {
                $group: {
                    _id: '$area', // Group by area
                    doc: { $first: '$$ROOT' }, // Keep the first doc in each group
                },
            },
            {
                $replaceRoot: { newRoot: '$doc' },
            },
            { $skip: skip },
            { $limit: limit },
        ]);
        res.status(200).json({ results: result });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getAllPlaces = getAllPlaces;
const updatePlace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (((_a = req.files) === null || _a === void 0 ? void 0 : _a.length) || req.file) {
            const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
            uploadedFiles.forEach((file) => {
                req.body[file.fieldName] = file.s3Url;
            });
        }
        const place = yield placeModel_1.Place.findById(req.params.id);
        const source = req.body.source;
        if (source === 'Country') {
            if ((place === null || place === void 0 ? void 0 : place.country) === req.body.country) {
                yield placeModel_1.Place.updateMany({ country: req.body.country }, req.body);
            }
            else {
                yield placeModel_1.Place.updateMany({ country: place === null || place === void 0 ? void 0 : place.country }, { $set: req.body });
            }
        }
        else if (source === 'State') {
            if ((place === null || place === void 0 ? void 0 : place.state) === req.body.state) {
                yield placeModel_1.Place.updateMany({ state: req.body.state }, req.body);
            }
            else {
                yield placeModel_1.Place.updateMany({ state: place === null || place === void 0 ? void 0 : place.state }, { $set: req.body });
            }
        }
        else if (source === 'Area') {
            if ((place === null || place === void 0 ? void 0 : place.area) === req.body.area) {
                yield placeModel_1.Place.updateMany({ area: req.body.area }, req.body);
            }
            else {
                yield placeModel_1.Place.updateMany({ area: place === null || place === void 0 ? void 0 : place.area }, { $set: req.body });
            }
        }
        const item = yield (0, query_1.queryData)(placeModel_1.Place, req);
        const { page, page_size, count, results } = item;
        res.status(200).json({
            message: 'Place was updated successfully',
            results,
            count,
            page,
            page_size,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updatePlace = updatePlace;
const deletePlace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield placeModel_1.Place.findById(req.params.id);
    const existingPlaces = yield placeModel_1.Place.find({
        country: result === null || result === void 0 ? void 0 : result.country,
        $and: [{ countryFlag: { $ne: null } }, { countryFlag: { $ne: '' } }],
    });
    if (existingPlaces.length > 1) {
        yield (0, query_1.deleteItem)(req, res, placeModel_1.Place, [], 'Place not found');
    }
    else {
        yield (0, query_1.deleteItem)(req, res, placeModel_1.Place, ['countryFlag'], 'Place not found');
    }
});
exports.deletePlace = deletePlace;
const deletePlaces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, query_1.deleteItems)(req, res, placeModel_1.Place, ['countryFlag'], 'Place not found');
});
exports.deletePlaces = deletePlaces;
const searchPlace = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const places = yield placeModel_1.Place.aggregate([
            {
                $group: {
                    _id: '$country',
                },
            },
        ]);
        res.status(200).json({
            results: places,
        });
    }
    catch (error) {
        console.error('Error fetching unique places:', error);
        throw error;
    }
});
exports.searchPlace = searchPlace;
const searchPlaces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const country = req.query.country;
        const places = yield placeModel_1.Place.aggregate([
            {
                $match: {
                    country: { $regex: country, $options: 'i' },
                },
            },
            {
                $group: {
                    _id: '$country',
                    countryFlag: { $first: '$countryFlag' },
                    continent: { $first: '$continent' },
                    countryCode: { $first: '$countryCode' },
                    currency: { $first: '$currency' },
                    currencySymbol: { $first: '$currencySymbol' },
                    countrySymbol: { $first: '$countrySymbol' },
                    state: { $first: '$state' },
                    area: { $first: '$area' },
                    id: { $first: '$_id' },
                },
            },
            {
                $project: {
                    _id: 0,
                    country: '$_id',
                    countryFlag: 1,
                    continent: 1,
                    currency: 1,
                    currencySymbol: 1,
                    countrySymbol: 1,
                    state: 1,
                    area: 1,
                    id: 1,
                },
            },
            { $limit: 10 },
        ]);
        res.status(200).json({
            results: places,
        });
    }
    catch (error) {
        console.error('Error fetching unique places:', error);
        throw error;
    }
});
exports.searchPlaces = searchPlaces;
const getUniquePlaces = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const field = String(req.query.field);
        const limit = parseInt(req.query.page_size) || 10;
        const page = parseInt(req.query.page) || 1;
        const sortBy = req.query.sort || 'country';
        const order = req.query.order === 'asc' ? -1 : 1;
        const skipValue = (page - 1) * limit;
        const country = req.query.country;
        const state = req.query.state;
        const area = req.query.area;
        const filters = {};
        if (area) {
            filters.area = { $regex: area, $options: 'i' };
        }
        else if (state) {
            filters.state = { $regex: state, $options: 'i' };
        }
        else {
            filters.country = { $regex: country, $options: 'i' };
        }
        const matchStage = Object.keys(filters).length > 0 ? { $match: filters } : null;
        const aggregationPipeline = [];
        if (matchStage)
            aggregationPipeline.push(matchStage);
        aggregationPipeline.push({
            $group: {
                _id: `$${field}`,
                countryFlag: { $first: '$countryFlag' },
                continent: { $first: '$continent' },
                country: { $first: '$country' },
                countryCode: { $first: '$countryCode' },
                currency: { $first: '$currency' },
                currencySymbol: { $first: '$currencySymbol' },
                countrySymbol: { $first: '$countrySymbol' },
                state: { $first: '$state' },
                stateCapital: { $first: '$stateCapital' },
                stateLogo: { $first: '$stateLogo' },
                area: { $first: '$area' },
                zipCode: { $first: '$zipCode' },
                id: { $first: '$_id' },
            },
        }, {
            $project: {
                _id: 0,
                [field]: '$_id',
                countryFlag: 1,
                continent: 1,
                countryCode: 1,
                country: 1,
                currency: 1,
                currencySymbol: 1,
                countrySymbol: 1,
                state: 1,
                stateCapital: 1,
                stateLogo: 1,
                area: 1,
                zipCode: 1,
                id: 1,
            },
        }, { $sort: { [sortBy]: order } }, { $skip: skipValue }, { $limit: limit });
        const countPipeline = [...aggregationPipeline].filter((stage) => !('$limit' in stage || '$skip' in stage));
        countPipeline.push({ $count: 'totalCount' });
        const [places, totalCountResult] = yield Promise.all([
            placeModel_1.Place.aggregate(aggregationPipeline),
            placeModel_1.Place.aggregate(countPipeline),
        ]);
        const totalCount = totalCountResult.length
            ? totalCountResult[0].totalCount
            : 0;
        res.status(200).json({
            message: 'Places fetched successfully',
            results: places,
            count: totalCount,
            page_size: limit,
        });
    }
    catch (error) {
        console.error('Error fetching unique places:', error);
        throw error;
    }
});
exports.getUniquePlaces = getUniquePlaces;
