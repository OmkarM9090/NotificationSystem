import express from "express";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import Notification from "./models/Notification.js";
import authRoutes from "./routes/authRoutes.js";
import User from "./models/User.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors());
app.use(express.json());

/* -------------------- ROUTES -------------------- */
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Notification Backend Running");
});
app.use("/api/notifications", notificationRoutes);

/* -------------------- DATABASE -------------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

/* -------------------- HTTP + SOCKET SERVER -------------------- */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/* -------------------- SOCKET AUTH MIDDLEWARE -------------------- */
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("No token provided"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new Error("User not found"));
    }

    // attach user to socket
    socket.user = user;

    next();
  } catch (error) {
    next(new Error("Authentication failed"));
  }
});

/* -------------------- SOCKET CONNECTION -------------------- */
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.user.email);

  // private room (one-to-one)
  socket.join(socket.user._id.toString());

  // role-based room (many-to-many)
  socket.join(`role_${socket.user.role}`);

  /* ---------------- GLOBAL NOTIFICATION ---------------- */
  socket.on("sendGlobalNotification", async ({ title, message }) => {
    if (socket.user.role !== "admin") return;

    const notification = await Notification.create({
      title,
      message,
      type: "global"
    });

    io.emit("receiveNotification", notification);
  });

  /* ---------------- ROLE NOTIFICATION ---------------- */
  socket.on("sendRoleNotification", async ({ title, message, role }) => {
    if (socket.user.role !== "admin") return;

    const notification = await Notification.create({
      title,
      message,
      type: "role",
      targetRole: role
    });

    io.to(`role_${role}`).emit("receiveNotification", notification);
  });

  /* ---------------- USER NOTIFICATION ---------------- */
  socket.on("sendUserNotification", async ({ title, message, userIdentifier }) => {
    if (socket.user.role !== "admin") return;

    // Normalize and validate identifier
    const identifier = (userIdentifier || "").trim();
    if (!identifier) {
      socket.emit("notificationError", { message: "❌ Please provide an email, username, or user ID" });
      return;
    }

    // Escape regex for safe case-insensitive name match
    const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    try {
      const searchQueries = [
        { email: identifier.toLowerCase() },
        { email: identifier },
        { name: identifier },
        { name: new RegExp(`^${escapeRegex(identifier)}$`, "i") }
      ];

      // If identifier looks like an ObjectId, try that too
      if (mongoose.isValidObjectId(identifier)) {
        searchQueries.unshift({ _id: identifier });
      }

      const targetUser = await User.findOne({ $or: searchQueries });

      if (!targetUser) {
        socket.emit("notificationError", {
          message: `❌ User not found: ${identifier}`
        });
        return;
      }

      const notification = await Notification.create({
        title,
        message,
        type: "user",
        targetUser: targetUser._id
      });

      io.to(targetUser._id.toString()).emit("receiveNotification", notification);
      socket.emit("notificationSuccess", {
        message: `✅ Notification sent to ${targetUser.name}`
      });
    } catch (error) {
      socket.emit("notificationError", {
        message: `❌ Error: ${error.message}`
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.user.email);
  });
});

/* -------------------- SERVER START -------------------- */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
