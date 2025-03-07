
import { supabase } from '@/integrations/supabase/client';
import { Hackathon } from '@/types/backend';

export const hackathonsService = {
  getAll: async (): Promise<Hackathon[]> => {
    const { data, error } = await supabase
      .from('hackathons')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching hackathons:', error);
      throw error;
    }
    
    return data.map(hack => ({
      id: hack.id,
      name: hack.name,
      date: hack.date,
      participants: hack.participants,
      mode: hack.mode as 'Online' | 'Offline' | 'Hybrid',
      registrationUrl: hack.registration_url
    }));
  },
  
  add: async (hackathon: Omit<Hackathon, 'id'>): Promise<Hackathon> => {
    const { data, error } = await supabase
      .from('hackathons')
      .insert({
        name: hackathon.name,
        date: hackathon.date,
        participants: hackathon.participants,
        mode: hackathon.mode,
        registration_url: hackathon.registrationUrl
      })
      .select('*')
      .single();
      
    if (error) {
      console.error('Error adding hackathon:', error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      date: data.date,
      participants: data.participants,
      mode: data.mode as 'Online' | 'Offline' | 'Hybrid',
      registrationUrl: data.registration_url
    };
  },
  
  update: async (hackathon: Hackathon): Promise<Hackathon> => {
    const { data, error } = await supabase
      .from('hackathons')
      .update({
        name: hackathon.name,
        date: hackathon.date,
        participants: hackathon.participants,
        mode: hackathon.mode,
        registration_url: hackathon.registrationUrl
      })
      .eq('id', hackathon.id)
      .select('*')
      .single();
      
    if (error) {
      console.error('Error updating hackathon:', error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      date: data.date,
      participants: data.participants,
      mode: data.mode as 'Online' | 'Offline' | 'Hybrid',
      registrationUrl: data.registration_url
    };
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('hackathons')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting hackathon:', error);
      throw error;
    }
  }
};
