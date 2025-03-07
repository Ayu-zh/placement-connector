
import { supabase } from '@/integrations/supabase/client';
import { Student } from '@/types/backend';

export const studentsService = {
  getAll: async (): Promise<Student[]> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student');
      
    if (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
    
    return data.map(profile => ({
      id: profile.id,
      name: profile.name,
      email: profile.email,
      department: profile.department || '',
      year: profile.year || '',
      status: profile.status as 'active' | 'inactive' | 'suspended',
      verified: profile.verified
    }));
  },
  
  add: async (student: Omit<Student, 'id'>, password: string): Promise<Student> => {
    // First, create the auth user
    const { data: userData, error: userError } = await supabase.auth.signUp({
      email: student.email,
      password: password,
      options: {
        data: {
          name: student.name,
          role: 'student'
        }
      }
    });
    
    if (userError) {
      console.error('Error creating student user:', userError);
      throw userError;
    }
    
    // The profile will be created by the trigger, but we need to update additional fields
    if (userData.user) {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .update({
          department: student.department,
          year: student.year,
          status: student.status,
          verified: student.verified
        })
        .eq('id', userData.user.id)
        .select('*')
        .single();
        
      if (profileError) {
        console.error('Error updating student profile:', profileError);
        throw profileError;
      }
      
      return {
        id: profileData.id,
        name: profileData.name,
        email: profileData.email,
        department: profileData.department || '',
        year: profileData.year || '',
        status: profileData.status as 'active' | 'inactive' | 'suspended',
        verified: profileData.verified
      };
    }
    
    throw new Error('Failed to create student account');
  },
  
  update: async (student: Student, password?: string): Promise<Student> => {
    // Update profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update({
        name: student.name,
        email: student.email,
        department: student.department,
        year: student.year,
        status: student.status,
        verified: student.verified,
        updated_at: new Date().toISOString()
      })
      .eq('id', student.id)
      .select('*')
      .single();
      
    if (profileError) {
      console.error('Error updating student profile:', profileError);
      throw profileError;
    }
    
    // Update password if provided
    if (password) {
      const { error: passwordError } = await supabase.auth.admin.updateUserById(
        student.id,
        { password }
      );
      
      if (passwordError) {
        console.error('Error updating student password:', passwordError);
        throw passwordError;
      }
    }
    
    return {
      id: profileData.id,
      name: profileData.name,
      email: profileData.email,
      department: profileData.department || '',
      year: profileData.year || '',
      status: profileData.status as 'active' | 'inactive' | 'suspended',
      verified: profileData.verified
    };
  },
  
  delete: async (id: string): Promise<void> => {
    // This will cascade delete the profile thanks to our foreign key
    const { error } = await supabase.auth.admin.deleteUser(id);
      
    if (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  },
  
  toggleVerification: async (id: string): Promise<Student> => {
    // First get current verification status
    const { data: currentProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('verified')
      .eq('id', id)
      .single();
      
    if (fetchError) {
      console.error('Error fetching student verification status:', fetchError);
      throw fetchError;
    }
    
    // Toggle verification status
    const { data: profileData, error: updateError } = await supabase
      .from('profiles')
      .update({
        verified: !currentProfile.verified,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();
      
    if (updateError) {
      console.error('Error toggling student verification:', updateError);
      throw updateError;
    }
    
    return {
      id: profileData.id,
      name: profileData.name,
      email: profileData.email,
      department: profileData.department || '',
      year: profileData.year || '',
      status: profileData.status as 'active' | 'inactive' | 'suspended',
      verified: profileData.verified
    };
  }
};
