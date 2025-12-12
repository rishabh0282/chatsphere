import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuth, clearAuth } from '../../features/authSlice';
import { authService } from '../../services/auth.service';

export const AuthInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      try {
        const user = await authService.getMe();
        dispatch(setAuth({ user, token }));
      } catch (error) {
        // Token is invalid, clear it
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        dispatch(clearAuth());
      }
    };

    initializeAuth();
  }, [dispatch]);

  return <>{children}</>;
};

