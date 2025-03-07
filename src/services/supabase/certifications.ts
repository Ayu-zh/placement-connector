
import { supabase } from '@/integrations/supabase/client';
import { Certification } from '@/types/backend';

export const certificationsService = {
  getAll: async (): Promise<Certification[]> => {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching certifications:', error);
      throw error;
    }
    
    return data.map(cert => ({
      id: cert.id,
      name: cert.name,
      provider: cert.provider,
      description: cert.description,
      skillsGained: cert.skills_gained,
      duration: cert.duration,
      isActive: cert.is_active
    }));
  },
  
  add: async (certification: Omit<Certification, 'id'>): Promise<Certification> => {
    const { data, error } = await supabase
      .from('certifications')
      .insert({
        name: certification.name,
        provider: certification.provider,
        description: certification.description,
        skills_gained: certification.skillsGained,
        duration: certification.duration,
        is_active: certification.isActive
      })
      .select('*')
      .single();
      
    if (error) {
      console.error('Error adding certification:', error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      provider: data.provider,
      description: data.description,
      skillsGained: data.skills_gained,
      duration: data.duration,
      isActive: data.is_active
    };
  },
  
  update: async (certification: Certification): Promise<Certification> => {
    const { data, error } = await supabase
      .from('certifications')
      .update({
        name: certification.name,
        provider: certification.provider,
        description: certification.description,
        skills_gained: certification.skillsGained,
        duration: certification.duration,
        is_active: certification.isActive
      })
      .eq('id', certification.id)
      .select('*')
      .single();
      
    if (error) {
      console.error('Error updating certification:', error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      provider: data.provider,
      description: data.description,
      skillsGained: data.skills_gained,
      duration: data.duration,
      isActive: data.is_active
    };
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('certifications')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting certification:', error);
      throw error;
    }
  },
  
  toggleActive: async (id: string): Promise<Certification> => {
    // First get current active status
    const { data: currentCert, error: fetchError } = await supabase
      .from('certifications')
      .select('is_active')
      .eq('id', id)
      .single();
      
    if (fetchError) {
      console.error('Error fetching certification status:', fetchError);
      throw fetchError;
    }
    
    // Toggle active status
    const { data, error: updateError } = await supabase
      .from('certifications')
      .update({
        is_active: !currentCert.is_active
      })
      .eq('id', id)
      .select('*')
      .single();
      
    if (updateError) {
      console.error('Error toggling certification status:', updateError);
      throw updateError;
    }
    
    return {
      id: data.id,
      name: data.name,
      provider: data.provider,
      description: data.description,
      skillsGained: data.skills_gained,
      duration: data.duration,
      isActive: data.is_active
    };
  }
};
