import { useEffect, useRef } from 'react';
import { useSocket } from './useSocket';

export const useTyping = (channelId: string, enabled: boolean = true) => {
  const socket = useSocket();
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const emitTyping = () => {
    if (!socket || !enabled) return;

    socket.emit('typing', { channelId });
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing:stop', { channelId });
    }, 3000);
  };

  const stopTyping = () => {
    if (!socket || !enabled) return;
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    
    socket.emit('typing:stop', { channelId });
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      stopTyping();
    };
  }, [channelId, enabled]);

  return { emitTyping, stopTyping };
};

