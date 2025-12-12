import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface TypingIndicatorProps {
  channelId: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ channelId }) => {
  const typingUsers = useSelector(
    (state: RootState) => {
      const channelTyping = state.users.typing[channelId] || [];
      return channelTyping
        .map((userId) => {
          const user = state.users.list.find((u) => u.id === userId);
          return user?.username;
        })
        .filter(Boolean) as string[];
    },
    shallowEqual
  );

  if (typingUsers.length === 0) return null;

  const message =
    typingUsers.length === 1
      ? `${typingUsers[0]} is typing...`
      : `${typingUsers.slice(0, 2).join(', ')}${typingUsers.length > 2 ? ' and others' : ''} are typing...`;

  return (
    <div className="px-4 py-2 text-sm text-gray-500 italic">
      <span className="inline-flex items-center space-x-1">
        <span className="flex space-x-1">
          <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </span>
        <span>{message}</span>
      </span>
    </div>
  );
};

