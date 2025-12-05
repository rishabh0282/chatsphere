import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setUsers } from '../../features/usersSlice';
import { Avatar } from '../common/Avatar';
import { User } from '../../types';
import api from '../../services/api';

export const DirectMessageList: React.FC = () => {
  const dispatch = useDispatch();
  const users = useSelector((state: RootState) => state.users.list);
  const onlineUsers = useSelector((state: RootState) => state.users.online);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await api.get('/users');
        dispatch(setUsers(response.data));
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    };
    loadUsers();
  }, [dispatch]);

  return (
    <div className="px-2 py-2">
      <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        Direct Messages
      </h3>
      <div className="space-y-1">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer"
          >
            <Avatar
              src={user.avatar}
              alt={user.username}
              size="sm"
              online={onlineUsers.includes(user.id)}
            />
            <span className="text-sm text-gray-700 truncate">{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

