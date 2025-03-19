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
import userMessageRoutes from "./routes/users/userMessageRoutes";
import newsRoutes from "./routes/team/newsRoutes";
import placeRoutes from "./routes/team/placeRoutes";
import postRoutes from "./routes/users/postRoutes";
import schoolRoutes from "./routes/team/schoolRoutes";
import userRoutes from "./routes/users/userRoutes";
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
      case "users":
        const response = await createPost(data);
        io.emit("message", response);
        break;
      case "notifications":
        const nResponse = await routeNotification(data);
        io.emit("count", nResponse);
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
app.use("/api/v1/competitions", competitionRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/places", placeRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/schools", schoolRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/user-messages", userMessageRoutes);
app.use("/api/v1/btc", async (req, res) => {
  try {
    const symbol = req.query.symbol || "BTCUSDT";

    const proxyUrl = "https://cors-anywhere.herokuapp.com/";
    const url = `${proxyUrl}https://api.bybit.com/v5/market/tickers?category=spot&symbol=${symbol}`;

    const headers = { "User-Agent": "Mozilla/5.0" };

    const response = await fetch(url, { headers });
    const data = await response.json();

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch price", details: error });
  }
});

app.use((req, res, next) => {
  handleError(res, 404, `Request not found: ${req.method} ${req.originalUrl}`);
});

export { app, server, io };
