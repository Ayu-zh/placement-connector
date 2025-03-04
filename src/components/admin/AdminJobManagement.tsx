import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';
import { Job } from '@/types/backend';
import { Textarea } from '@/components/ui/textarea';

export function AdminJobManagement() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [tempJob, setTempJob] = useState<Partial<Job>>({});

  // Load jobs from API
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setIsLoading(true);
        const data = await ApiService.jobs.getAll();
        setJobs(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load jobs",
          variant: "destructive",
        });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadJobs();
  }, []);

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

  const handleDeleteJob = async (id: number) => {
    try {
      await ApiService.jobs.delete(id);
      setJobs(jobs.filter(job => job.id !== id));
      toast({
        title: "Job Deleted",
        description: "The job has been successfully removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
      console.error(error);
    }
  };

  const handleSaveJob = async () => {
    if (!tempJob.title || !tempJob.company) {
      toast({
        title: "Error",
        description: "Title and company are required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (currentJob) {
        // Edit existing job
        const updatedJob = await ApiService.jobs.update({ ...currentJob, ...tempJob as Job });
        setJobs(jobs.map(job => job.id === currentJob.id ? updatedJob : job));
        toast({
          title: "Job Updated",
          description: "The job has been successfully updated.",
        });
      } else {
        // Add new job
        const newJob = await ApiService.jobs.add(tempJob as Omit<Job, 'id'>);
        setJobs([...jobs, newJob]);
        toast({
          title: "Job Added",
          description: "The new job has been successfully added.",
        });
      }
      
      setEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save job",
        variant: "destructive",
      });
      console.error(error);
    }
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
          {isLoading ? (
            <div className="text-center py-4">Loading jobs...</div>
          ) : (
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
          )}
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
