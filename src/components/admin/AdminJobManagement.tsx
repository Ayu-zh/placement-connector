
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  deadline: string;
}

// Mock job data
const initialJobs: Job[] = [
  {
    id: 1,
    title: "Software Engineer",
    company: "TechCorp",
    location: "Bangalore, India",
    type: "Full-time",
    salary: "₹12-15 LPA",
    deadline: "2024-03-25",
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "DataSys Inc",
    location: "Hyderabad, India",
    type: "Internship",
    salary: "₹40,000/month",
    deadline: "2024-03-28",
  },
  {
    id: 3,
    title: "Frontend Developer",
    company: "WebTech Solutions",
    location: "Mumbai, India",
    type: "Full-time",
    salary: "₹10-12 LPA",
    deadline: "2024-04-10",
  },
  {
    id: 4,
    title: "Product Manager",
    company: "Innovation Labs",
    location: "Pune, India",
    type: "Full-time",
    salary: "₹18-22 LPA",
    deadline: "2024-04-15",
  },
];

export function AdminJobManagement() {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [tempJob, setTempJob] = useState<Partial<Job>>({});

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNewJob = () => {
    setCurrentJob(null);
    setTempJob({});
    setEditDialogOpen(true);
  };

  const handleEditJob = (job: Job) => {
    setCurrentJob(job);
    setTempJob({ ...job });
    setEditDialogOpen(true);
  };

  const handleDeleteJob = (id: number) => {
    setJobs(jobs.filter(job => job.id !== id));
    toast({
      title: "Job Deleted",
      description: "The job has been successfully removed.",
    });
  };

  const handleSaveJob = () => {
    if (!tempJob.title || !tempJob.company) {
      toast({
        title: "Error",
        description: "Title and company are required fields.",
        variant: "destructive",
      });
      return;
    }

    if (currentJob) {
      // Edit existing job
      setJobs(jobs.map(job => job.id === currentJob.id ? { ...job, ...tempJob as Job } : job));
      toast({
        title: "Job Updated",
        description: "The job has been successfully updated.",
      });
    } else {
      // Add new job
      const newJob: Job = {
        id: Math.max(0, ...jobs.map(j => j.id)) + 1,
        title: tempJob.title || '',
        company: tempJob.company || '',
        location: tempJob.location || '',
        type: tempJob.type || 'Full-time',
        salary: tempJob.salary || '',
        deadline: tempJob.deadline || '',
      };
      setJobs([...jobs, newJob]);
      toast({
        title: "Job Added",
        description: "The new job has been successfully added.",
      });
    }
    
    setEditDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Job Management</CardTitle>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search jobs..."
                className="w-full pl-8"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <Button onClick={handleAddNewJob}>
              <Plus className="mr-2 h-4 w-4" /> Add New Job
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Deadline</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.type}</TableCell>
                    <TableCell>{job.salary}</TableCell>
                    <TableCell>{job.deadline}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditJob(job)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No jobs found. Try a different search term or add a new job.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {currentJob ? `Edit Job: ${currentJob.title}` : 'Add New Job'}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for this job posting.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium leading-none">Job Title</label>
                <Input
                  id="title"
                  value={tempJob.title || ''}
                  onChange={(e) => setTempJob({ ...tempJob, title: e.target.value })}
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium leading-none">Company</label>
                <Input
                  id="company"
                  value={tempJob.company || ''}
                  onChange={(e) => setTempJob({ ...tempJob, company: e.target.value })}
                  placeholder="e.g. Google"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium leading-none">Job Type</label>
                <Input
                  id="type"
                  value={tempJob.type || ''}
                  onChange={(e) => setTempJob({ ...tempJob, type: e.target.value })}
                  placeholder="e.g. Full-time, Internship"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium leading-none">Location</label>
                <Input
                  id="location"
                  value={tempJob.location || ''}
                  onChange={(e) => setTempJob({ ...tempJob, location: e.target.value })}
                  placeholder="e.g. Bangalore, India"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="salary" className="text-sm font-medium leading-none">Salary</label>
                <Input
                  id="salary"
                  value={tempJob.salary || ''}
                  onChange={(e) => setTempJob({ ...tempJob, salary: e.target.value })}
                  placeholder="e.g. ₹12-15 LPA"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="deadline" className="text-sm font-medium leading-none">Application Deadline</label>
                <Input
                  id="deadline"
                  type="date"
                  value={tempJob.deadline || ''}
                  onChange={(e) => setTempJob({ ...tempJob, deadline: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveJob}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
