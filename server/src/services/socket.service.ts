import { Server } from 'socket.io';
import { socketAuth } from '../middleware/socket.middleware';
import { publishSocketEvent, setupRedisBridge } from './redis.service';
import { prisma } from '../config/database';

export const createSocketServer = (io: Server) => {
  io.use(socketAuth);
  setupRedisBridge(io);

  io.on('connection', (socket) => {
    const userId = (socket as any).userId as string;
    console.log('Socket connected:', socket.id, 'user:', userId);
    io.emit('user:online', { userId });

    // Debug: log all incoming events for this socket
    socket.onAny((event, ...args) => {
      console.log('Socket event:', event, 'from', userId, 'payload keys:', Object.keys(args?.[0] || {}));
    });

    socket.on('disconnect', () => {
      io.emit('user:offline', { userId });
    });

    socket.on('join:channel', (channelId: string) => {
      socket.join(channelId);
    });

    socket.on('leave:channel', (channelId: string) => {
      socket.leave(channelId);
    });

    socket.on('message:send', async (payload) => {
      console.log('message:send received from user', userId, 'channel', payload?.channelId);
      try {
        // Save message to database
        const message = await prisma.message.create({
          data: {
            content: payload.content || '',
            channelId: payload.channelId,
            senderId: userId,
            parentId: payload.parentId || null,
            attachments: payload.attachments || []
          },
          include: { sender: true, reactions: true }
        });

        console.log('Message saved via socket:', message.id, 'channel:', message.channelId);
        // Broadcast the saved message with full sender info
        publishSocketEvent('message:new', message, payload.channelId);
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    socket.on('message:edit', async (payload) => {
      try {
        const message = await prisma.message.update({
          where: { id: payload.id },
          data: { content: payload.content },
          include: { sender: true, reactions: true }
        });
        publishSocketEvent('message:updated', message, payload.channelId);
      } catch (error) {
        console.error('Error updating message:', error);
        socket.emit('error', { message: 'Failed to update message' });
      }
    });

    socket.on('message:delete', async (payload) => {
      try {
        await prisma.message.delete({ where: { id: payload.id } });
        publishSocketEvent('message:deleted', payload, payload.channelId);
      } catch (error) {
        console.error('Error deleting message:', error);
        socket.emit('error', { message: 'Failed to delete message' });
      }
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

