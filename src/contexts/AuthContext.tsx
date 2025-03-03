
import { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, AdminCredentials } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock admin credentials
const ADMIN_CREDENTIALS: AdminCredentials = {
  email: 'admin@college.edu',
  password: 'admin123'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Mock login - replace with real authentication
    const mockUser: User = {
      id: '1',
      name: 'John Doe',
      email: email,
      role: 'student',
      department: 'Computer Science',
      isVerified: true,
    };
    setUser(mockUser);
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    // Check against mock admin credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      const adminUser: User = {
        id: 'admin-1',
        name: 'Admin User',
        email: email,
        role: 'admin',
        isVerified: true,
      };
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
