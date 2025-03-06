
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Briefcase,
  GraduationCap,
  Calendar,
  Code,
  FileText,
  Building,
  ExternalLink,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ApiService } from '@/services/api';
import { Hackathon, Job } from '@/types/backend';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { HackathonTeammates } from '@/components/hackathon/HackathonTeammates';

// Define types for stat items
interface StatItem {
  label: string;
  value: string | number;
  icon: React.FC<{ className?: string }>;
  description: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<StatItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Fetch hackathons
        const hackathonsData = await ApiService.hackathons.getAll();
        setHackathons(hackathonsData);
        
        // Fetch jobs
        const jobsData = await ApiService.jobs.getAll();
        setJobs(jobsData.slice(0, 3)); // Get top 3 jobs
        
        // Generate stats based on fetched data
        const statItems: StatItem[] = [
          {
            label: 'Available Jobs',
            value: jobsData.length,
            icon: Briefcase,
            description: `${jobsData.length > 0 ? jobsData.length : 'No'} jobs available now`,
          },
          {
            label: 'Skills Added',
            value: '8', // This would come from a user skills endpoint in a real app
            icon: GraduationCap,
            description: '2 certificates pending',
          },
          {
            label: 'Upcoming Interviews',
            value: '3', // This would come from a user interviews endpoint in a real app
            icon: Calendar,
            description: 'Next: Tomorrow 10 AM',
          },
          {
            label: 'Resume Score',
            value: '85%', // This would come from a resume scoring endpoint in a real app
            icon: FileText,
            description: 'Top 20% percentile',
          },
        ];
        
        setStats(statItems);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-zinc-500">
          Welcome back, {user?.name}
        </p>
      </div>

      <Tabs defaultValue="overview" onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-xl">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="hackathons">Hackathons</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 w-12 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {stat.label}
                      </CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {stat.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Upcoming Jobs */}
          <Card className="mt-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Upcoming Job Deadlines</CardTitle>
                  <CardDescription>Latest opportunities matching your profile</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/jobs">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0 animate-pulse"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                        <div>
                          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                          <div className="h-3 w-24 bg-gray-200 rounded"></div>
                        </div>
                      </div>
                      <div className="h-3 w-20 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  No upcoming job deadlines available.
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0"
                    >
                      <div className="flex items-center gap-4">
                        <Building className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <h3 className="font-semibold">{job.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {job.company} • {job.type}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Deadline: {job.deadline}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certifications">
          {/* Upcoming Certification Exams */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Upcoming Certification Exams</CardTitle>
                  <CardDescription>Enhance your qualifications</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a 
                    href="https://onlinecourses.nptel.ac.in/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center"
                  >
                    Schedule Exam <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* This section could be updated to use real certification data from the API */}
                {[
                  {
                    name: 'AWS Solutions Architect',
                    provider: 'Amazon Web Services',
                    date: '2024-04-10',
                    level: 'Associate',
                  },
                  {
                    name: 'Python Professional',
                    provider: 'Python Institute',
                    date: '2024-04-15',
                    level: 'Advanced',
                  },
                ].map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <GraduationCap className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold">{cert.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {cert.provider} • {cert.level}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Exam Date: {cert.date}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hackathons">
          {/* Upcoming Hackathons */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Upcoming Hackathons</CardTitle>
                  <CardDescription>Opportunities to showcase your skills</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-2">Loading hackathons...</div>
                ) : hackathons.length === 0 ? (
                  <div className="text-center py-2 text-muted-foreground">No upcoming hackathons available.</div>
                ) : (
                  hackathons.map((hackathon, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0"
                    >
                      <div className="flex items-center gap-4">
                        <Code className="h-8 w-8 text-muted-foreground" />
                        <div>
                          <h3 className="font-semibold">{hackathon.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {hackathon.mode} • {hackathon.participants} participants
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="text-sm text-muted-foreground">
                          Date: {hackathon.date}
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <a href={hackathon.registrationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center">
                            Register Now <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Hackathon Teammates */}
          <HackathonTeammates />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
