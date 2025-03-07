
import { supabase } from '@/integrations/supabase/client';
import { Job } from '@/types/backend';

export const jobsService = {
  getAll: async (): Promise<Job[]> => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
    
    return data.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      type: job.type,
      salary: job.salary,
      deadline: job.deadline
    }));
  },
  
  add: async (job: Omit<Job, 'id'>): Promise<Job> => {
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select('*')
      .single();
      
    if (error) {
      console.error('Error adding job:', error);
      throw error;
    }
    
    return {
      id: data.id,
      title: data.title,
      company: data.company,
      location: data.location,
      type: data.type,
      salary: data.salary,
      deadline: data.deadline
    };
  },
  
  update: async (job: Job): Promise<Job> => {
    const { data, error } = await supabase
      .from('jobs')
      .update({
        title: job.title,
        company: job.company,
        location: job.location,
        type: job.type,
        salary: job.salary,
        deadline: job.deadline
      })
      .eq('id', job.id)
      .select('*')
      .single();
      
    if (error) {
      console.error('Error updating job:', error);
      throw error;
    }
    
    return {
      id: data.id,
      title: data.title,
      company: data.company,
      location: data.location,
      type: data.type,
      salary: data.salary,
      deadline: data.deadline
    };
  },
  
  delete: async (id: number): Promise<void> => {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  }
};
