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
const competitionRoutes_1 = __importDefault(require("./routes/team/competitionRoutes"));
const companyRoutes_1 = __importDefault(require("./routes/team/companyRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/team/messageRoutes"));
const newsRoutes_1 = __importDefault(require("./routes/team/newsRoutes"));
const placeRoutes_1 = __importDefault(require("./routes/team/placeRoutes"));
const postRoutes_1 = __importDefault(require("./routes/users/postRoutes"));
const schoolRoutes_1 = __importDefault(require("./routes/team/schoolRoutes"));
const userMessageRoutes_1 = __importDefault(require("./routes/users/userMessageRoutes"));
const userCompetitionRoutes_1 = __importDefault(require("./routes/users/userCompetitionRoutes"));
const userRoutes_1 = __importDefault(require("./routes/users/userRoutes"));
const chatController_1 = require("./controllers/users/chatController");
const postController_1 = require("./controllers/users/postController");
const fileUpload_1 = require("./utils/fileUpload");
const notificationController_1 = require("./controllers/team/notificationController");
dotenv_1.default.config();
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const requestLogger = (req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
};
app.use(requestLogger);
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "https://schoolingsocial.netlify.app",
        "https://schoolingsocial.com",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "socket-id"],
}));
const io = new socket_io_1.Server(server, {
    cors: {
        origin: [
            "http://localhost:3000",
            "https://schoolingsocial.netlify.app",
            "https://schoolingsocial.com",
        ],
        methods: ["GET", "POST"],
        credentials: true,
    },
    transports: ["websocket", "polling"],
});
exports.io = io;
io.on("connection", (socket) => {
    console.log(`✅ User connected: ${socket.id}`);
    socket.on("message", (data) => __awaiter(void 0, void 0, void 0, function* () {
        switch (data.to) {
            case "chat":
                const chatResponse = yield (0, chatController_1.createChat)(data);
                io.emit("chatResponse", chatResponse);
                break;
            case "confirm":
                const confirmResponse = yield (0, chatController_1.confirmChats)(data);
                io.emit("confirmResponse", confirmResponse);
                break;
            case "deleteChat":
                const deleteChatResponse = yield (0, chatController_1.deleteChat)(data);
                io.emit("deleteChatResponse", deleteChatResponse);
                break;
            case "users":
                const response = yield (0, postController_1.createPost)(data);
                io.emit("message", response);
                break;
            case "notifications":
                const nResponse = yield (0, notificationController_1.routeNotification)(data);
                io.emit("count", nResponse);
                break;
            default:
                break;
        }
    }));
    socket.on("disconnect", () => {
        console.log(`❌ User disconnected.: ${socket.id}`);
    });
});
app.use(body_parser_1.default.json());
app.use("/api/v1/s3-delete-file", fileUpload_1.removeFile);
app.use("/api/v1/s3-presigned-url", fileUpload_1.getPresignedUrl);
app.use("/api/v1/competitions", competitionRoutes_1.default);
app.use("/api/v1/company", companyRoutes_1.default);
app.use("/api/v1/messages", messageRoutes_1.default);
app.use("/api/v1/news", newsRoutes_1.default);
app.use("/api/v1/places", placeRoutes_1.default);
app.use("/api/v1/posts", postRoutes_1.default);
app.use("/api/v1/schools", schoolRoutes_1.default);
app.use("/api/v1/user-competitions", userCompetitionRoutes_1.default);
app.use("/api/v1/user-messages", userMessageRoutes_1.default);
app.use("/api/v1/users", userRoutes_1.default);
// ✅ Error Handling Middleware
app.use((req, res, next) => {
    (0, errorHandler_1.handleError)(res, 404, `Request not found: ${req.method} ${req.originalUrl}`);
});
