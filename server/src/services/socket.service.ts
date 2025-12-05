import { Server } from 'socket.io';
import { socketAuth } from '../middleware/socket.middleware';
import { publishSocketEvent, setupRedisBridge } from './redis.service';

export const createSocketServer = (io: Server) => {
  io.use(socketAuth);
  setupRedisBridge(io);

  io.on('connection', (socket) => {
    const userId = (socket as any).userId as string;
    io.emit('user:online', { userId });

    socket.on('disconnect', () => {
      io.emit('user:offline', { userId });
    });

    socket.on('join:channel', (channelId: string) => {
      socket.join(channelId);
    });

    socket.on('leave:channel', (channelId: string) => {
      socket.leave(channelId);
    });

    socket.on('message:send', (payload) => {
      publishSocketEvent('message:new', payload, payload.channelId);
    });

    socket.on('message:edit', (payload) => {
      publishSocketEvent('message:updated', payload, payload.channelId);
    });

    socket.on('message:delete', (payload) => {
      publishSocketEvent('message:deleted', payload, payload.channelId);
    });

    socket.on('typing', ({ channelId, isTyping }) => {
      publishSocketEvent(isTyping ? 'typing:start' : 'typing:stop', { userId, channelId }, channelId);
    });

    socket.on('reaction:add', (payload) => {
      publishSocketEvent('reaction:added', payload, payload.channelId);
    });

    socket.on('presence:update', (payload) => {
      publishSocketEvent('user:online', { ...payload, userId }, undefined);
    });
  });
};

