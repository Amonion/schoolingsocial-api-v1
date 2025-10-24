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
exports.io = exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorHandler_1 = require("./utils/errorHandler");
const competitionRoutes_1 = __importDefault(require("./routes/exam/competitionRoutes"));
const companyRoutes_1 = __importDefault(require("./routes/appRoutes/companyRoutes"));
const questionRoutes_1 = __importDefault(require("./routes/exam/questionRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/message/messageRoutes"));
const newsRoutes_1 = __importDefault(require("./routes/news/newsRoutes"));
const placeRoutes_1 = __importDefault(require("./routes/place/placeRoutes"));
const postRoutes_1 = __importDefault(require("./routes/post/postRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/message/chatRoutes"));
const courseRoutes_1 = __importDefault(require("./routes/school/courseRoutes"));
const departmentRoutes_1 = __importDefault(require("./routes/school/departmentRoutes"));
const facultyRoutes_1 = __importDefault(require("./routes/school/facultyRoutes"));
const schoolRoutes_1 = __importDefault(require("./routes/school/schoolRoutes"));
const statRoutes_1 = __importDefault(require("./routes/team/statRoutes"));
const adsRoutes_1 = __importDefault(require("./routes/place/adsRoutes"));
const academicLevelRoutes_1 = __importDefault(require("./routes/place/academicLevelRoutes"));
const bankRoutes_1 = __importDefault(require("./routes/place/bankRoutes"));
const officeRoutes_1 = __importDefault(require("./routes/utility/officeRoutes"));
const placeDocumentRoutes_1 = __importDefault(require("./routes/place/placeDocumentRoutes"));
const placePaymentRoutes_1 = __importDefault(require("./routes/place/placePaymentRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/message/notificationRoutes"));
const userCompetitionRoutes_1 = __importDefault(require("./routes/users/userCompetitionRoutes"));
const userRoutes_1 = __importDefault(require("./routes/users/userRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/finance/transactionRoutes"));
const utilityRoutes_1 = __importDefault(require("./routes/utility/utilityRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/utility/aiRoutes"));
const chatController_1 = require("./controllers/message/chatController");
const postController_1 = require("./controllers/post/postController");
const fileUpload_1 = require("./utils/fileUpload");
const geoipMiddleware_1 = require("./middlewares/geoipMiddleware");
const usersSocket_1 = require("./routes/socket/usersSocket");
const momentController_1 = require("./controllers/post/momentController");
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
app.use(geoipMiddleware_1.geoipMiddleware);
const requestLogger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} from ${req.country}`);
    next();
};
app.use(requestLogger);
app.use((0, cors_1.default)({
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
}));
const io = new socket_io_1.Server(server, {
    cors: {
        origin: [
            'http://localhost:3000',
            'https://schoolingweb.netlify.app',
            'https://schoolingsocial.netlify.app',
            'https://schoolingsocial.com',
        ],
        methods: ['GET', 'POST'],
        credentials: true,
    },
    transports: ['websocket', 'polling'],
});
exports.io = io;
io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);
    socket.on('message', (data) => __awaiter(void 0, void 0, void 0, function* () {
        switch (data.to) {
            case 'chat':
                (0, chatController_1.createChat)(data);
                break;
            case 'deliveredChat':
                (0, chatController_1.updateDeliveredChat)(data.chat);
                break;
            case 'pendingChat':
                (0, chatController_1.sendPendingChats)(data);
            case 'checkRead':
                (0, chatController_1.checkChatStatus)(data);
                break;
            case 'read':
                (0, chatController_1.readChats)(data);
                break;
            case 'deleteChat':
                (0, chatController_1.deleteChat)(data);
                break;
            case 'post':
                (0, postController_1.createPost)(data);
                break;
            case 'updateMoment':
                (0, momentController_1.updateMoment)(data);
                break;
            case 'moment':
                (0, momentController_1.createMoment)(data);
                break;
            case 'users':
                yield (0, usersSocket_1.UsersSocket)(data);
                break;
            default:
                break;
        }
    }));
    socket.on('disconnect', () => {
        console.log(`❌ User disconnected.: ${socket.id}`);
    });
});
app.use(body_parser_1.default.json());
app.use('/api/v1/s3-delete-file', fileUpload_1.removeFile);
app.use('/api/v1/s3-presigned-url', fileUpload_1.getPresignedUrl);
app.use('/api/v1/academic-levels', academicLevelRoutes_1.default);
app.use('/api/v1/intelligence', aiRoutes_1.default);
app.use('/api/v1/ads', adsRoutes_1.default);
app.use('/api/v1/banks', bankRoutes_1.default);
app.use('/api/v1/competitions', competitionRoutes_1.default);
app.use('/api/v1/questions', questionRoutes_1.default);
app.use('/api/v1/courses', courseRoutes_1.default);
app.use('/api/v1/chats', chatRoutes_1.default);
app.use('/api/v1/company', companyRoutes_1.default);
app.use('/api/v1/documents', placeDocumentRoutes_1.default);
app.use('/api/v1/messages', messageRoutes_1.default);
app.use('/api/v1/news', newsRoutes_1.default);
app.use('/api/v1/offices', officeRoutes_1.default);
app.use('/api/v1/payments', placePaymentRoutes_1.default);
app.use('/api/v1/places', placeRoutes_1.default);
app.use('/api/v1/posts', postRoutes_1.default);
app.use('/api/v1/departments', departmentRoutes_1.default);
app.use('/api/v1/faculties', facultyRoutes_1.default);
app.use('/api/v1/schools', schoolRoutes_1.default);
app.use('/api/v1/utilities', utilityRoutes_1.default);
app.use('/api/v1/user-competitions', userCompetitionRoutes_1.default);
app.use('/api/v1/notifications', notificationRoutes_1.default);
app.use('/api/v1/user-stats', statRoutes_1.default);
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/transactions', transactionRoutes_1.default);
app.get('/api/v1/user-ip', (req, res) => {
    var _a;
    let ip;
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
        ip = forwarded.split(',')[0];
    }
    else if (Array.isArray(forwarded)) {
        ip = forwarded[0];
    }
    else {
        ip = ((_a = req.socket) === null || _a === void 0 ? void 0 : _a.remoteAddress) || undefined;
    }
    if (ip === null || ip === void 0 ? void 0 : ip.startsWith('::ffff:')) {
        ip = ip.replace('::ffff:', '');
    }
    res.json({ ip });
});
app.use((req, res, next) => {
    (0, errorHandler_1.handleError)(res, 404, `Request not found: ${req.method} ${req.originalUrl}`);
    next();
});
