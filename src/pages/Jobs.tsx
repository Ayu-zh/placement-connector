
import { useState, useEffect } from 'react';
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
  Check,
  X,
  Send,
} from 'lucide-react';
import { ApiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { JobApplication } from '@/types/backend';
import { useToast } from '@/hooks/use-toast';

const Jobs = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingJobs, setUpcomingJobs] = useState([
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
  ]);

  const [appliedJobs, setAppliedJobs] = useState<JobApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applyingToJob, setApplyingToJob] = useState<number | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Fetch upcoming jobs
        const jobs = await ApiService.jobs.getAll();
        setUpcomingJobs(jobs);

        // Fetch applied jobs if user is logged in
        if (user && user.id) {
          const applications = await ApiService.jobApplications.getByStudent(user.id);
          setAppliedJobs(applications);
        }
      } catch (error) {
        console.error('Error loading jobs data:', error);
        toast({
          title: "Error",
          description: "Failed to load jobs data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, toast]);

  const handleApplyNow = async (job) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply for this job",
        variant: "destructive",
      });
      return;
    }

    try {
      setApplyingToJob(job.id);
      
      const application = {
        jobId: job.id,
        studentId: user.id,
        status: 'pending' as const,
        studentName: user.name,
        jobTitle: job.title,
        company: job.company
      };
      
      await ApiService.jobApplications.apply(application);
      
      // Refresh the applied jobs list
      const updatedApplications = await ApiService.jobApplications.getByStudent(user.id);
      setAppliedJobs(updatedApplications);
      
      toast({
        title: "Application Submitted",
        description: "Your application for this job has been sent to the admin for approval",
        variant: "default",
      });
      
      setActiveTab('applied');
    } catch (error) {
      console.error('Error applying for job:', error);
      toast({
        title: "Application Failed",
        description: "Failed to apply for this job",
        variant: "destructive",
      });
    } finally {
      setApplyingToJob(null);
    }
  };

  const isAlreadyApplied = (jobId) => {
    return appliedJobs.some(job => job.jobId === jobId);
  };

  return (
    <div className="space-y-6">
      <div className="text-left">
        <h1 className="text-3xl font-bold tracking-tight">Job Opportunities</h1>
        <p className="text-zinc-500">
          Browse and apply for available positions
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-4" value={activeTab} onValueChange={setActiveTab}>
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
                  <Button 
                    onClick={() => handleApplyNow(job)} 
                    disabled={isAlreadyApplied(job.id) || applyingToJob === job.id}
                  >
                    {isAlreadyApplied(job.id) ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Applied
                      </>
                    ) : applyingToJob === job.id ? (
                      "Applying..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Apply Now
                      </>
                    )}
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
          {isLoading ? (
            <div className="text-center py-4">Loading applied jobs...</div>
          ) : appliedJobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              You haven't applied to any jobs yet.
            </div>
          ) : (
            appliedJobs.map((job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 text-left">
                      <CardTitle className="text-xl">{job.jobTitle}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          {job.company}
                        </div>
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {job.status === "approved" ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : job.status === "rejected" ? (
                        <X className="h-5 w-5 text-red-500" />
                      ) : (
                        <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                      )}
                      <span className="text-sm font-medium capitalize">{job.status}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-left">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          Applied: {job.appliedDate}
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 text-sm text-muted-foreground">
                      {job.status === "pending" && "Your application is waiting for admin approval."}
                      {job.status === "approved" && "Congratulations! Your application has been approved."}
                      {job.status === "rejected" && "Sorry, your application was not selected at this time."}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Jobs;
