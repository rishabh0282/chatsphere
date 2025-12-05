import { verifyAccessToken } from '../utils/jwt.utils';
import { Socket } from 'socket.io';

export const socketAuth = (socket: Socket, next: (err?: Error) => void) => {
  const token = socket.handshake.auth?.token as string | undefined;
  if (!token) return next(new Error('Unauthorized'));
  try {
    const payload = verifyAccessToken(token);
    (socket as any).userId = payload.userId;
    return next();
  } catch (err) {
    return next(new Error('Unauthorized'));
  }
};

