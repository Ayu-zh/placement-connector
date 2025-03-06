
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Navigate } from 'react-router-dom';
import { User, Users, Building, Briefcase, BarChart3, AlertCircle, Award, Code } from 'lucide-react';
import { AdminJobManagement } from '@/components/admin/AdminJobManagement';
import { AdminStudentManagement } from '@/components/admin/AdminStudentManagement';
import { AdminStatistics } from '@/components/admin/AdminStatistics';
import { AdminCertificationManagement } from '@/components/admin/AdminCertificationManagement';
import AdminHackathonManagement from '@/components/admin/AdminHackathonManagement';
import { DashboardStats } from '@/types/backend';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Redirect to login if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin" replace />;
  }

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const dashboardStats = await ApiService.dashboardStats.get();
        setStats(dashboardStats);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics",
          variant: "destructive",
        });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadStats();
  }, [toast]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-zinc-500">
          Manage placements, students, and statistics
        </p>
      </div>

      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full max-w-5xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          {isLoading ? (
            <div className="text-center py-8">Loading dashboard statistics...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      {stats?.activeStudents || 0} active students
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Registered Companies</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.registeredCompanies || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Participating in campus placements
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Job Postings</CardTitle>
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.activeJobs || 0}</div>
                    <p className="text-xs text-muted-foreground">
                      Open for applications
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Recent Alerts</CardTitle>
                  <CardDescription>
                    Latest notifications requiring your attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.recentActivities && stats.recentActivities.length > 0 ? (
                      stats.recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between gap-4 rounded-md border p-4">
                          <div className="flex items-start gap-4">
                            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                            <div>
                              <p className="font-medium">{activity.title}</p>
                              <p className="text-sm text-muted-foreground">
                                {activity.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Details</Button>
                            <Button size="sm">Action</Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4">No recent activities</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="jobs">
          <AdminJobManagement />
        </TabsContent>
        
        <TabsContent value="students">
          <AdminStudentManagement />
        </TabsContent>
        
        <TabsContent value="certifications">
          <AdminCertificationManagement />
        </TabsContent>
        
        <TabsContent value="hackathons">
          <AdminHackathonManagement />
        </TabsContent>
        
        <TabsContent value="statistics">
          <AdminStatistics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
