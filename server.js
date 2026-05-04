const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// Initialize Next.js
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.IO
  const io = new Server(httpServer, {
    path: '/api/socket',
    cors: {
      origin: process.env.NEXTAUTH_URL || `http://localhost:${port}`,
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('⚡ User connected:', socket.id);

    socket.on('join-trip', (tripId) => {
      socket.join(tripId);
      console.log(`User ${socket.id} joined trip ${tripId}`);
    });

    socket.on('leave-trip', (tripId) => {
      socket.leave(tripId);
      console.log(`User ${socket.id} left trip ${tripId}`);
    });

    socket.on('invite-member', ({ tripId, email }) => {
      io.to(tripId).emit('member-invited', { email });
      console.log(`Member invited to trip ${tripId}: ${email}`);
    });

    socket.on('disconnect', () => {
      console.log('⚡ User disconnected:', socket.id);
    });
  });

  // Make io accessible globally
  global.io = io;

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
});