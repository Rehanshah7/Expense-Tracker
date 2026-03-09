import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import healthRoutes from "./routes/health.routes";
import categoryRoutes from "./routes/category.routes";
import transactionRoutes from "./transaction/transaction.routes";
import { languageMiddleware } from "./middlewares/language.middleware";

const app = express();

app.use(cors());
app.use(express.json());

app.use(languageMiddleware);

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);

export default app;
