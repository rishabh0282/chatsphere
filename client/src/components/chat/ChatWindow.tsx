import { useParams } from 'react-router-dom';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useSocket } from '../../hooks/useSocket';

const ChatWindow = () => {
  const { id } = useParams();
  useSocket();

  if (!id) return <div>Select a channel</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2>Channel {id}</h2>
      <MessageList channelId={id} />
      <MessageInput channelId={id} />
    </div>
  );
};

export default ChatWindow;

