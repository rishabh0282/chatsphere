import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import app from './app';
import { createSocketServer } from './services/socket.service';

dotenv.config();

const port = Number(process.env.PORT) || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' }
});

createSocketServer(io);

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on port ${port}`);
});

