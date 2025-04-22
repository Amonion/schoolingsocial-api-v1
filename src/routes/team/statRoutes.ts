import express from "express";
import {
  getSchoolStat,
  getUsersStat,
} from "../../controllers/team/statController";

const router = express.Router();

router.route("/").get(getUsersStat);
router.route("/schools").get(getSchoolStat);

export default router;
