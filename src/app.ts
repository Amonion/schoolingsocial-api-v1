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
import competitionRoutes from "./routes/team/competitionRoutes";
import companyRoutes from "./routes/team/companyRoutes";
import messageRoutes from "./routes/team/messageRoutes";
import placeRoutes from "./routes/team/placeRoutes";
import schoolRoutes from "./routes/team/schoolRoutes";
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
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "https://schoolingsocial.netlify.app",
        "https://schoolingsocial.com",
      ];
      if (process.env.NODE_ENV === "production") {
        if (origin && allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      } else {
        callback(null, true);
      }
    },
    methods: "GET,POST, PATCH, PUT,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(bodyParser.json());
app.use("/api/v1/competitions", competitionRoutes);
app.use("/api/v1/company", companyRoutes);
app.use("/api/v1/messages", messageRoutes);
app.use("/api/v1/places", placeRoutes);
app.use("/api/v1/schools", schoolRoutes);
app.use("/api/v1/users", userRoutes);

app.use((req, res, next) => {
  handleError(
    res,
    404,
    `Request not found, cannot ${req.method} ${req.originalUrl}`
  );
});

export default app;
