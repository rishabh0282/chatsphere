import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { setMessages, addMessage } from '../features/messagesSlice';
import api from '../services/api';
import { Message } from '../types';

export const useChat = (channelId: string) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const messages = useSelector(
    (state: RootState) => state.messages.byChannel[channelId] || []
  );

  const loadMessages = async (before?: string) => {
    try {
      const params = new URLSearchParams({ limit: '50' });
      if (before) params.append('before', before);

      const response = await api.get(`/channels/${channelId}/messages?${params}`);
      const newMessages: Message[] = response.data;

      if (before) {
        // Prepend older messages
        dispatch(setMessages({ channelId, messages: [...newMessages, ...messages] }));
      } else {
        // Initial load
        dispatch(setMessages({ channelId, messages: newMessages }));
      }

      setHasMore(newMessages.length === 50);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (messages.length > 0 && hasMore) {
      const oldestMessage = messages[0];
      loadMessages(oldestMessage.id);
    }
  };

  useEffect(() => {
    if (channelId) {
      setLoading(true);
      loadMessages();
    }
  }, [channelId]);

  return {
    messages,
    loading,
    hasMore,
    loadMore,
    refresh: () => loadMessages(),
  };
};

