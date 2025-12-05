import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ChatWindow from './components/chat/ChatWindow';
import ChannelList from './components/sidebar/ChannelList';

const App = () => {
  return (
    <Layout
      sidebar={<ChannelList />}
      content={
        <Routes>
          <Route path="/" element={<Navigate to="/channels" replace />} />
          <Route path="/channels/:id" element={<ChatWindow />} />
        </Routes>
      }
    />
  );
};

export default App;

