import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.config";
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index";
import { Server as SocketIOServer } from "socket.io";

import authRoutes from "./features/auth/auth.routes";
import userRoutes from "./features/user/user.routes";
import datasetRoutes from "./features/dataset/dataset.routes";
import workflowRoutes from "./features/workflow/workflow.routes";
import nodeRoutes from "./features/nodes/node.routes";
import operationsRoutes from "./features/operations/operations.routes";
import containerRoutes from "./features/container/container.routes";
import "./utils/container.socket";

const app = express();
const server = http.createServer(app);

export const io = new SocketIOServer(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://automlstudio.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  console.log(`🟢 Client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`🔴 Client disconnected: ${socket.id}`);
  });

  socket.on("error", (error) => {
    console.error(`❌ Socket error from ${socket.id}:`, error);
  });
});

app.use(
  cors({
    origin: ["http://localhost:5173", "https://automlstudio.vercel.app"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/dataset", datasetRoutes);
app.use("/api/workflow", workflowRoutes);
app.use("/api/node", nodeRoutes);
app.use("/api/operations", operationsRoutes);
app.use("/api/container", containerRoutes);

server.listen(process.env.PORT || 3000, () => {
  console.log(`🟢 Server is running on port ${process.env.PORT || 3000}`);
  connectDB();
});
