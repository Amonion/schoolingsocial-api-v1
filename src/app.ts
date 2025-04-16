import express, { Application, RequestHandler } from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { handleError } from "./utils/errorHandler";
import competitionRoutes from "./routes/team/competitionRoutes";
import companyRoutes from "./routes/team/companyRoutes";
import messageRoutes from "./routes/team/messageRoutes";
import newsRoutes from "./routes/team/newsRoutes";
import placeRoutes from "./routes/team/placeRoutes";
import postRoutes from "./routes/users/postRoutes";
import schoolRoutes from "./routes/team/schoolRoutes";
import userMessageRoutes from "./routes/users/userMessageRoutes";
import userCompetitionRoutes from "./routes/users/userCompetitionRoutes";
import userRoutes from "./routes/users/userRoutes";
import {
  confirmChats,
  createChat,
  deleteChat,
  readChats,
} from "./controllers/users/chatController";
import { createPost } from "./controllers/users/postController";
import { getPresignedUrl, removeFile } from "./utils/fileUpload";
import { routeNotification } from "./controllers/team/notificationController";

dotenv.config();

const app: Application = express();
const server = http.createServer(app);
const requestLogger: RequestHandler = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

app.use(requestLogger);

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://schoolingsocial.netlify.app",
      "https://schoolingsocial.com",
    ],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "socket-id"],
  })
);

const io = new Server(server, {
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

io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  socket.on("message", async (data) => {
    switch (data.to) {
      case "chat":
        createChat(data);
        break;
      case "read":
        const readResponse = await readChats(data);
        io.emit("readResponse", readResponse);
        break;
      case "confirm":
        const confirmResponse = await confirmChats(data);
        io.emit("confirmResponse", confirmResponse);
        break;
      case "deleteChat":
        const deleteChatResponse = await deleteChat(data);
        io.emit("deleteChatResponse", deleteChatResponse);
        break;
      case "users":
        const response = await createPost(data);
        io.emit("message", response);
        break;
      default:
        break;
    }
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected.: ${socket.id}`);
  });
});

app.use(bodyParser.json());
app.use("/api/v1/s3-delete-file", removeFile);
app.use("/api/v1/s3-presigned-url", getPresignedUrl);
// app.use("/api/v1/s3-metadata", getExtension);
app.use("/api/v1/competitions", competitionRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/places", placeRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/schools", schoolRoutes);
app.use("/api/v1/user-competitions", userCompetitionRoutes);
app.use("/api/v1/user-messages", userMessageRoutes);

app.use("/api/v1/users", userRoutes);

// ✅ Error Handling Middleware
app.use((req, res, next) => {
  handleError(res, 404, `Request not found: ${req.method} ${req.originalUrl}`);
});

// ✅ Export both `app` and `server`
export { app, server, io };
