import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState, User } from '../types/index';

interface AuthContextType {
  auth: AuthState;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string) => Promise<void>;
  isAdmin: () => boolean;
}

const defaultAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  token: null,
};

const API_URL = 'http://127.0.0.1:8080/api/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      return {
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        token: storedToken,
      };
    }
    
    return defaultAuthState;
  });

  useEffect(() => {
    console.log('Auth state changed:', auth);
    if (auth.token) {
      console.log('Storing token in localStorage:', auth.token);
      localStorage.setItem('authToken', auth.token);
      if (auth.user) {
        localStorage.setItem('user', JSON.stringify(auth.user));
      }
    } else {
      console.log('Removing token from localStorage');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }, [auth.token, auth.user]);

  const handleAuthResponse = async (response: Response) => {
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Authentication failed');
    }
    return response.json();
  };

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await handleAuthResponse(response);
      console.log('Login response:', data);
      
      if (!data.id || !data.token) {
        throw new Error('Invalid response format from server');
      }

      const authState = {
        user: {
          id: data.id,
          username: data.username,
          role: data.role
        },
        isAuthenticated: true,
        token: data.token,
      };

      console.log('Setting auth state:', authState);
      setAuth(authState);
      
      // Directly set localStorage here as well
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(authState.user));
      console.log('Token stored in localStorage:', localStorage.getItem('authToken'));
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setAuth(defaultAuthState);
  };

  const register = async (username: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await handleAuthResponse(response);
      console.log('Registration response:', data);
      
      if (!data.id || !data.token) {
        throw new Error('Invalid response format from server');
      }

      const authState = {
        user: {
          id: data.id,
          username: data.username,
          role: data.role
        },
        isAuthenticated: true,
        token: data.token,
      };

      console.log('Setting auth state:', authState);
      setAuth(authState);
      
      // Directly set localStorage here as well
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(authState.user));
      console.log('Token stored in localStorage:', localStorage.getItem('authToken'));
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const isAdmin = () => {
    return auth.user?.role === 'ROLE_ADMIN';
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout, register, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};