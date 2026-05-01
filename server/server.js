const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

// { roomId: { elements: [], users: Map<socketId, { name, color }> } }
const rooms = new Map();

const COLORS = ["#e03131","#2f9e44","#1971c2","#f08c00","#6741d9","#0c8599","#e8590c","#d6336c"];

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);

  socket.on("join-room", ({ roomId, nickname }) => {
    socket.join(roomId);

    if (!rooms.has(roomId)) {
      rooms.set(roomId, { elements: [], users: new Map() });
    }

    const room = rooms.get(roomId);
    const color = COLORS[room.users.size % COLORS.length];
    room.users.set(socket.id, { name: nickname || "Anonymous", color });

    // Send current state to the joiner
    socket.emit("init-state", room.elements);

    // Send updated user list to everyone in the room
    const userList = Array.from(room.users.values());
    io.to(roomId).emit("users-update", userList);

    // Store roomId on socket for disconnect cleanup
    socket.data.roomId = roomId;
  });

  socket.on("update-elements", ({ roomId, elements }) => {
    const room = rooms.get(roomId);
    if (room) {
      room.elements = elements;
      socket.to(roomId).emit("elements-updated", elements);
    }
  });

  socket.on("disconnect", () => {
    const roomId = socket.data.roomId;
    if (roomId && rooms.has(roomId)) {
      const room = rooms.get(roomId);
      room.users.delete(socket.id);

      const userList = Array.from(room.users.values());
      io.to(roomId).emit("users-update", userList);

      // Clean up empty rooms after 30 min
      if (room.users.size === 0) {
        setTimeout(() => {
          if (rooms.has(roomId) && rooms.get(roomId).users.size === 0) {
            rooms.delete(roomId);
          }
        }, 30 * 60 * 1000);
      }
    }
    console.log("Disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`InkSpace server listening on http://localhost:${PORT}`);
});
