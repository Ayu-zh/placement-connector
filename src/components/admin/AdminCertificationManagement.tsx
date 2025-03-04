
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { ApiService } from '@/services/api';
import { Certification } from '@/types/backend';
import { Award, Plus, Pencil, Trash, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const AdminCertificationManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<Omit<Certification, 'id'>>({
    name: '',
    provider: '',
    description: '',
    skillsGained: [],
    duration: '',
    isActive: true
  });
  
  // Query certifications data
  const { data: certifications = [], isLoading } = useQuery({
    queryKey: ['certifications'],
    queryFn: ApiService.certifications.getAll
  });
  
  // Add certification mutation
  const addCertificationMutation = useMutation({
    mutationFn: ApiService.certifications.add,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      setIsAddDialogOpen(false);
      resetForm();
      toast({
        title: "Certification Added",
        description: "The certification has been added successfully",
      });
    }
  });
  
  // Update certification mutation
  const updateCertificationMutation = useMutation({
    mutationFn: ApiService.certifications.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      setIsEditDialogOpen(false);
      setSelectedCertification(null);
      resetForm();
      toast({
        title: "Certification Updated",
        description: "The certification has been updated successfully",
      });
    }
  });
  
  // Delete certification mutation
  const deleteCertificationMutation = useMutation({
    mutationFn: ApiService.certifications.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast({
        title: "Certification Deleted",
        description: "The certification has been deleted successfully",
      });
    }
  });
  
  // Toggle certification active status mutation
  const toggleActiveMutation = useMutation({
    mutationFn: ApiService.certifications.toggleActive,
    onSuccess: (updatedCert) => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      toast({
        title: updatedCert.isActive ? "Certification Activated" : "Certification Deactivated",
        description: `The certification has been ${updatedCert.isActive ? 'activated' : 'deactivated'} successfully`,
      });
    }
  });
  
  const resetForm = () => {
    setFormData({
      name: '',
      provider: '',
      description: '',
      skillsGained: [],
      duration: '',
      isActive: true
    });
  };
  
  const handleAddCertification = () => {
    addCertificationMutation.mutate(formData);
  };
  
  const handleUpdateCertification = () => {
    if (selectedCertification) {
      updateCertificationMutation.mutate({
        ...formData,
        id: selectedCertification.id
      });
    }
  };
  
  const handleDeleteCertification = (id: string) => {
    if (confirm('Are you sure you want to delete this certification?')) {
      deleteCertificationMutation.mutate(id);
    }
  };
  
  const handleToggleActive = (id: string) => {
    toggleActiveMutation.mutate(id);
  };
  
  const handleEditClick = (cert: Certification) => {
    setSelectedCertification(cert);
    setFormData({
      name: cert.name,
      provider: cert.provider,
      description: cert.description,
      skillsGained: cert.skillsGained,
      duration: cert.duration,
      isActive: cert.isActive
    });
    setIsEditDialogOpen(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'skillsGained') {
      setFormData({
        ...formData,
        skillsGained: value.split(',').map(skill => skill.trim())
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-bold">Certification Management</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="ml-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Certification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name">Name</label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  placeholder="e.g., AWS Certified Solutions Architect"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="provider">Provider</label>
                <Input 
                  id="provider" 
                  name="provider" 
                  value={formData.provider} 
                  onChange={handleInputChange} 
                  placeholder="e.g., Amazon Web Services"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description">Description</label>
                <Input 
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  placeholder="Describe the certification"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="skillsGained">Skills Gained (comma separated)</label>
                <Input 
                  id="skillsGained" 
                  name="skillsGained" 
                  value={formData.skillsGained.join(', ')} 
                  onChange={handleInputChange} 
                  placeholder="e.g., Cloud Architecture, Security, Networking"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="duration">Duration</label>
                <Input 
                  id="duration" 
                  name="duration" 
                  value={formData.duration} 
                  onChange={handleInputChange} 
                  placeholder="e.g., 3 months"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCertification}>Add Certification</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">Loading certifications...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certifications.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">No certifications found</TableCell>
                </TableRow>
              ) : (
                certifications.map((cert) => (
                  <TableRow key={cert.id}>
                    <TableCell className="font-medium">{cert.name}</TableCell>
                    <TableCell>{cert.provider}</TableCell>
                    <TableCell>{cert.duration}</TableCell>
                    <TableCell>
                      <Badge variant={cert.isActive ? "default" : "secondary"}>
                        {cert.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {cert.skillsGained.slice(0, 2).map((skill, index) => (
                          <Badge key={index} variant="outline" className="whitespace-nowrap">
                            {skill}
                          </Badge>
                        ))}
                        {cert.skillsGained.length > 2 && (
                          <Badge variant="outline">+{cert.skillsGained.length - 2}</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleActive(cert.id)}
                          title={cert.isActive ? "Deactivate" : "Activate"}
                        >
                          {cert.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(cert)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteCertification(cert.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
        
        {/* Edit Certification Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Certification</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-name">Name</label>
                <Input 
                  id="edit-name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-provider">Provider</label>
                <Input 
                  id="edit-provider" 
                  name="provider" 
                  value={formData.provider} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-description">Description</label>
                <Input 
                  id="edit-description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-skillsGained">Skills Gained (comma separated)</label>
                <Input 
                  id="edit-skillsGained" 
                  name="skillsGained" 
                  value={formData.skillsGained.join(', ')} 
                  onChange={handleInputChange} 
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-duration">Duration</label>
                <Input 
                  id="edit-duration" 
                  name="duration" 
                  value={formData.duration} 
                  onChange={handleInputChange} 
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleUpdateCertification}>Update Certification</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
