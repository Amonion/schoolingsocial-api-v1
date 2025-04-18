"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const statController_1 = require("../../controllers/team/statController");
const router = express_1.default.Router();
router.route("/").get(statController_1.getUsersStat);
exports.default = router;
