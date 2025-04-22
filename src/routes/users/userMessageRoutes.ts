import express from "express";
import multer from "multer";
const upload = multer();

import {
  getNotifications,
  updateNotification,
} from "../../controllers/users/messageController";
import {
  searchChats,
  getUserChats,
  deleteChats,
  friendsChats,
  addSearchedChats,
  saveChats,
  unSaveChats,
  getSaveChats,
  searchFavChats,
} from "../../controllers/users/chatController";

const router = express.Router();

router
  .route("/notifications")
  .get(getNotifications)
  .patch(upload.any(), updateNotification);
router.route("/friends").get(friendsChats);
router.route("/add-searched").get(addSearchedChats);
router.route("/save").patch(upload.any(), saveChats).get(getSaveChats);
router.route("/unsave").patch(upload.any(), unSaveChats);
router.route("/search").get(searchChats);
router.route("/search-fav").get(searchFavChats);
router.route("/user-chats").get(getUserChats);
router.route("/mass-delete").post(deleteChats);
router
  .route("/notifications/:username")
  .patch(upload.any(), updateNotification);

export default router;
