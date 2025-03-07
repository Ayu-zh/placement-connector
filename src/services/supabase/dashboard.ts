
import { supabase } from '@/integrations/supabase/client';
import { DashboardStats } from '@/types/backend';

export const dashboardService = {
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
      totalStudents: statsData.total_students,
      activeStudents: statsData.active_students,
      registeredCompanies: statsData.registered_companies,
      activeJobs: statsData.active_jobs,
      totalPlacements: statsData.total_placements,
      placementRate: statsData.placement_rate,
      departmentPlacements,
      recentActivities: activities
    };
  }
};
