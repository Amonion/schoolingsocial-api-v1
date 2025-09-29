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
exports.followUserAccount = exports.getExistingUsername = exports.getManyUserDetails = exports.getUserDetails = exports.getUserInfo = exports.getUserSchoolInfo = exports.getUserAccountInfo = exports.updateUserAccountInfo = exports.deleteUser = exports.getUsers = exports.deleteMyData = exports.searchAccounts = exports.getUserSettings = exports.updateUserSettings = exports.updateUser = exports.getAUser = exports.createUserAccount = exports.createUser = void 0;
const userInfoModel_1 = require("../../models/users/userInfoModel");
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const fileUpload_1 = require("../../utils/fileUpload");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const postModel_1 = require("../../models/post/postModel");
const sendEmail_1 = require("../../utils/sendEmail");
const usersStatMode_1 = require("../../models/users/usersStatMode");
const statModel_1 = require("../../models/users/statModel");
const placeModel_1 = require("../../models/team/placeModel");
const walletModel_1 = require("../../models/users/walletModel");
const bioUser_1 = require("../../models/users/bioUser");
const bioUserSchoolInfo_1 = require("../../models/users/bioUserSchoolInfo");
const bioUserSettings_1 = require("../../models/users/bioUserSettings");
const bioUserState_1 = require("../../models/users/bioUserState");
const user_1 = require("../../models/users/user");
const userSettings_1 = require("../../models/users/userSettings");
const chatModel_1 = require("../../models/message/chatModel");
const bioUserBank_1 = require("../../models/users/bioUserBank");
const socialNotificationModel_1 = require("../../models/message/socialNotificationModel");
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Run once to remove trailing/leading spaces in all documents
        // await Place.updateMany({}, [
        //   { $set: { country: { $trim: { input: '$country' } } } },
        // ])
        const signupCountry = req.country;
        const signupIp = req.ipAddress;
        const bioUser = new bioUser_1.BioUser(Object.assign(Object.assign({}, req.body), { signupCountry, signupIp }));
        yield bioUser.save();
        yield bioUserSchoolInfo_1.BioUserSchoolInfo.create({ bioUserId: bioUser._id });
        yield bioUserSettings_1.BioUserSettings.create({ bioUserId: bioUser._id });
        yield bioUserState_1.BioUserState.create({ bioUserId: bioUser._id });
        yield bioUserBank_1.BioUserBank.create({ bioUserId: bioUser._id });
        const place = yield placeModel_1.Place.findOne({
            country: new RegExp(`^${signupCountry.trim()}\\s*$`, 'i'),
        });
        const newUser = new user_1.User({
            bioUserId: bioUser._id,
            email: req.body.email,
            signupIp,
            signupCountry: place === null || place === void 0 ? void 0 : place.country.trim(),
            signupCountryFlag: place === null || place === void 0 ? void 0 : place.countryFlag.trim(),
            signupCountrySymbol: place === null || place === void 0 ? void 0 : place.countrySymbol.trim(),
            password: yield bcryptjs_1.default.hash(req.body.password, 10),
        });
        yield newUser.save();
        yield walletModel_1.Wallet.create({
            userId: newUser._id,
            bioUserId: bioUser._id,
            country: place === null || place === void 0 ? void 0 : place.country.trim(),
            countryFlag: place === null || place === void 0 ? void 0 : place.countryFlag,
            countrySymbol: place === null || place === void 0 ? void 0 : place.countrySymbol.trim(),
            currency: place === null || place === void 0 ? void 0 : place.currency.trim(),
            currencySymbol: place === null || place === void 0 ? void 0 : place.currencySymbol.trim(),
        });
        yield (0, sendEmail_1.sendEmail)('', req.body.email, 'welcome');
        res.status(200).json({
            message: 'User created successfully',
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.createUser = createUser;
const createUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
        uploadedFiles.forEach((file) => {
            req.body[file.fieldName] = file.s3Url;
        });
        const { username, displayName, picture, followingsId, userId } = req.body;
        const user = yield user_1.User.findOneAndUpdate({ _id: userId }, {
            picture: picture,
            displayName: displayName,
            isFirstTime: false,
            username: username,
        }, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
        yield postModel_1.Follower.create({
            userId: user._id,
            followingId: followingsId,
        });
        res.status(200).json({
            message: 'Account created successfully',
            user: user,
        });
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.createUserAccount = createUserAccount;
const getAUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.User.findOne({ username: req.params.username });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const followerId = req.query.userId;
        const follow = yield postModel_1.Follower.findOne({
            userId: user === null || user === void 0 ? void 0 : user._id,
            followerId: followerId,
        });
        const followedUser = Object.assign(Object.assign({}, user.toObject()), { isFollowed: !!follow });
        res.status(200).json({ data: followedUser });
    }
    catch (error) {
        console.log(error);
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getAUser = getAUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadedFiles = yield (0, fileUpload_1.uploadFilesToS3)(req);
        uploadedFiles.forEach((file) => {
            req.body[file.fieldName] = file.s3Url;
        });
        const user = yield user_1.User.findOneAndUpdate({ username: req.params.username }, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (req.body.picture) {
            yield postModel_1.Post.updateMany({ userId: user._id }, { picture: req.body.picture });
            yield chatModel_1.Chat.updateMany({ userId: user._id }, { picture: req.body.picture });
        }
        res.status(200).json({
            message: 'Your profile was updated successfully',
            data: user,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateUser = updateUser;
const updateUserSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userSettings = JSON.parse(req.body.userSettingsForm);
        const user = yield userSettings_1.UserSettings.findOneAndUpdate({ userId: req.params.id }, userSettings, {
            new: true,
            runValidators: true,
            upsert: true,
        });
        res.status(200).json({
            message: 'Your settings was updated successfully',
            data: user,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateUserSettings = updateUserSettings;
const getUserSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let user = yield userSettings_1.UserSettings.findOne({ userId: req.params.id });
        if (!user) {
            user = yield userSettings_1.UserSettings.create({ userId: req.params.id });
        }
        return res.status(200).json({ data: user });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getUserSettings = getUserSettings;
const searchAccounts = (req, res) => {
    return (0, query_1.search)(user_1.User, req, res);
};
exports.searchAccounts = searchAccounts;
///////////// NEW CONTROLLERS //////////////
const deleteMyData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.User.findById(req.params.id);
        yield user_1.DeletedUser.create({
            email: user === null || user === void 0 ? void 0 : user.email,
            username: user === null || user === void 0 ? void 0 : user.username,
            displayName: user === null || user === void 0 ? void 0 : user.displayName,
            picture: user === null || user === void 0 ? void 0 : user.picture,
            bioUserId: user === null || user === void 0 ? void 0 : user.bioUserId,
        });
        yield statModel_1.Bookmark.deleteMany({ userId: req.params.id });
        yield postModel_1.Follower.deleteMany({ userId: req.params.id });
        yield statModel_1.Like.deleteMany({ userId: req.params.id });
        yield postModel_1.Mute.deleteMany({ userId: req.params.id });
        yield postModel_1.Pin.deleteMany({ userId: req.params.id });
        yield postModel_1.Poll.deleteMany({ userId: req.params.id });
        yield postModel_1.Post.deleteMany({ userId: req.params.id });
        yield statModel_1.Repost.deleteMany({ userId: req.params.id });
        yield socialNotificationModel_1.SocialNotification.deleteMany({ userId: req.params.id });
        yield usersStatMode_1.UserStatus.deleteMany({ bioId: user === null || user === void 0 ? void 0 : user.bioUserId });
        yield statModel_1.View.deleteMany({ userId: req.params.id });
        yield user_1.User.findByIdAndDelete(req.params.id);
        return res
            .status(200)
            .json({ message: 'Your account has been deleted successfully.' });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.deleteMyData = deleteMyData;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, query_1.queryData)(user_1.User, req);
        res.status(200).json(result);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getUsers = getUsers;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.deleteUser = deleteUser;
//-----------------INFO--------------------//
const updateUserAccountInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userInfoModel_1.UserFinanceInfo.findOneAndUpdate({ userId: req.params.id }, req.body, {
            new: true,
        });
        yield user_1.User.findOneAndUpdate({ userId: req.params.id }, { isAccountSet: true }, {
            new: true,
        });
        res.status(200).json(user);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.updateUserAccountInfo = updateUserAccountInfo;
const getUserAccountInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userInfoModel_1.UserFinanceInfo.findOne({ userId: req.params.id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getUserAccountInfo = getUserAccountInfo;
const getUserSchoolInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userInfoModel_1.UserSchoolInfo.findOne({ userId: req.params.id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getUserSchoolInfo = getUserSchoolInfo;
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.query.school) {
            const user = yield userInfoModel_1.UserSchoolInfo.findOne({ userId: req.params.id });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        }
        else {
            const user = yield userInfoModel_1.UserInfo.findById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        }
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getUserInfo = getUserInfo;
const getUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield userInfoModel_1.UserInfo.findOne({ username: req.params.username });
        res.status(200).json(user);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getUserDetails = getUserDetails;
const getManyUserDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const results = yield (0, query_1.queryData)(userInfoModel_1.UserInfo, req);
        res.status(200).json(results);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getManyUserDetails = getManyUserDetails;
const getExistingUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = (yield userInfoModel_1.UserInfo.findOne({ username: req.params.username })) ||
            (yield user_1.User.findOne({ username: req.params.username }));
        res.status(200).json(user);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getExistingUsername = getExistingUsername;
//-----------------FOLLOW USER--------------------//
const followUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { follow } = yield (0, query_1.followAccount)(req, res);
        let isFollowed = req.body.isFollowed;
        let followers = yield postModel_1.Follower.countDocuments({ userId: req.params.id });
        isFollowed = follow ? false : true;
        res.status(200).json({
            isFollowed: isFollowed,
            followers: followers,
            id: req.params.id,
        });
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.followUserAccount = followUserAccount;
