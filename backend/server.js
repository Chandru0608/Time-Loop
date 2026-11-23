import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import roomRoutes from "./routes/rooms.js";
import gameRoutes from "./routes/game.js";
import attachSockets from "./sockets/index.js";

const app = express();
const server = http.createServer(app);
const allowedOrigin = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({ origin: allowedOrigin }));
app.use(express.json());
app.get("/", (_req, res) => res.json({ name: "TIME LOOP: The Last Timeline", status: "online" }));
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/game", gameRoutes);

const io = new Server(server, { cors: { origin: allowedOrigin, methods: ["GET", "POST"] } });
attachSockets(io);

const port = process.env.PORT || 5000;
connectDB().then(() => server.listen(port, () => console.log(`TIME LOOP API listening on ${port}`)))
  .catch(err => { console.error("Startup failed:", err.message); process.exit(1); });
