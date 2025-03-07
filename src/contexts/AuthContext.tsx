
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AdminCredentials } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (name: string, email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  
  // Initialize user from Supabase session on load
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        handleAuthChange(session);
      }
    );

    // Also check for existing session on first load
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      handleAuthChange(session);
    };
    
    initializeAuth();

    // Cleanup the subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAuthChange = async (session: Session | null) => {
    if (session?.user) {
      // First, get the user role from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setUser({
          id: session.user.id,
          name: profile.name,
          email: profile.email,
          role: profile.role,
          department: profile.department,
          isVerified: profile.verified,
        });
      } else {
        // If profile doesn't exist yet (race condition), set minimal user data
        setUser({
          id: session.user.id,
          name: session.user.user_metadata.name || 'User',
          email: session.user.email || '',
          role: 'student',
          isVerified: false,
        });
      }
    } else {
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      throw new Error(error.message);
    }
  };

  const adminLogin = async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return false;
    }
    
    // Check if user has admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('email', email)
      .single();
    
    if (profile && profile.role === 'admin') {
      return true;
    }
    
    // If not admin, log out and return false
    await supabase.auth.signOut();
    setUser(null);
    return false;
  };

  const updateUserProfile = async (name: string, email: string) => {
    if (user) {
      const { error } = await supabase
        .from('profiles')
        .update({ name, email, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      
      if (!error) {
        setUser({
          ...user,
          name,
          email
        });
      }
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
