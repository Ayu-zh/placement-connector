
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
import { Hackathon } from '@/types/backend';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { HackathonTeammates } from '@/components/hackathon/HackathonTeammates';

const Dashboard = () => {
  const { user } = useAuth();
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadHackathons = async () => {
      try {
        const data = await ApiService.hackathons.getAll();
        setHackathons(data);
      } catch (error) {
        console.error('Failed to load hackathons:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHackathons();
  }, []);

  const stats = [
    {
      label: 'Applied Jobs',
      value: '12',
      icon: Briefcase,
      description: '3 pending responses',
    },
    {
      label: 'Skills Added',
      value: '8',
      icon: GraduationCap,
      description: '2 certificates pending',
    },
    {
      label: 'Upcoming Interviews',
      value: '3',
      icon: Calendar,
      description: 'Next: Tomorrow 10 AM',
    },
    {
      label: 'Resume Score',
      value: '85%',
      icon: FileText,
      description: 'Top 20% percentile',
    },
  ];

  const upcomingJobs = [
    {
      company: 'TechCorp',
      position: 'Software Engineer',
      deadline: '2024-03-25',
      type: 'Full-time',
    },
    {
      company: 'DataSys Inc',
      position: 'Data Analyst',
      deadline: '2024-03-28',
      type: 'Internship',
    },
    {
      company: 'CloudScale',
      position: 'DevOps Engineer',
      deadline: '2024-04-01',
      type: 'Full-time',
    },
  ];

  const upcomingCertifications = [
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
  ];

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
              <div className="space-y-4">
                {upcomingJobs.map((job, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0"
                  >
                    <div className="flex items-center gap-4">
                      <Building className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <h3 className="font-semibold">{job.position}</h3>
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
                {upcomingCertifications.map((cert, index) => (
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
                          <a href="https://unstop.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
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
