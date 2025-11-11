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
exports.followUserAccount = exports.getChatUser = exports.getExistingUsername = exports.deleteUser = exports.getUsers = exports.deleteMyData = exports.searchAccounts = exports.getUserSettings = exports.updateUserSettings = exports.updateUser = exports.getAUser = exports.createUserAccount = exports.createUser = void 0;
const errorHandler_1 = require("../../utils/errorHandler");
const query_1 = require("../../utils/query");
const fileUpload_1 = require("../../utils/fileUpload");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const postModel_1 = require("../../models/post/postModel");
const sendEmail_1 = require("../../utils/sendEmail");
const usersStatMode_1 = require("../../models/users/usersStatMode");
const statModel_1 = require("../../models/users/statModel");
const placeModel_1 = require("../../models/place/placeModel");
const bioUser_1 = require("../../models/users/bioUser");
const bioUserSchoolInfo_1 = require("../../models/users/bioUserSchoolInfo");
const bioUserSettings_1 = require("../../models/users/bioUserSettings");
const bioUserState_1 = require("../../models/users/bioUserState");
const user_1 = require("../../models/users/user");
const userSettings_1 = require("../../models/users/userSettings");
const chatModel_1 = require("../../models/message/chatModel");
const bioUserBank_1 = require("../../models/users/bioUserBank");
const socialNotificationModel_1 = require("../../models/message/socialNotificationModel");
const interestModel_1 = require("../../models/post/interestModel");
const postStateModel_1 = require("../../models/post/postStateModel");
const postController_1 = require("../post/postController");
const newsController_1 = require("../news/newsController");
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
        yield bioUserBank_1.BioUserBank.create({
            bioUserId: bioUser._id,
            bankCountry: signupCountry,
        });
        const place = yield placeModel_1.Place.findOne({
            country: new RegExp(`^${signupCountry.trim()}\\s*$`, 'i'),
        });
        const newUser = new user_1.User({
            bioUserId: bioUser._id,
            email: req.body.email,
            signupIp,
            lat: req.body.lat,
            lng: req.body.lng,
            signupCountry: place === null || place === void 0 ? void 0 : place.country.trim(),
            signupCountryFlag: place === null || place === void 0 ? void 0 : place.countryFlag.trim(),
            signupCountrySymbol: place === null || place === void 0 ? void 0 : place.countrySymbol.trim(),
            password: yield bcryptjs_1.default.hash(req.body.password, 10),
        });
        yield newUser.save();
        yield interestModel_1.Interest.create({ userId: newUser._id, countries: [signupCountry] });
        // await Wallet.create({
        //   userId: newUser._id,
        //   bioUserId: bioUser._id,
        //   country: place?.country.trim(),
        //   countryFlag: place?.countryFlag,
        //   countrySymbol: place?.countrySymbol.trim(),
        //   currency: place?.currency.trim(),
        //   currencySymbol: place?.currencySymbol.trim(),
        // })
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
        const { username, displayName, picture, userId, country, state } = req.body;
        const user = yield user_1.User.findOneAndUpdate({ _id: userId }, {
            picture: picture,
            displayName: displayName,
            isFirstTime: false,
            username: username,
            country: country,
            state: state,
        }, { new: true });
        if (!user) {
            throw new Error('User not found');
        }
        const news = yield (0, newsController_1.getNewsFeed)({ country: user.country, state: user.state });
        const postResult = yield (0, postController_1.getFilteredPosts)({
            topics: [],
            countries: [country],
            page: 1,
            limit: 20,
            followerId: user._id,
            source: 'post',
        });
        res.status(200).json({
            message: 'Account created successfully',
            user,
            posts: postResult.results,
            featuredNews: news,
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
        const follow = yield postStateModel_1.Follower.findOne({
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
        yield postStateModel_1.Follower.deleteMany({ userId: req.params.id });
        yield statModel_1.Like.deleteMany({ userId: req.params.id });
        yield postStateModel_1.Mute.deleteMany({ userId: req.params.id });
        yield postStateModel_1.Pin.deleteMany({ userId: req.params.id });
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
const getExistingUsername = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = (yield bioUser_1.BioUser.findOne({ username: req.params.username })) ||
            (yield user_1.User.findOne({ username: req.params.username }));
        res.status(200).json(user);
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getExistingUsername = getExistingUsername;
const getChatUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bioUser = yield bioUser_1.BioUser.findOne({ username: req.params.username });
        const user = yield user_1.User.findOne({ username: req.params.username });
        if (bioUser) {
            res.status(200).json({
                data: {
                    username: bioUser.bioUserUsername,
                    picture: bioUser.bioUserPicture,
                    displayName: bioUser.bioUserDisplayName,
                    _id: bioUser._id,
                },
            });
        }
        else {
            res.status(200).json({
                data: {
                    username: user.username,
                    picture: user.picture,
                    displayName: user.displayName,
                    _id: user._id,
                },
            });
        }
    }
    catch (error) {
        (0, errorHandler_1.handleError)(res, undefined, undefined, error);
    }
});
exports.getChatUser = getChatUser;
//-----------------FOLLOW USER--------------------//
const followUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { follow } = yield (0, query_1.followAccount)(req, res);
        let isFollowed = req.body.isFollowed;
        let followers = yield postStateModel_1.Follower.countDocuments({ userId: req.params.id });
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
