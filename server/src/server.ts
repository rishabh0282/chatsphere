import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from './app';
import { createSocketServer } from './services/socket.service';

dotenv.config();

const port = Number(process.env.PORT) || 5000;
const server = http.createServer(app);

// Socket.io CORS configuration - allow frontend URL in production
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:3000']
  : ['http://localhost:3000'];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

createSocketServer(io);

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
});

