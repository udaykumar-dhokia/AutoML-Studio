import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.config";

import authRoutes from "./features/auth/auth.routes";
import userRoutes from "./features/user/user.routes";
import datasetRoutes from "./features/dataset/dataset.routes";

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dataset", datasetRoutes);

server.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
  connectDB();
});
