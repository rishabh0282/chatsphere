import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

export const WelcomeScreen: React.FC = () => {
  const channels = useSelector((state: RootState) => state.channels.list);

  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Welcome to ChatSphere
        </h2>
        <p className="text-gray-600 mb-6">
          {channels.length === 0
            ? "Get started by creating your first channel!"
            : "Select a channel from the sidebar to start chatting"}
        </p>
        {channels.length === 0 && (
          <p className="text-sm text-gray-500">
            Click the <span className="font-semibold">+</span> button next to "Channels" to create one
          </p>
        )}
      </div>
    </div>
  );
};

