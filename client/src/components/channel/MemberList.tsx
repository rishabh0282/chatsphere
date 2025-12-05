import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Avatar } from '../common/Avatar';
import { User } from '../../types';
import api from '../../services/api';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface MemberListProps {
  channelId: string;
  canManage?: boolean;
}

export const MemberList: React.FC<MemberListProps> = ({ channelId, canManage = false }) => {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const onlineUsers = useSelector((state: RootState) => state.users.online);
  const currentUser = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await api.get(`/channels/${channelId}/members`);
        setMembers(response.data);
      } catch (error) {
        console.error('Failed to load members:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMembers();
  }, [channelId]);

  const handleRemoveMember = async (userId: string) => {
    if (!confirm('Remove this member from the channel?')) return;

    try {
      await api.delete(`/channels/${channelId}/members/${userId}`);
      setMembers(members.filter((m) => m.id !== userId));
    } catch (error: any) {
      console.error('Failed to remove member:', error);
      alert(error.response?.data?.error || 'Failed to remove member');
    }
  };

  if (loading) {
    return <div className="p-4 text-gray-500">Loading members...</div>;
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Members ({members.length})</h3>
      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-100"
          >
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <Avatar
                src={member.avatar}
                alt={member.username}
                size="sm"
                online={onlineUsers.includes(member.id)}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {member.username}
                  {member.id === currentUser?.id && (
                    <span className="ml-2 text-xs text-gray-500">(You)</span>
                  )}
                </div>
                {member.status && (
                  <div className="text-xs text-gray-500">{member.status}</div>
                )}
              </div>
            </div>
            {canManage && member.id !== currentUser?.id && (
              <button
                onClick={() => handleRemoveMember(member.id)}
                className="p-1 text-gray-400 hover:text-red-600"
                title="Remove member"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

