
import { createContext, useContext, useState, ReactNode } from 'react';
import { User, AdminCredentials } from '@/types/auth';
import { ApiService } from '@/services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

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

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, adminLogin, logout }}>
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
