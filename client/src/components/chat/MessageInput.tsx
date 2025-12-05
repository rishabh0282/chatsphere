import { FormEvent, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMessage } from '../../features/messagesSlice';
import { RootState } from '../../store/store';
import { useSocket } from '../../hooks/useSocket';

interface Props {
  channelId: string;
}

const MessageInput = ({ channelId }: Props) => {
  const [text, setText] = useState('');
  const socket = useSocket();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !user) return;
    const payload = {
      id: crypto.randomUUID(),
      content: text,
      channelId,
      senderId: user.id,
      createdAt: new Date().toISOString()
    };
    dispatch(addMessage(payload));
    socket?.emit('message:send', payload);
    setText('');
  };

  return (
    <form onSubmit={send} style={{ display: 'flex', gap: 8 }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Message..."
        style={{ flex: 1, padding: 8 }}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageInput;

