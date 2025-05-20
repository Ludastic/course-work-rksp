import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from './ui/Button';
import { MessageSquare, LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const { auth, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">ReviewHub</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Отзывы
            </Link>
            {auth.isAuthenticated && (
              <Link 
                to="/reviews/create" 
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Создать отзыв
              </Link>
            )}
          </nav>
          
          <div className="flex items-center">
            {auth.isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="text-sm font-medium text-gray-700 flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  <span>{auth.user?.username}</span>
                  {isAdmin() && (
                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                      Админ
                    </span>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Выйти
                </Button>
              </div>
            ) : (
              <div className="space-x-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Войти
                </Button>
                <Button 
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/register')}
                >
                  Регистрация
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile navigation */}
      <nav className="md:hidden px-4 py-3 border-t border-gray-200">
        <div className="flex space-x-4">
          <Link 
            to="/" 
            className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
          >
            Отзывы
          </Link>
          {auth.isAuthenticated && (
            <Link 
              to="/reviews/create" 
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
            >
              Создать отзыв
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;