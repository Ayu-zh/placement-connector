
import { supabase } from '@/integrations/supabase/client';
import { TeammateRequest } from '@/types/backend';

export const teammateRequestsService = {
  getAll: async (): Promise<TeammateRequest[]> => {
    const { data, error } = await supabase
      .from('teammate_requests')
      .select(`
        *,
        posted_by:profiles(id, name, department, year)
      `)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching teammate requests:', error);
      throw error;
    }
    
    return data.map(req => ({
      id: req.id,
      hackathonName: req.hackathon_name,
      skills: req.skills,
      description: req.description,
      contactInfo: req.contact_info,
      postedBy: {
        id: req.posted_by.id,
        name: req.posted_by.name,
        department: req.posted_by.department || '',
        year: req.posted_by.year || ''
      },
      createdAt: req.created_at
    }));
  },
  
  getByHackathon: async (hackathonName: string): Promise<TeammateRequest[]> => {
    const { data, error } = await supabase
      .from('teammate_requests')
      .select(`
        *,
        posted_by:profiles(id, name, department, year)
      `)
      .eq('hackathon_name', hackathonName)
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching teammate requests by hackathon:', error);
      throw error;
    }
    
    return data.map(req => ({
      id: req.id,
      hackathonName: req.hackathon_name,
      skills: req.skills,
      description: req.description,
      contactInfo: req.contact_info,
      postedBy: {
        id: req.posted_by.id,
        name: req.posted_by.name,
        department: req.posted_by.department || '',
        year: req.posted_by.year || ''
      },
      createdAt: req.created_at
    }));
  },
  
  add: async (request: Omit<TeammateRequest, 'id' | 'createdAt'>): Promise<TeammateRequest> => {
    const { data, error } = await supabase
      .from('teammate_requests')
      .insert({
        hackathon_name: request.hackathonName,
        skills: request.skills,
        description: request.description,
        contact_info: request.contactInfo,
        posted_by: request.postedBy.id
      })
      .select(`
        *,
        posted_by:profiles(id, name, department, year)
      `)
      .single();
      
    if (error) {
      console.error('Error adding teammate request:', error);
      throw error;
    }
    
    return {
      id: data.id,
      hackathonName: data.hackathon_name,
      skills: data.skills,
      description: data.description,
      contactInfo: data.contact_info,
      postedBy: {
        id: data.posted_by.id,
        name: data.posted_by.name,
        department: data.posted_by.department || '',
        year: data.posted_by.year || ''
      },
      createdAt: data.created_at
    };
  },
  
  update: async (request: TeammateRequest): Promise<TeammateRequest> => {
    const { data, error } = await supabase
      .from('teammate_requests')
      .update({
        hackathon_name: request.hackathonName,
        skills: request.skills,
        description: request.description,
        contact_info: request.contactInfo
      })
      .eq('id', request.id)
      .select(`
        *,
        posted_by:profiles(id, name, department, year)
      `)
      .single();
      
    if (error) {
      console.error('Error updating teammate request:', error);
      throw error;
    }
    
    return {
      id: data.id,
      hackathonName: data.hackathon_name,
      skills: data.skills,
      description: data.description,
      contactInfo: data.contact_info,
      postedBy: {
        id: data.posted_by.id,
        name: data.posted_by.name,
        department: data.posted_by.department || '',
        year: data.posted_by.year || ''
      },
      createdAt: data.created_at
    };
  },
  
  delete: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('teammate_requests')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting teammate request:', error);
      throw error;
    }
  }
};
