import express, {
  Application,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { handleError } from "./utils/errorHandler";

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

app.use(cors());
app.use(bodyParser.json());
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
