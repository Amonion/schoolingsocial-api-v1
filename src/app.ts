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
import statRoutes from "./routes/team/statRoutes";
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
import { TeamSocket } from "./routes/team/socketRoutes";

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
      case "team":
        await TeamSocket(data);
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
app.use("/api/v1/user-stats", statRoutes);
app.use("/api/v1/users", userRoutes);
app.get("/api/v1/user-ip", (req, res) => {
  let ip: string | undefined;

  const forwarded = req.headers["x-forwarded-for"];

  if (typeof forwarded === "string") {
    ip = forwarded.split(",")[0];
  } else if (Array.isArray(forwarded)) {
    ip = forwarded[0];
  } else {
    ip = req.socket?.remoteAddress || undefined;
  }
  if (ip?.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }
  res.json({ ip });
});

app.use((req, res, next) => {
  handleError(res, 404, `Request not found: ${req.method} ${req.originalUrl}`);
});

export { app, server, io };
//import fs from "fs";
// import csv from "csv-parser";

// interface IpRange {
//   from: number;
//   to: number;
//   country: string;
// }

// const ipRanges: IpRange[] = [];

// fs.createReadStream("src/file.csv")
//   .pipe(csv({ headers: false }))
//   .on("data", (row) => {
//     const from = parseInt(row[0]);
//     const to = parseInt(row[1]);
//     const country = row[3];
//     if (!isNaN(from) && !isNaN(to) && country) {
//       ipRanges.push({ from, to, country });
//     }
//   })
//   .on("end", () => {
//     fs.writeFileSync("ip-country.json", JSON.stringify(ipRanges));
//     console.log(`Saved ${ipRanges.length} records to ip-country.json`);
//   });
