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
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "http://localhost:3000"
        : "http://localhost:3000", // Replace with your frontend URL in production
    methods: "GET,POST, PATCH, PUT,DELETE", // Allowed HTTP methods
    credentials: true, // Allow cookies to be sent
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
