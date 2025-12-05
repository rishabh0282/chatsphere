import { redisPublisher, redisSubscriber } from '../config/redis';
import { Server } from 'socket.io';

const CHANNEL = 'socket-events';

export const setupRedisBridge = (io: Server) => {
  redisSubscriber.subscribe(CHANNEL);
  redisSubscriber.on('message', (_channel, message) => {
    try {
      const { event, data, room } = JSON.parse(message);
      if (room) {
        io.to(room).emit(event, data);
      } else {
        io.emit(event, data);
      }
    } catch {
      // ignore malformed messages
    }
  });
};

export const publishSocketEvent = (event: string, data: unknown, room?: string) => {
  redisPublisher.publish(CHANNEL, JSON.stringify({ event, data, room }));
};

