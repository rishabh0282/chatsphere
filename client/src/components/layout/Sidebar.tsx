import React, { useState } from 'react';
import { ChannelList } from '../sidebar/ChannelList';
import { DirectMessageList } from '../sidebar/DirectMessageList';
import { UserList } from '../sidebar/UserList';
import { CreateChannel } from '../channel/CreateChannel';
import { PlusIcon } from '@heroicons/react/24/outline';

export const Sidebar: React.FC = () => {
  const [showCreateChannel, setShowCreateChannel] = useState(false);

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="p-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Channels
            </h2>
            <button
              onClick={() => setShowCreateChannel(true)}
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Create channel"
            >
              <PlusIcon className="h-5 w-5" />
            </button>
          </div>
          <ChannelList />
        </div>
        <DirectMessageList />
      </div>
      <div className="border-t border-gray-200">
        <UserList />
      </div>
      {showCreateChannel && (
        <CreateChannel onClose={() => setShowCreateChannel(false)} />
      )}
    </div>
  );
};

