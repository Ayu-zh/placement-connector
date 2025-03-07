
import { supabase } from '@/integrations/supabase/client';

export const authService = {
  // Authentication
  login: async (email: string, password: string): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    return !error;
  },
  
  // Password validation
  validatePassword: async (userId: string, password: string): Promise<boolean> => {
    // Get the user's email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .single();
      
    if (profileError) {
      console.error('Error fetching user email:', profileError);
      return false;
    }
    
    // Try to sign in with the provided credentials
    const { error } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password: password
    });
    
    // If no error, the password is valid
    return !error;
  }
};
