import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { setActiveChannel, setChannels } from '../../features/channelsSlice';
import { RootState } from '../../store/store';
import { Channel } from '../../types';

const ChannelList = () => {
  const dispatch = useDispatch();
  const channels = useSelector((state: RootState) => state.channels.list);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/channels`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token') || ''}` }
        });
        if (res.ok) {
          const data: Channel[] = await res.json();
          dispatch(setChannels(data));
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [dispatch]);

  return (
    <div>
      <h3>Channels</h3>
      <ul>
        {channels.map((c) => (
          <li key={c.id}>
            <Link to={`/channels/${c.id}`} onClick={() => dispatch(setActiveChannel(c.id))}>
              #{c.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChannelList;

