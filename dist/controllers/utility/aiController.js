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
exports.postAIMessage = void 0;
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY,
});
const postAIMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //   try {
    //     const {
    //       messages,
    //       model = 'deepseek-chat',
    //       temperature = 0.7,
    //       max_tokens = 300,
    //     } = req.body
    //     console.log(req.body)
    //     if (!messages || !Array.isArray(messages)) {
    //       return res
    //         .status(400)
    //         .json({ error: 'Missing required field: messages[]' })
    //     }
    //     const completion = await deepseek.chat.completions.create({
    //       model,
    //       messages,
    //       temperature,
    //       max_tokens,
    //     })
    //     return res.json({
    //       result: completion.choices[0].message.content,
    //       full: completion,
    //     })
    //   } catch (err: any) {
    //     console.error('DeepSeek API error:', err)
    //     return res.status(500).json({ error: err.message || 'DeepSeek error' })
    //   }
    const { messages, model = 'gpt-4o-mini', // ✅ Cheap & fast, good for chat
    temperature = 0.7, max_tokens = 300, } = req.body;
    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: 'Missing required field: messages[]' });
    }
    try {
        const completion = yield openai.chat.completions.create({
            model,
            messages, // must be [{ role: "user" | "assistant" | "system", content: string }]
            temperature,
            max_tokens,
        });
        return res.json({
            provider: 'openai',
            result: completion.choices[0].message.content,
            full: completion,
        });
    }
    catch (err) {
        console.error('OpenAI API error:', err);
        return res.status(500).json({ error: err.message || 'OpenAI error' });
    }
});
exports.postAIMessage = postAIMessage;
