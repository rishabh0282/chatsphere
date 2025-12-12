import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from './app';
import { createSocketServer } from './services/socket.service';

dotenv.config();

const port = Number(process.env.PORT) || 5000;
const server = http.createServer(app);

// Socket.io CORS configuration - allow both localhost and production frontend URL
const frontendUrl = process.env.FRONTEND_URL;
const socketAllowedOrigins: string[] = ['http://localhost:3000'];

if (frontendUrl) {
  // Add with and without trailing slash to match Express CORS config
  const urlWithoutSlash = frontendUrl.replace(/\/$/, '');
  const urlWithSlash = `${urlWithoutSlash}/`;
  socketAllowedOrigins.push(urlWithoutSlash, urlWithSlash);
}

console.log('Socket.io allowed CORS origins:', socketAllowedOrigins);

const io = new Server(server, {
  cors: {
    origin: socketAllowedOrigins,
    credentials: true,
    methods: ['GET', 'POST']
  }
});

createSocketServer(io);

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
});

