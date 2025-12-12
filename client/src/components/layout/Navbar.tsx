import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearAuth } from '../../features/authSlice';
import { RootState } from '../../store/store';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    dispatch(clearAuth());
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold text-gray-900">ChatSphere</h1>
      {user && (
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">
            {user.username}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            title="Logout"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;

