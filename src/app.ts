import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import healthRoutes from "./routes/health.routes";
import { languageMiddleware } from "./middlewares/language.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use(languageMiddleware);

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);

export default app;
