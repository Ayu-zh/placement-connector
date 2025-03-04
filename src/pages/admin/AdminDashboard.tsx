
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Navigate } from 'react-router-dom';
import { User, Users, Building, Briefcase, BarChart3, AlertCircle, Award } from 'lucide-react';
import { AdminJobManagement } from '@/components/admin/AdminJobManagement';
import { AdminStudentManagement } from '@/components/admin/AdminStudentManagement';
import { AdminStatistics } from '@/components/admin/AdminStatistics';
import { AdminCertificationManagement } from '@/components/admin/AdminCertificationManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Redirect to login if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin" replace />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-zinc-500">
          Manage placements, students, and statistics
        </p>
      </div>

      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full max-w-4xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,245</div>
                <p className="text-xs text-muted-foreground">
                  +10% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Registered Companies</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  +2 new since last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Job Postings</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">
                  +12 new since last month
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>
                Latest notifications requiring your attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-md border p-4">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium">New Company Registration</p>
                    <p className="text-sm text-muted-foreground">
                      Microsoft has requested to register for campus placements
                    </p>
                    <div className="mt-2">
                      <Button size="sm" variant="outline" className="mr-2">Review</Button>
                      <Button size="sm">Approve</Button>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 rounded-md border p-4">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Placement Deadline Approaching</p>
                    <p className="text-sm text-muted-foreground">
                      Google on-site interview deadline is tomorrow
                    </p>
                    <div className="mt-2">
                      <Button size="sm" variant="outline" className="mr-2">Send Reminder</Button>
                      <Button size="sm">View Details</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
        
        <TabsContent value="statistics">
          <AdminStatistics />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
