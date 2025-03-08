
import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AdminCredentials } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
  // Initialize user from Supabase session on load
  useEffect(() => {
    // Check for existing session on first load
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      await handleAuthChange(session);
    };
    
    initializeAuth();
    
    // Subscribe to auth changes for real-time synchronization across devices
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        // Handle sign-in and user updates
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          await handleAuthChange(session);
          
          // Only show toast for sign-in events, not initial session check
          if (event === 'SIGNED_IN') {
            toast({
              title: "Session Active",
              description: "Your session is active on this device",
            });
          }
        }
        
        // Handle sign-out
        if (event === 'SIGNED_OUT') {
          setUser(null);
          toast({
            title: "Signed Out",
            description: "You have been signed out from all devices",
          });
        }
      }
    );

    // Cleanup the subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const handleAuthChange = async (session: Session | null) => {
    if (session?.user) {
      try {
        // First, get the user role from profiles table
        const { data: profile, error: profileError } = await supabase
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
      } catch (error) {
        console.error('Error fetching user profile:', error);
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
    try {
      // First attempt to sign in
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error.message);
        return false;
      }
      
      // If successful login, check if user has admin role
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
        
        if (profileError) {
          console.error('Profile error:', profileError.message);
          // Sign out since we couldn't verify admin status
          await supabase.auth.signOut();
          return false;
        }
        
        // Check if the user has admin role
        if (profile && profile.role === 'admin') {
          return true;
        } else {
          console.error('User does not have admin role:', profile);
          // Sign out if not an admin
          await supabase.auth.signOut();
          return false;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Unexpected error during admin login:', error);
      return false;
    }
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
