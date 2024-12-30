import dotenv from "dotenv";
import app from "./app";
import connectDB from "./database/connection";

dotenv.config();

const PORT = process.env.PORT || 4000;
// const MONGO_URI = process.env.MONGO_URI_CLOUD || "";
const MONGO_URI =
  "mongodb+srv://Schooling:Schooling123$@schooling.sacte.mongodb.net/Schooling?retryWrites=true&w=majority";

console.log(MONGO_URI);

connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
