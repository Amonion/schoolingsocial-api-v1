import dotenv from "dotenv";
import app from "./app";
import connectDB from "./database/connection";

dotenv.config();

const PORT = process.env.PORT || 8000;
const MONGO_URI =
  process.env.NODE_ENV === "production"
    ? process.env.MONGO_URI_CLOUD || ""
    : process.env.MONGO_URI || ""; // const MONGO_URI =

connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
