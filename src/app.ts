import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import customerRoutes from "./routes/customerRoutes";
import matterRoutes from "./routes/matterRoutes";
import { errorHandler } from "./middleware/errorHandler";
import statsRoutes from "./routes/statsRoutes";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/customers/:customerId/matters", matterRoutes);
app.use("/api/stats", statsRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
