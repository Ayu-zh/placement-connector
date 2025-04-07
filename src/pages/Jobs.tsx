
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Briefcase,
  Building,
  Mail,
  Calendar,
  User,
  Users,
  Link as LinkIcon,
  Check,
  X,
} from 'lucide-react';

const Jobs = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  const upcomingJobs = [
    {
      id: 1,
      title: "Software Engineer",
      company: "TechCorp",
      location: "Bangalore, India",
      type: "Full-time",
      salary: "₹12-15 LPA",
      deadline: "2024-03-25",
      requirements: [
        "B.Tech in Computer Science or related field",
        "Strong programming skills in Java/Python",
        "Knowledge of web technologies",
        "0-2 years of experience"
      ],
      applicationLink: "https://techcorp.com/careers",
      hrContact: {
        name: "Sarah Johnson",
        email: "sarah.j@techcorp.com",
        phone: "+91 9876543210"
      },
      alumniContact: {
        name: "Rahul Sharma",
        batch: "2022",
        email: "rahul.s@techcorp.com"
      }
    },
    {
      id: 2,
      title: "Data Analyst",
      company: "DataSys Inc",
      location: "Hyderabad, India",
      type: "Internship",
      salary: "₹40,000/month",
      deadline: "2024-03-28",
      requirements: [
        "Currently pursuing B.Tech",
        "Strong analytical skills",
        "Knowledge of SQL and Python",
        "Statistical analysis experience"
      ],
      applicationLink: "https://datasys.com/internships",
      hrContact: {
        name: "Priya Patel",
        email: "priya.p@datasys.com",
        phone: "+91 9876543211"
      },
      alumniContact: {
        name: "Ankit Kumar",
        batch: "2023",
        email: "ankit.k@datasys.com"
      }
    }
  ];

  const appliedJobs = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "WebTech Solutions",
      appliedDate: "2024-02-20",
      status: "Interview Scheduled",
      type: "Full-time",
      nextStep: "Technical Interview on March 25"
    },
    {
      id: 2,
      title: "Product Analyst",
      company: "Analytics Pro",
      appliedDate: "2024-02-15",
      status: "Application Under Review",
      type: "Full-time",
      nextStep: "Waiting for HR response"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-3xl font-bold tracking-tight">Job Opportunities</h1>
        <p className="text-zinc-500">
          Browse and apply for available positions
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList className="justify-start">
          <TabsTrigger value="upcoming">Upcoming Jobs</TabsTrigger>
          <TabsTrigger value="applied">Applied Jobs</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1 text-left">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {job.company} • {job.location}
                      </div>
                    </CardDescription>
                  </div>
                  <Button>
                    Apply Now
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Deadline: {job.deadline}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        Salary: {job.salary}
                      </div>
                      <div className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        <a href={job.applicationLink} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                          Application Link
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold">Requirements</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="text-sm text-muted-foreground">
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <User className="h-4 w-4" />
                        HR Contact
                      </h4>
                      <div className="text-sm text-muted-foreground text-left">
                        <p>{job.hrContact.name}</p>
                        <p className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {job.hrContact.email}
                        </p>
                        <p>{job.hrContact.phone}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Alumni Contact
                      </h4>
                      <div className="text-sm text-muted-foreground text-left">
                        <p>{job.alumniContact.name} ({job.alumniContact.batch})</p>
                        <p className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {job.alumniContact.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="applied" className="space-y-4">
          {appliedJobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1 text-left">
                    <CardTitle className="text-xl">{job.title}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {job.company}
                      </div>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {job.status === "Interview Scheduled" ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <X className="h-5 w-5 text-yellow-500" />
                    )}
                    <span className="text-sm font-medium">{job.status}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-left">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Briefcase className="h-4 w-4" />
                        {job.type}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Applied: {job.appliedDate}
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 text-sm text-muted-foreground">
                    Next Step: {job.nextStep}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Jobs;
