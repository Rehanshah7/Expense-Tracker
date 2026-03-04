import dotenv from "dotenv";
import app from "./src/app";
import { connectDB } from "./src/config/db";

dotenv.config();

const PORT = process.env.PORT;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
