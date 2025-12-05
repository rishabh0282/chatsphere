import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMessages } from '../../features/messagesSlice';
import { RootState } from '../../store/store';
import MessageItem from './MessageItem';
import { Message } from '../../types';

interface Props {
  channelId: string;
}

const MessageList = ({ channelId }: Props) => {
  const dispatch = useDispatch();
  const messages = useSelector((state: RootState) => state.messages.byChannel[channelId] || []);

  useEffect(() => {
    const load = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/channels/${channelId}/messages`,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` } }
      );
      if (res.ok) {
        const data: Message[] = await res.json();
        dispatch(setMessages({ channelId, messages: data.reverse() }));
      }
    };
    load();
  }, [channelId, dispatch]);

  return (
    <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #eee', padding: 8, marginBottom: 8 }}>
      {messages.map((m) => (
        <MessageItem key={m.id} message={m} />
      ))}
    </div>
  );
};

export default MessageList;

