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
exports.fogottenPassword = exports.getAuthUser = exports.getCurrentUser = exports.loginUser = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const dotenv_1 = __importDefault(require("dotenv"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../../models/users/user");
const bioUser_1 = require("../../models/users/bioUser");
const bioUserState_1 = require("../../models/users/bioUserState");
const bioUserSettings_1 = require("../../models/users/bioUserSettings");
const officeModel_1 = require("../../models/utility/officeModel");
const bioUserSchoolInfo_1 = require("../../models/users/bioUserSchoolInfo");
const interestModel_1 = require("../../models/post/interestModel");
const postController_1 = require("../post/postController");
dotenv_1.default.config();
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_1.User.findOne({ email }).select('+password');
        if (!user || !user.password) {
            res
                .status(404)
                .json({ message: 'Sorry incorrect email or password, try again.' });
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res
                .status(401)
                .json({ message: 'Sorry incorrect email or password, try again.' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || '', { expiresIn: '30d' });
        const [bioUser, bioUserSettings, bioUserSchoolInfo, bioUserState, activeOffice, userOffices,] = yield Promise.all([
            bioUser_1.BioUser.findById(user.bioUserId),
            bioUserSettings_1.BioUserSettings.findOne({ bioUserId: user.bioUserId }),
            bioUserSchoolInfo_1.BioUserSchoolInfo.findOne({ bioUserId: user.bioUserId }),
            bioUserState_1.BioUserState.findOne({ bioUserId: user.bioUserId }),
            officeModel_1.Office.findOne({ bioUserId: user.bioUserId, isActiveOffice: true }),
            officeModel_1.Office.find({ bioUserId: user.bioUserId, isUserActive: true }),
        ]);
        const interest = yield interestModel_1.Interest.findById(user._id);
        const postResult = yield (0, postController_1.getFilteredPosts)({
            topics: interest ? interest.topics : [],
            countries: interest ? interest.countries : [],
            page: 1,
            limit: 20,
            followerId: user._id,
            source: 'post',
        });
        user.password = undefined;
        console.log(user);
        res.status(200).json({
            message: 'Login successful',
            user,
            bioUserSettings,
            bioUser,
            bioUserState,
            bioUserSchoolInfo,
            activeOffice,
            userOffices,
            token,
            posts: postResult.results,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.loginUser = loginUser;
const getCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || '');
        const user = yield user_1.User.findById(decoded.userId).select('-password');
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const [bioUser, bioUserSettings, bioUserSchoolInfo, bioUserState, activeOffice, userOffices,] = yield Promise.all([
            bioUser_1.BioUser.findById(user.bioUserId),
            bioUserSettings_1.BioUserSettings.findOne({ bioUserId: user.bioUserId }),
            bioUserSchoolInfo_1.BioUserSchoolInfo.findOne({ bioUserId: user.bioUserId }),
            bioUserState_1.BioUserState.findOne({ bioUserId: user.bioUserId }),
            officeModel_1.Office.findOne({ bioUserId: user.bioUserId, isActiveOffice: true }),
            officeModel_1.Office.find({ bioUserId: user.bioUserId, isUserActive: true }),
        ]);
        res.status(200).json({
            message: 'User fetched successfully',
            user,
            bioUserSettings,
            bioUser,
            bioUserState,
            bioUserSchoolInfo,
            activeOffice,
            userOffices,
        });
    }
    catch (error) {
        res.status(401).json({ message: 'Unauthorized', error });
    }
});
exports.getCurrentUser = getCurrentUser;
const getAuthUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || '', { expiresIn: '30d' });
        res.status(200).json({
            message: 'Login successful',
            user: user,
            token,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getAuthUser = getAuthUser;
const fogottenPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_1.User.findOne({ email });
        if (!user) {
            res
                .status(404)
                .json({ message: 'Sorry incorrect email or password, try again.' });
            return;
        }
        if (!user.password) {
            res.status(400).json({ message: 'Password not set for user' });
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res
                .status(401)
                .json({ message: 'Sorry incorrect email or password, try again.' });
            return;
        }
        // const token = jwt.sign(
        //   { userId: user._id, email: user.email },
        //   JWT_SECRET,
        //   { expiresIn: "30d" }
        // );
        // res.status(200).json({
        //   message: "Login successful",
        //   user: {
        //     email: user.email,
        //     username: user.username,
        //     phone: user.phone,
        //   },
        //   token,
        // });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.fogottenPassword = fogottenPassword;
