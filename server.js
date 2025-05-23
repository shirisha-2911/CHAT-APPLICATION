const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

const activeUsers = new Set();

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  socket.on('newUser', (username) => {
    socket.username = username;
    activeUsers.add(username);
    io.emit('updateUsers', Array.from(activeUsers));
    io.emit('message', {
      type: 'system',
      text: `${username} joined the chat`
    });
    console.log(`${username} joined!`);
  });

  socket.on('disconnect', () => {
    if (socket.username) {
      activeUsers.delete(socket.username);
      io.emit('updateUsers', Array.from(activeUsers));
      io.emit('message', {
        type: 'system',
        text: `${socket.username} left the chat`
      });
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});