import express, { Application, RequestHandler } from 'express'
import http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import bodyParser from 'body-parser'
import dotenv from 'dotenv'
import { handleError } from './utils/errorHandler'
import competitionRoutes from './routes/exam/competitionRoutes'
import companyRoutes from './routes/appRoutes/companyRoutes'
import questionRoutes from './routes/exam/questionRoutes'
import messageRoutes from './routes/message/messageRoutes'
import newsRoutes from './routes/news/newsRoutes'
import placeRoutes from './routes/place/placeRoutes'
import postRoutes from './routes/post/postRoutes'
import courseRoutes from './routes/school/courseRoutes'
import departmentRoutes from './routes/school/departmentRoutes'
import facultyRoutes from './routes/school/facultyRoutes'
import schoolRoutes from './routes/school/schoolRoutes'
import statRoutes from './routes/team/statRoutes'
import adsRoutes from './routes/place/adsRoutes'
import academicLevelRoutes from './routes/place/academicLevelRoutes'
import bankRoutes from './routes/place/bankRoutes'
import officeRoutes from './routes/utility/officeRoutes'
import placeDocumentRoutes from './routes/place/placeDocumentRoutes'
import placePaymentRoutes from './routes/place/placePaymentRoutes'
import notificationRoutes from './routes/message/notificationRoutes'
import userCompetitionRoutes from './routes/users/userCompetitionRoutes'
import userRoutes from './routes/users/userRoutes'
import transactionRoutes from './routes/finance/transactionRoutes'
import utilityRoutes from './routes/utility/utilityRoutes'
import aiRoutes from './routes/utility/aiRoutes'
import {
  createChat,
  deleteChat,
  readChats,
} from './controllers/users/chatController'
import { createPost } from './controllers/post/postController'
import { getPresignedUrl, removeFile } from './utils/fileUpload'
import { geoipMiddleware } from './middlewares/geoipMiddleware'
import { UsersSocket } from './routes/socket/usersSocket'
import { createMoment, updateMoment } from './controllers/post/momentController'

dotenv.config()

const app: Application = express()
const server = http.createServer(app)

app.use(geoipMiddleware)

const requestLogger: RequestHandler = (req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.url} from ${
      (req as any).country
    }`
  )
  next()
}

app.use(requestLogger)

app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://schoolingsocial.netlify.app',
      'https://schoolingweb.netlify.app',
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
      case 'post':
        createPost(data)
        break
      case 'updateMoment':
        updateMoment(data)
        break
      case 'moment':
        createMoment(data)
        break
      case 'users':
        await UsersSocket(data)
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
app.use('/api/v1/academic-levels', academicLevelRoutes)
app.use('/api/v1/intelligence', aiRoutes)
app.use('/api/v1/ads', adsRoutes)
app.use('/api/v1/banks', bankRoutes)
app.use('/api/v1/competitions', competitionRoutes)
app.use('/api/v1/questions', questionRoutes)
app.use('/api/v1/courses', courseRoutes)
app.use('/api/v1/company', companyRoutes)
app.use('/api/v1/documents', placeDocumentRoutes)
app.use('/api/v1/messages', messageRoutes)
app.use('/api/v1/news', newsRoutes)
app.use('/api/v1/offices', officeRoutes)
app.use('/api/v1/payments', placePaymentRoutes)
app.use('/api/v1/places', placeRoutes)
app.use('/api/v1/posts', postRoutes)
app.use('/api/v1/departments', departmentRoutes)
app.use('/api/v1/faculties', facultyRoutes)
app.use('/api/v1/schools', schoolRoutes)
app.use('/api/v1/utilities', utilityRoutes)
app.use('/api/v1/user-competitions', userCompetitionRoutes)
app.use('/api/v1/notifications', notificationRoutes)
app.use('/api/v1/user-stats', statRoutes)
app.use('/api/v1/users', userRoutes)
app.use('/api/v1/transactions', transactionRoutes)
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

app.use((req, res, next) => {
  handleError(res, 404, `Request not found: ${req.method} ${req.originalUrl}`)
  next()
})

export { app, server, io }
