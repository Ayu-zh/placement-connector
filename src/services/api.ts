
import { SupabaseApiService } from './supabaseApi';
import { Job, Student, Certification, Hackathon, TeammateRequest, DashboardStats } from '@/types/backend';
import { User, AdminCredentials } from '@/types/auth';

// Initialize local storage if needed
const initializeDatabase = () => {
  // This function is kept for backward compatibility but doesn't do anything anymore
  // as we're now using Supabase for data storage
};

// Initialize database on module import (no-op now)
initializeDatabase();

// API Service
export const ApiService = {
  // Admin login
  adminLogin: async (credentials: AdminCredentials): Promise<User | null> => {
    try {
      const success = await SupabaseApiService.validatePassword(credentials.email, credentials.password);
      if (success) {
        // Return a mock admin user for backward compatibility
        return {
          id: 'admin-1',
          name: 'Admin User',
          email: credentials.email,
          role: 'admin',
          isVerified: true,
        };
      }
    } catch (error) {
      console.error('Admin login error:', error);
    }
    return null;
  },

  // Student login
  studentLogin: async (email: string, password: string): Promise<User | null> => {
    try {
      await SupabaseApiService.login(email, password);
      // The actual user will be set in the AuthContext via the onAuthStateChange listener
      return null;
    } catch (error) {
      console.error('Student login error:', error);
      return null;
    }
  },

  // Jobs API
  jobs: SupabaseApiService.jobs,

  // Students API
  students: SupabaseApiService.students,

  // Certifications API
  certifications: SupabaseApiService.certifications,

  // Hackathons API
  hackathons: SupabaseApiService.hackathons,
  
  // Password validation
  validatePassword: SupabaseApiService.validatePassword,
  
  // Dashboard Stats API
  dashboardStats: SupabaseApiService.dashboardStats,
  
  // Teammate Requests API
  teammateRequests: SupabaseApiService.teammateRequests
};
