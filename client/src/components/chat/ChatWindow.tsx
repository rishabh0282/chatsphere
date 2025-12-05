import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useSocket } from '../../hooks/useSocket';
import { useChat } from '../../hooks/useChat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { TypingIndicator } from '../common/TypingIndicator';
import { ChannelSettings } from '../channel/ChannelSettings';
import { MemberList } from '../channel/MemberList';
import { Cog6ToothIcon, UsersIcon } from '@heroicons/react/24/outline';
import { channelService } from '../../services/channel.service';
import { Channel } from '../../types';

const ChatWindow: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const socket = useSocket();
  const { messages, loading } = useChat(id || '');

  useEffect(() => {
    if (id) {
      socket?.emit('join:channel', { channelId: id });
      channelService.getChannel(id).then(setChannel).catch(console.error);

      return () => {
        socket?.emit('leave:channel', { channelId: id });
      };
    }
  }, [id, socket]);

  if (!id) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a channel to start chatting
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Channel Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold text-gray-900">
            #{channel?.name || 'Loading...'}
          </h2>
          {channel?.description && (
            <span className="text-sm text-gray-500">{channel.description}</span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="p-2 text-gray-500 hover:text-gray-700"
            title="Members"
          >
            <UsersIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-500 hover:text-gray-700"
            title="Channel Settings"
          >
            <Cog6ToothIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 flex flex-col overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading messages...</div>
            </div>
          ) : (
            <>
              <MessageList channelId={id} />
              <TypingIndicator channelId={id} />
            </>
          )}
          <MessageInput channelId={id} />
        </div>

        {/* Members Sidebar */}
        {showMembers && (
          <div className="w-64 border-l border-gray-200 bg-white">
            <MemberList channelId={id} canManage={true} />
          </div>
        )}
      </div>

      {/* Channel Settings Modal */}
      {showSettings && channel && (
        <ChannelSettings
          channel={channel}
          onClose={() => setShowSettings(false)}
          onUpdate={(updatedChannel) => {
            setChannel(updatedChannel);
            setShowSettings(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatWindow;

