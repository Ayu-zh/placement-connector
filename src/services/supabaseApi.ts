
import { supabase } from '@/integrations/supabase/client';
import { Job, Student, Certification, Hackathon, TeammateRequest, DashboardStats } from '@/types/backend';
import { User } from '@/types/auth';

export const SupabaseApiService = {
  // Dashboard statistics
  dashboardStats: {
    get: async (): Promise<DashboardStats> => {
      // Get dashboard stats from view
      const { data: statsData, error: statsError } = await supabase
        .from('dashboard_stats')
        .select('*')
        .single();
        
      if (statsError) {
        console.error('Error fetching dashboard stats:', statsError);
        throw statsError;
      }
      
      // Get department placements (mock data for now)
      const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil'];
      const departmentPlacements = departments.map(dept => ({
        department: dept,
        count: Math.floor(Math.random() * 40) + 10 // Random between 10-50
      }));
      
      // Get recent activities (mock data for now)
      const activities = [
        {
          id: 'act1',
          type: 'job' as const,
          title: 'New Job Posted',
          description: 'Google has posted a new Software Engineer position',
          date: '2024-03-25T09:45:00.000Z'
        },
        {
          id: 'act2',
          type: 'company' as const,
          title: 'New Company Registration',
          description: 'Microsoft has registered for campus placements',
          date: '2024-03-24T13:20:00.000Z'
        },
        {
          id: 'act3',
          type: 'student' as const,
          title: 'Student Verified',
          description: 'Neha Gupta has been verified',
          date: '2024-03-23T10:15:00.000Z'
        },
        {
          id: 'act4',
          type: 'placement' as const,
          title: 'Placement Offer',
          description: 'Rahul Sharma received an offer from Amazon',
          date: '2024-03-22T16:30:00.000Z'
        }
      ];
      
      return {
        ...statsData,
        departmentPlacements,
        recentActivities: activities
      };
    }
  },
  
  // Jobs API
  jobs: {
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
  },
  
  // Students API
  students: {
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
  },
  
  // Certifications API
  certifications: {
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
  },
  
  // Hackathons API
  hackathons: {
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
  },
  
  // Teammate Requests API
  teammateRequests: {
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
