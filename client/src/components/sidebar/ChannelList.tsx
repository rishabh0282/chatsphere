import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setActiveChannel, setChannels } from '../../features/channelsSlice';
import { RootState } from '../../store/store';
import { Channel } from '../../types';
import { ChannelItem } from './ChannelItem';
import { channelService } from '../../services/channel.service';

export const ChannelList = () => {
  const dispatch = useDispatch();
  const { id: activeChannelId } = useParams<{ id: string }>();
  const channels = useSelector((state: RootState) => state.channels.list);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await channelService.getChannels();
        dispatch(setChannels(data));
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [dispatch]);

  const filteredChannels = channels.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="px-2">
      <input
        type="text"
        placeholder="Search channels..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 mb-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="space-y-1">
        {filteredChannels.map((channel) => (
          <ChannelItem
            key={channel.id}
            channel={channel}
            isActive={channel.id === activeChannelId}
            onClick={() => dispatch(setActiveChannel(channel.id))}
          />
        ))}
      </div>
    </div>
  );
};


