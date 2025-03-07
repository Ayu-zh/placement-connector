
import { supabase } from '@/integrations/supabase/client';
import { authService } from './auth';
import { dashboardService } from './dashboard';
import { jobsService } from './jobs';
import { studentsService } from './students';
import { certificationsService } from './certifications';
import { hackathonsService } from './hackathons';
import { teammateRequestsService } from './teammateRequests';

// Combine all services into a single exported object
export const SupabaseApiService = {
  // Authentication
  login: authService.login,
  validatePassword: authService.validatePassword,
  
  // Dashboard Stats
  dashboardStats: dashboardService,
  
  // Entity services
  jobs: jobsService,
  students: studentsService,
  certifications: certificationsService,
  hackathons: hackathonsService,
  teammateRequests: teammateRequestsService
};

export { supabase };
