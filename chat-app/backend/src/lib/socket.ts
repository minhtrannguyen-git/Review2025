import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);

const userSocketMap: { [key: string]: string } = {};

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

export function getUserSocket(userId: string){
  return userSocketMap[userId];
}

io.on("connection", (socket) => {
  console.log("A user connected: ", socket.id);
  const userId = socket.handshake.query.userId as string;
  if (userId) userSocketMap[userId] = socket.id;
  console.log("User connected: ", userId);
  console.log("Socket Map: ", Object.keys(userSocketMap));
  io.emit(
    "online-users",
    Object.keys(userSocketMap)
  );

  socket.on("request-online-users", () => {
    socket.emit(
      "online-users",
      Object.keys(userSocketMap)
    );
  });

  socket.on("disconnect", () => {
    // ✅ Ensure we remove only existing users
    if (userSocketMap[userId]) {
      delete userSocketMap[userId];
      io.emit(
        "online-users",
        Object.keys(userSocketMap)
      );
    }
  });
});

export { io, app, server };
