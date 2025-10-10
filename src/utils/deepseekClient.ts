import { config } from 'dotenv'
import { OpenAI } from 'openai'

config()

const deepseek = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
})

export default deepseek
