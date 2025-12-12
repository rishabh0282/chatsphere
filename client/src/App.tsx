import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ChatWindow from './components/chat/ChatWindow';
import { Sidebar } from './components/layout/Sidebar';
import { WelcomeScreen } from './components/chat/WelcomeScreen';

const App = () => {
  return (
    <Layout
      sidebar={<Sidebar />}
      content={
        <Routes>
          <Route path="/" element={<Navigate to="/channels" replace />} />
          <Route path="/channels" element={<WelcomeScreen />} />
          <Route path="/channels/:id" element={<ChatWindow />} />
        </Routes>
      }
    />
  );
};

export default App;

