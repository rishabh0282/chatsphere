import React from 'react';
import { format, isToday, isYesterday } from 'date-fns';
import { Message } from '../../types';
import { Avatar } from '../common/Avatar';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface MessageItemProps {
  message: Message;
  showAvatar?: boolean;
  showDate?: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({
  message,
  showAvatar = true,
  showDate = false,
}) => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const isOwn = message.senderId === currentUser?.id;

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM dd, yyyy');
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    return format(new Date(dateString), 'HH:mm');
  };

  return (
    <div className={`flex space-x-3 px-4 py-2 hover:bg-gray-50 ${isOwn ? 'bg-blue-50' : ''}`}>
      {showAvatar && (
        <Avatar
          src={message.sender?.avatar}
          alt={message.sender?.username || message.senderId}
          size="sm"
        />
      )}
      <div className="flex-1 min-w-0">
        {showDate && message.createdAt && (
          <div className="text-xs text-gray-500 mb-2">{formatDate(message.createdAt)}</div>
        )}
        <div className="flex items-baseline space-x-2">
          <span className="font-semibold text-gray-900">
            {message.sender?.username || message.senderId}
          </span>
          {message.createdAt && (
            <span className="text-xs text-gray-500">{formatTime(message.createdAt)}</span>
          )}
        </div>
        <div className="text-gray-900 mt-1 whitespace-pre-wrap break-words">
          {message.content}
        </div>
        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-2">
            {message.attachments.map((url, index) => {
              const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
              return isImage ? (
                <img
                  key={index}
                  src={url}
                  alt={`Attachment ${index + 1}`}
                  className="max-w-md rounded-lg cursor-pointer"
                  onClick={() => window.open(url, '_blank')}
                />
              ) : (
                <a
                  key={index}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-2 bg-gray-100 rounded hover:bg-gray-200"
                >
                  📎 {url.split('/').pop()}
                </a>
              );
            })}
          </div>
        )}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {message.reactions.map((reaction) => (
              <span
                key={reaction.id}
                className="px-2 py-1 bg-gray-100 rounded-full text-sm"
              >
                {reaction.emoji} {reaction.user?.username || reaction.userId}
              </span>
            ))}
          </div>
        )}
        {message.parentId && (
          <div className="mt-2 text-xs text-gray-500 italic">
            Replying to message
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem;

