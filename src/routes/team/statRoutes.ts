import express from "express";
import { getUsersStat } from "../../controllers/team/statController";

const router = express.Router();

router.route("/").get(getUsersStat);

export default router;
