import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/layout/Layout';
import ChatWindow from './components/chat/ChatWindow';
import { Sidebar } from './components/layout/Sidebar';
import { WelcomeScreen } from './components/chat/WelcomeScreen';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RootState } from './store/store';

const App = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/channels" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/channels" replace /> : <Register />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
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
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;

