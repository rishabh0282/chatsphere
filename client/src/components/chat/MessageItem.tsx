import { Message } from '../../types';

const MessageItem = ({ message }: { message: Message }) => {
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ fontWeight: 600 }}>{message.senderId}</div>
      <div>{message.content}</div>
    </div>
  );
};

export default MessageItem;

