const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = 3000;

io.on('connection', (socket) => {
  console.log('User Connected:', socket.id);

  // Join Room
  socket.on('joinRoom', ({ username, room }) => {
    socket.join(room);
    io.to(room).emit('message', { username: 'Admin', message: `${username} has joined the room.` });
  });

  // Send Message
  socket.on('sendMessage', ({ message, room, username }) => {
    io.to(room).emit('message', { username, message });
  });

  // Disconnect Event
  socket.on('disconnect', () => {
    console.log('User Disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
