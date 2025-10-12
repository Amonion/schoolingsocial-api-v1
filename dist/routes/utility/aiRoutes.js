"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const officeController_1 = require("../../controllers/utility/officeController");
const aiController_1 = require("../../controllers/utility/aiController");
const router = express_1.default.Router();
router.route('/assign-class').patch(upload.any(), officeController_1.assignClass);
// router.route('/').post(async (req, res) => {
//   try {
//     const { messages, model = 'deepseek-chat' } = req.body
//     const completion = await deepseek.chat.completions.create({
//       model,
//       messages,
//     })
//     completion
//     return res.json({
//       result: completion.choices[0].message.content,
//       full: completion,
//     })
//   } catch (err: any) {
//     console.error('DeepSeek API error:', err)
//     return res.status(500).json({ error: err.message || 'DeepSeek error' })
//   }
// })
router.route('/').post(upload.any(), aiController_1.postAIMessage);
exports.default = router;
