
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Hackathon } from '@/types/backend';
import { ApiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { Edit, Trash, Plus, ExternalLink, Check, X } from 'lucide-react';

export const AdminHackathonManagement = () => {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [newHackathon, setNewHackathon] = useState<Omit<Hackathon, 'id'>>({
    name: '',
    date: '',
    participants: '',
    mode: 'Online',
    registrationUrl: 'https://unstop.com/'
  });
  
  useEffect(() => {
    loadHackathons();
  }, []);
  
  const loadHackathons = async () => {
    setLoading(true);
    try {
      const data = await ApiService.hackathons.getAll();
      setHackathons(data);
    } catch (error) {
      console.error('Failed to load hackathons:', error);
      toast({
        title: 'Error',
        description: 'Failed to load hackathons. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddNew = async () => {
    if (!newHackathon.name || !newHackathon.date || !newHackathon.registrationUrl) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      await ApiService.hackathons.add(newHackathon);
      toast({
        title: 'Success',
        description: 'Hackathon added successfully!'
      });
      setIsAddingNew(false);
      setNewHackathon({
        name: '',
        date: '',
        participants: '',
        mode: 'Online',
        registrationUrl: 'https://unstop.com/'
      });
      loadHackathons();
    } catch (error) {
      console.error('Failed to add hackathon:', error);
      toast({
        title: 'Error',
        description: 'Failed to add hackathon. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      await ApiService.hackathons.delete(id);
      toast({
        title: 'Success',
        description: 'Hackathon deleted successfully!'
      });
      loadHackathons();
    } catch (error) {
      console.error('Failed to delete hackathon:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete hackathon. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  const startEditing = (hackathon: Hackathon) => {
    setEditingId(hackathon.id);
    setNewHackathon({
      name: hackathon.name,
      date: hackathon.date,
      participants: hackathon.participants,
      mode: hackathon.mode,
      registrationUrl: hackathon.registrationUrl
    });
  };
  
  const handleUpdate = async (id: string) => {
    if (!newHackathon.name || !newHackathon.date || !newHackathon.registrationUrl) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      await ApiService.hackathons.update({
        id,
        ...newHackathon
      });
      toast({
        title: 'Success',
        description: 'Hackathon updated successfully!'
      });
      setEditingId(null);
      setNewHackathon({
        name: '',
        date: '',
        participants: '',
        mode: 'Online',
        registrationUrl: 'https://unstop.com/'
      });
      loadHackathons();
    } catch (error) {
      console.error('Failed to update hackathon:', error);
      toast({
        title: 'Error',
        description: 'Failed to update hackathon. Please try again.',
        variant: 'destructive'
      });
    }
  };
  
  const cancelEditing = () => {
    setEditingId(null);
    setNewHackathon({
      name: '',
      date: '',
      participants: '',
      mode: 'Online',
      registrationUrl: 'https://unstop.com/'
    });
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Hackathons</CardTitle>
            <CardDescription>Add, edit or remove hackathons</CardDescription>
          </div>
          {!isAddingNew && (
            <Button onClick={() => setIsAddingNew(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Hackathon
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isAddingNew && (
            <div className="mb-6 space-y-4 border rounded-md p-4">
              <h3 className="font-semibold text-lg">Add New Hackathon</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Hackathon Name</Label>
                  <Input 
                    id="name" 
                    value={newHackathon.name} 
                    onChange={(e) => setNewHackathon({...newHackathon, name: e.target.value})}
                    placeholder="e.g., CodeFest 2024"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    value={newHackathon.date} 
                    onChange={(e) => setNewHackathon({...newHackathon, date: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participants">Expected Participants</Label>
                  <Input 
                    id="participants" 
                    value={newHackathon.participants} 
                    onChange={(e) => setNewHackathon({...newHackathon, participants: e.target.value})}
                    placeholder="e.g., 500+"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mode">Mode</Label>
                  <Select 
                    value={newHackathon.mode} 
                    onValueChange={(value) => setNewHackathon({...newHackathon, mode: value as 'Online' | 'Offline' | 'Hybrid'})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Mode</SelectLabel>
                        <SelectItem value="Online">Online</SelectItem>
                        <SelectItem value="Offline">Offline</SelectItem>
                        <SelectItem value="Hybrid">Hybrid</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="registrationUrl">Registration URL</Label>
                  <Input 
                    id="registrationUrl" 
                    value={newHackathon.registrationUrl} 
                    onChange={(e) => setNewHackathon({...newHackathon, registrationUrl: e.target.value})}
                    placeholder="https://unstop.com/hackathons/your-hackathon"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsAddingNew(false)}>Cancel</Button>
                <Button onClick={handleAddNew}>Add Hackathon</Button>
              </div>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-4">Loading hackathons...</div>
          ) : hackathons.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No hackathons found. Add one to get started.</div>
          ) : (
            <div className="space-y-4">
              {hackathons.map((hackathon) => (
                <div key={hackathon.id} className="border rounded-md p-4">
                  {editingId === hackathon.id ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`edit-name-${hackathon.id}`}>Hackathon Name</Label>
                          <Input 
                            id={`edit-name-${hackathon.id}`} 
                            value={newHackathon.name} 
                            onChange={(e) => setNewHackathon({...newHackathon, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`edit-date-${hackathon.id}`}>Date</Label>
                          <Input 
                            id={`edit-date-${hackathon.id}`} 
                            type="date" 
                            value={newHackathon.date} 
                            onChange={(e) => setNewHackathon({...newHackathon, date: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`edit-participants-${hackathon.id}`}>Expected Participants</Label>
                          <Input 
                            id={`edit-participants-${hackathon.id}`} 
                            value={newHackathon.participants} 
                            onChange={(e) => setNewHackathon({...newHackathon, participants: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`edit-mode-${hackathon.id}`}>Mode</Label>
                          <Select 
                            value={newHackathon.mode} 
                            onValueChange={(value) => setNewHackathon({...newHackathon, mode: value as 'Online' | 'Offline' | 'Hybrid'})}
                          >
                            <SelectTrigger id={`edit-mode-${hackathon.id}`}>
                              <SelectValue placeholder="Select mode" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Mode</SelectLabel>
                                <SelectItem value="Online">Online</SelectItem>
                                <SelectItem value="Offline">Offline</SelectItem>
                                <SelectItem value="Hybrid">Hybrid</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`edit-url-${hackathon.id}`}>Registration URL</Label>
                          <Input 
                            id={`edit-url-${hackathon.id}`} 
                            value={newHackathon.registrationUrl} 
                            onChange={(e) => setNewHackathon({...newHackathon, registrationUrl: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={cancelEditing}>
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => handleUpdate(hackathon.id)}>
                          <Check className="mr-2 h-4 w-4" />
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{hackathon.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {hackathon.mode} • {hackathon.participants} participants • Date: {hackathon.date}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => startEditing(hackathon)}>
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(hackathon.id)}>
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>
                      <div className="mt-2">
                        <a 
                          href={hackathon.registrationUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline flex items-center"
                        >
                          Registration Link
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHackathonManagement;
