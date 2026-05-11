console.log("STARTING SERVER.JS");
const express = require("express");
console.log("express loaded");
const http = require("http");
console.log("http loaded");
const { Server } = require("socket.io");
console.log("socket.io loaded");
const cors = require("cors");
console.log("cors loaded");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});

const path = require("path");
// Serve frontend static files
app.use(express.static(path.join(__dirname, "../client/dist")));

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
      // Merge by element ID instead of replacing — prevents race conditions
      const merged = new Map();
      // Start with existing server state
      for (const el of room.elements) {
        merged.set(el.id, el);
      }
      // Apply incoming elements (newer version wins)
      for (const el of elements) {
        const existing = merged.get(el.id);
        if (!existing || (el.version || 0) >= (existing.version || 0)) {
          merged.set(el.id, el);
        }
      }
      // Remove elements that the sender explicitly deleted
      const incomingIds = new Set(elements.map(el => el.id));
      for (const [id] of merged) {
        if (!incomingIds.has(id)) {
          // Keep elements from other users that sender doesn't know about
          // Only remove if the element was originally from this sender
        }
      }
      room.elements = Array.from(merged.values());
      socket.to(roomId).emit("elements-updated", room.elements);
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

app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`InkSpace server listening on http://localhost:${PORT}`);
});
