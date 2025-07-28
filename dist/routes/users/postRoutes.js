"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const postController_1 = require("../../controllers/users/postController");
const uploadController_1 = require("../../controllers/users/uploadController");
const router = express_1.default.Router();
router.route('/follow/:id').patch(upload.any(), postController_1.followUser);
router.route('/poll/:id').post(upload.any(), postController_1.updatePoll);
router.route('/followers').get(postController_1.getFollowings);
router.route('/uploads').get(uploadController_1.getUploads).post(upload.any(), uploadController_1.createUpload);
router.route('/accounts').get(postController_1.getAccounts).post(upload.any(), postController_1.createAccount);
router.route('/stats').get(postController_1.getPostStat).patch(upload.any(), postController_1.updatePostStat);
router.route('/repost/:id').post(upload.any(), postController_1.repostPost);
router.route('/pin/:id').post(upload.any(), postController_1.pinPost);
router.route('/block/:id').post(upload.any(), postController_1.blockUser);
router.route('/blocks').get(postController_1.getBlockedUsers);
router.route('/mutes').get(postController_1.getMutedUsers);
router.route('/mute/:id').patch(upload.any(), postController_1.muteUser);
router.route('/view').patch(postController_1.updatePostViews);
router.route('/general').get(uploadController_1.multiSearch);
router.route('/').get(postController_1.getPosts).post(upload.any(), postController_1.createPost);
router.route('/create').get(postController_1.getPosts).post(upload.any(), postController_1.makePost);
router.route('/following').get(postController_1.getFollowingPosts);
router.route('/bookmarks').get(postController_1.getBookMarkedPosts);
router.route('/search').get(postController_1.searchPosts);
router
    .route('/uploads/:id')
    .get(uploadController_1.getUploadById)
    .patch(upload.any(), uploadController_1.updateUpload)
    .delete(uploadController_1.deleteUpload);
router
    .route('/accounts/:id')
    .get(postController_1.getAccountById)
    .patch(upload.any(), postController_1.updateAccount)
    .delete(postController_1.deleteAccount);
router
    .route('/:id')
    .get(postController_1.getPostById)
    .patch(upload.any(), postController_1.updatePost)
    .delete(postController_1.deletePost);
exports.default = router;
