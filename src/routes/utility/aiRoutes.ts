import express from 'express'
import multer from 'multer'
const upload = multer()
import { assignClass } from '../../controllers/utility/officeController'
import deepseek from '../../utils/deepseekClient'
import { postAIMessage } from '../../controllers/utility/aiController'

const router = express.Router()

router.route('/assign-class').patch(upload.any(), assignClass)

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

router.route('/').post(upload.any(), postAIMessage)

export default router
