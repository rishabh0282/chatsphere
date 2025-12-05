import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Avatar } from '../common/Avatar';

interface UserListProps {
  channelId?: string;
}

export const UserList: React.FC<UserListProps> = ({ channelId }) => {
  const users = useSelector((state: RootState) => state.users.list);
  const onlineUsers = useSelector((state: RootState) => state.users.online);

  // Filter users by channel if channelId is provided
  const displayUsers = channelId
    ? users // TODO: Filter by channel members
    : users;

  return (
    <div className="px-2 py-2">
      <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Members
      </h3>
      <div className="space-y-1">
        {displayUsers.map((user) => (
          <div
            key={user.id}
            className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100"
          >
            <Avatar
              src={user.avatar}
              alt={user.username}
              size="sm"
              online={onlineUsers.includes(user.id)}
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {user.username}
              </div>
              {user.status && (
                <div className="text-xs text-gray-500">{user.status}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

