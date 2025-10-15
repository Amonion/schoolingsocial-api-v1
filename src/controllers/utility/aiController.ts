import { Request, Response } from 'express'
// import OpenAI from 'openai'

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// })

export const postAIMessage = async (req: Request, res: Response) => {
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

  const {
    messages,
    model = 'gpt-4o-mini', // ✅ Cheap & fast, good for chat
    temperature = 0.7,
    max_tokens = 300,
  } = req.body

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Missing required field: messages[]' })
  }

  try {
    // const completion = await openai.chat.completions.create({
    //   model,
    //   messages,
    //   temperature,
    //   max_tokens,
    // })
    // return res.json({
    //   provider: 'openai',
    //   result: completion.choices[0].message.content,
    //   full: completion,
    // })
  } catch (err: any) {
    console.error('OpenAI API error:', err)
    return res.status(500).json({ error: err.message || 'OpenAI error' })
  }
}
