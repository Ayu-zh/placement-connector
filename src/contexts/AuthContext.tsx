
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AdminCredentials } from '@/types/auth';
import { ApiService } from '@/services/api';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (name: string, email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Key for storing user data in localStorage
const AUTH_STORAGE_KEY = 'placement_portal_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  // Load user from localStorage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  }, []);

  // Update localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // Use API service for student login
    const user = await ApiService.studentLogin(email, password);
    
    if (user) {
      setUser(user);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    // Use API service for admin login
    const adminUser = await ApiService.adminLogin({ email, password });
    
    if (adminUser) {
      setUser(adminUser);
      return true;
    }
    
    return false;
  };

  const updateUserProfile = (name: string, email: string) => {
    if (user) {
      setUser({
        ...user,
        name,
        email
      });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, adminLogin, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
