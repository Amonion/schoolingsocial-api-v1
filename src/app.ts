import express, {
  Application,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes";

const app: Application = express();

// Middleware to log requests
const requestLogger: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

app.use(requestLogger);

app.use(cors());
app.use(bodyParser.json());
app.use("/api/v1/users", userRoutes);

export default app;
