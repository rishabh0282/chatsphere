import React from 'react';
import { Link } from 'react-router-dom';
import { HashtagIcon } from '@heroicons/react/24/outline';
import { Channel } from '../../types';

interface ChannelItemProps {
  channel: Channel;
  isActive: boolean;
  unreadCount?: number;
  onClick?: () => void;
}

export const ChannelItem: React.FC<ChannelItemProps> = ({
  channel,
  isActive,
  unreadCount = 0,
  onClick,
}) => {
  return (
    <Link
      to={`/channels/${channel.id}`}
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-2 rounded-md transition-colors ${
        isActive
          ? 'bg-blue-100 text-blue-700'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center space-x-2 flex-1 min-w-0">
        <HashtagIcon className="h-5 w-5 flex-shrink-0" />
        <span className="truncate">{channel.name}</span>
      </div>
      {unreadCount > 0 && (
        <span className="ml-2 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

