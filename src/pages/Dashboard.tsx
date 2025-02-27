import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Briefcase,
  Trophy,
  GraduationCap,
  Calendar,
  Code,
  FileText,
  Building,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();

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

  const upcomingHackathons = [
    {
      name: 'CodeFest 2024',
      date: '2024-03-30',
      participants: '500+',
      mode: 'Hybrid',
    },
    {
      name: 'AI Innovate',
      date: '2024-04-05',
      participants: '300+',
      mode: 'Online',
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
      <Card>
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

      {/* Upcoming Hackathons */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Upcoming Hackathons</CardTitle>
              <CardDescription>Opportunities to showcase your skills</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Register Now
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingHackathons.map((hackathon, index) => (
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
                <div className="text-sm text-muted-foreground">
                  Date: {hackathon.date}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Certification Exams */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Upcoming Certification Exams</CardTitle>
              <CardDescription>Enhance your qualifications</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              Schedule Exam
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
    </div>
  );
};

export default Dashboard;
