import express, {
  Application,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { handleError } from "./utils/errorHandler";
import jwt from "jsonwebtoken";

import messageRoutes from "./routes/team/messageRoutes";
import placeRoutes from "./routes/team/placeRoutes";
import userRoutes from "./routes/users/userRoutes";

const app: Application = express();

const requestLogger: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};
app.use(requestLogger);
dotenv.config();
app.use(cors());
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       const allowedOrigins = [
//         "https://schoolingsocial.netlify.app",
//         "https://anotherdomain.com",
//       ];
//       if (process.env.NODE_ENV === "production") {
//         if (origin && allowedOrigins.includes(origin)) {
//           callback(null, true);
//         } else {
//           callback(new Error("Not allowed by CORS")); // Reject the origin
//         }
//       } else {
//         callback(null, true);
//       }
//     },
//     methods: "GET,POST, PATCH, PUT,DELETE", // Allowed HTTP methods
//     credentials: true,
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://schoolingsocial.com"
        : "http://localhost:3000", // Replace with your frontend URL in production
    methods: "GET,POST, PATCH, PUT,DELETE", // Allowed HTTP methods
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/places", placeRoutes);
app.use("/api/v1/users", userRoutes);

app.use((req, res, next) => {
  handleError(
    res,
    404,
    `Request not found, cannot ${req.method} ${req.originalUrl}`
  );
});

export default app;
