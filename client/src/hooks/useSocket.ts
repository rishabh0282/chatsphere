import { useEffect, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../features/messagesSlice';
import { setTyping, setOnline } from '../features/usersSlice';
import { RootState } from '../store/store';

export const useSocket = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();

  const socket: Socket | null = useMemo(() => {
    if (!token) return null;
    return io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token }
    });
  }, [token]);

  useEffect(() => {
    if (!socket) return;

    socket.on('message:new', (message) => dispatch(addMessage(message)));
    socket.on('typing:start', ({ userId, channelId }) =>
      dispatch(setTyping({ channelId, users: [userId] }))
    );
    socket.on('typing:stop', ({ channelId }) => dispatch(setTyping({ channelId, users: [] })));
    socket.on('user:online', ({ userId }) => dispatch(setOnline([userId])));
    socket.on('user:offline', ({ userId }) =>
      dispatch(setOnline((prev) => prev.filter((id: string) => id !== userId)) as any)
    );

    return () => {
      socket.disconnect();
    };
  }, [socket, dispatch]);

  return socket;
};

