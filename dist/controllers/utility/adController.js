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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDraftAd = exports.getAd = exports.createAd = exports.updateAd = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const fileUpload_1 = require("../../utils/fileUpload");
const adModel_1 = require("../../models/utility/adModel");
const userModel_1 = require("../../models/users/userModel");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const updateAd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.body.target) {
            req.body.tags = JSON.parse(req.body.tags);
            req.body.states = JSON.parse(req.body.states);
            req.body.areas = JSON.parse(req.body.areas);
            req.body.countries = JSON.parse(req.body.countries);
        }
        const ad = yield adModel_1.Ad.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            message: 'Ad was updated successfully',
            data: ad,
        });
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateAd = updateAd;
const createAd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
        uploadedFiles.forEach((file) => {
            req.body[file.fieldName] = file.s3Url;
        });
        // req.body.userStatus = 'ad'
        // req.body.password = await bcrypt.hash('ad', 10)
        // await User.create(req.body, {
        //   new: true,
        //   runValidators: true,
        // })
        const newUser = new userModel_1.User({
            userStatus: 'ad',
            email: `${req.body.username}@smail.com`,
            username: req.body.username,
            password: yield bcryptjs_1.default.hash('password', 10),
        });
        yield newUser.save();
        req.body.media = JSON.parse(req.body.media);
        const ad = yield adModel_1.Ad.create(req.body, {
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            message: 'Ad is created successfully',
            data: ad,
        });
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.createAd = createAd;
const getAd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ad = yield adModel_1.Ad.findById(req.params.id);
        res.status(200).json({
            message: 'Post stats retrieved successfully',
            data: ad,
        });
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getAd = getAd;
const getDraftAd = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const ad = yield adModel_1.Ad.findOne({ user: req.query.username, status: 'Draft' });
        res.status(200).json({
            data: ad,
        });
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getDraftAd = getDraftAd;
