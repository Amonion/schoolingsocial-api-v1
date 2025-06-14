import express, { Application, RequestHandler } from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { handleError } from './utils/errorHandler'
import competitionRoutes from './routes/team/competitionRoutes'
import companyRoutes from './routes/team/companyRoutes'
import faceRoutes from './routes/faceRoutes'
import messageRoutes from './routes/team/messageRoutes'
import newsRoutes from './routes/team/newsRoutes'
import placeRoutes from './routes/team/placeRoutes'
import postRoutes from './routes/users/postRoutes'
import schoolRoutes from './routes/team/schoolRoutes'
import statRoutes from './routes/team/statRoutes'
import userMessageRoutes from './routes/users/userMessageRoutes'
import userCompetitionRoutes from './routes/users/userCompetitionRoutes'
import userRoutes from './routes/users/userRoutes'
import {
  createChat,
  deleteChat,
  readChats,
} from './controllers/users/chatController'
import { createPost } from './controllers/users/postController'
import { getPresignedUrl, removeFile } from './utils/fileUpload'
import { TeamSocket } from './routes/team/socketRoutes'

dotenv.config()

const app: Application = express()
const server = http.createServer(app)
const requestLogger: RequestHandler = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
  next()
}

app.use(requestLogger)

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://schoolingsocial.netlify.app',
      'https://schoolingsocial.com',
      'https://schooling-client-v1.onrender.com',
    ],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'socket-id'],
  })
)

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:3000',
      'https://schoolingsocial.netlify.app',
      'https://schoolingsocial.com',
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`)

  socket.on('message', async (data) => {
    switch (data.to) {
      case 'chat':
        createChat(data)
        break
      case 'read':
        readChats(data)
        break
      case 'deleteChat':
        deleteChat(data)
        break
      case 'users':
        createPost(data)
        break
      case 'team':
        await TeamSocket(data)
        break
      default:
        break
    }
  })

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected.: ${socket.id}`)
  })
})

app.use(bodyParser.json())
app.use('/api/v1/s3-delete-file', removeFile)
app.use('/api/v1/s3-presigned-url', getPresignedUrl)
// app.use("/api/v1/s3-metadata", getExtension);
app.use('/api/v1/competitions', competitionRoutes)
app.use('/api/v1/company', companyRoutes)
app.use('/api/v1/messages', messageRoutes)
app.use('/api/v1/news', newsRoutes)
app.use('/api/v1/places', placeRoutes)
app.use('/api/v1/posts', postRoutes)
app.use('/api/v1/schools', schoolRoutes)
app.use('/api/v1/user-competitions', userCompetitionRoutes)
app.use('/api/v1/user-messages', userMessageRoutes)
app.use('/api/v1/user-stats', statRoutes)
app.use('/api/v1/users', userRoutes)
app.get('/api/v1/user-ip', (req, res) => {
  let ip: string | undefined

  const forwarded = req.headers['x-forwarded-for']

  if (typeof forwarded === 'string') {
    ip = forwarded.split(',')[0]
  } else if (Array.isArray(forwarded)) {
    ip = forwarded[0]
  } else {
    ip = req.socket?.remoteAddress || undefined
  }
  if (ip?.startsWith('::ffff:')) {
    ip = ip.replace('::ffff:', '')
  }
  res.json({ ip })
})
app.get('/api/v1/network', (req, res) => {
  try {
    res.status(200).json({ message: `network` })
  } catch (error) {
    res.status(400).json({ message: `no network` })
  }
})

app.use((req, res, next) => {
  handleError(res, 404, `Request not found: ${req.method} ${req.originalUrl}`)
})

export { app, server, io }
