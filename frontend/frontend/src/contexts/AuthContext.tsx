import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types/user';

// Dummy axios instance replacement
const dummyAxiosInstance = {
  defaults: {
    headers: {
      common: {} as Record<string, string>
    }
  },
  post: async () => ({
    data: {
      access_token: 'dummy-token',
      user: { id: '1', name: 'Demo User', email: 'user@example.com', role: 'user' as const }
    }
  })
};

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      dummyAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      // TODO: Fetch user data if needed
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await dummyAxiosInstance.post();
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      dummyAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await dummyAxiosInstance.post();
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      dummyAxiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete dummyAxiosInstance.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}