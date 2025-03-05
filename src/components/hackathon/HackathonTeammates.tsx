
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Plus, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ApiService } from '@/services/api';
import { TeammateRequest } from '@/types/backend';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const HackathonTeammates = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'find' | 'post'>('find');
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();
  
  // Form state for posting a new request
  const [formData, setFormData] = useState({
    hackathonName: '',
    skills: '',
    description: '',
    contactInfo: ''
  });

  // Fetch teammate requests
  const { data: teammateRequests = [], isLoading, error } = useQuery({
    queryKey: ['teammateRequests'],
    queryFn: ApiService.teammateRequests.getAll
  });

  // Create mutation for posting new requests
  const createRequest = useMutation({
    mutationFn: (requestData: Omit<TeammateRequest, 'id' | 'createdAt'>) => 
      ApiService.teammateRequests.add(requestData),
    onSuccess: () => {
      toast({
        title: "Request Posted Successfully",
        description: "Your teammate request has been posted.",
      });
      
      // Reset form
      setFormData({
        hackathonName: '',
        skills: '',
        description: '',
        contactInfo: ''
      });
      
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['teammateRequests'] });
      
      // Switch to find tab
      setActiveTab('find');
    },
    onError: (error) => {
      toast({
        title: "Error Posting Request",
        description: "There was an error posting your request. Please try again.",
        variant: "destructive"
      });
      console.error("Error posting request:", error);
    }
  });

  // Create mutation for connection requests
  const connectWithTeammate = useMutation({
    mutationFn: (request: TeammateRequest) => {
      if (!user) throw new Error("You must be logged in to connect");
      
      // Create a notification for the request creator
      return ApiService.notifications.add({
        userId: request.postedBy.id,
        type: 'connection_request',
        title: "New Connection Request",
        message: `${user.name} wants to connect with you for ${request.hackathonName}`,
        relatedTo: {
          type: 'hackathon',
          id: request.id,
          name: request.hackathonName
        },
        from: {
          id: user.id,
          name: user.name
        }
      });
    },
    onSuccess: () => {
      toast({
        title: "Connection Request Sent",
        description: "Your request to connect has been sent successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error Sending Request",
        description: error instanceof Error ? error.message : "There was an error sending your request.",
        variant: "destructive"
      });
    }
  });

  const filteredRequests = searchQuery 
    ? teammateRequests.filter(request => 
        request.hackathonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase())) ||
        request.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : teammateRequests;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to post a request.",
        variant: "destructive"
      });
      return;
    }
    
    // Format skills from comma-separated string to array
    const skillsArray = formData.skills
      .split(',')
      .map(skill => skill.trim())
      .filter(skill => skill !== '');
    
    // Create request object
    const requestData = {
      hackathonName: formData.hackathonName,
      skills: skillsArray,
      description: formData.description,
      contactInfo: formData.contactInfo,
      postedBy: {
        id: user.id,
        name: user.name,
        department: user.department || 'Not specified',
        year: 'Current' // This would ideally come from user profile
      }
    };
    
    // Submit request
    createRequest.mutate(requestData);
  };

  const handleConnect = (request: TeammateRequest) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to connect with teammates.",
        variant: "destructive"
      });
      return;
    }
    
    if (user.id === request.postedBy.id) {
      toast({
        title: "Cannot Connect",
        description: "You cannot connect with your own request.",
        variant: "destructive"
      });
      return;
    }
    
    // Send connection request
    connectWithTeammate.mutate(request);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Find Hackathon Teammates</CardTitle>
        <CardDescription>Connect with other students for upcoming hackathons</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="find" onValueChange={(value) => setActiveTab(value as 'find' | 'post')} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="find">Find Teammates</TabsTrigger>
            <TabsTrigger value="post">Post Requirements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="find" className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by hackathon, skills, or description..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="space-y-4 mt-4">
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading teammate requests...
                </div>
              ) : error ? (
                <div className="text-center py-8 text-red-500">
                  Error loading requests. Please try again.
                </div>
              ) : filteredRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No teammate requests match your search.
                </div>
              ) : (
                filteredRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{request.hackathonName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Posted by: {request.postedBy.name} ({request.postedBy.department}, {request.postedBy.year})
                        </p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleConnect(request)}
                        disabled={connectWithTeammate.isPending || request.postedBy.id === user?.id}
                        className="flex items-center gap-1"
                      >
                        <MessageSquare className="h-4 w-4" /> Connect
                      </Button>
                    </div>
                    
                    <p className="text-sm">{request.description}</p>
                    
                    <div>
                      <p className="text-sm font-medium mb-1">Skills Needed:</p>
                      <div className="flex flex-wrap gap-1">
                        {request.skills.map((skill, index) => (
                          <span 
                            key={index} 
                            className="bg-muted text-xs rounded-full px-2 py-1"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground">
                      Contact: {request.contactInfo}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="post">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="hackathonName" className="text-sm font-medium">Hackathon Name</label>
                <Input
                  id="hackathonName"
                  name="hackathonName"
                  placeholder="e.g., CodeFest 2024"
                  value={formData.hackathonName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="skills" className="text-sm font-medium">Skills Needed (comma separated)</label>
                <Input
                  id="skills"
                  name="skills"
                  placeholder="e.g., React, Node.js, UI/UX"
                  value={formData.skills}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Input
                  id="description"
                  name="description"
                  placeholder="Describe your project and team requirements"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="contactInfo" className="text-sm font-medium">Contact Information</label>
                <Input
                  id="contactInfo"
                  name="contactInfo"
                  placeholder="e.g., Email or phone number"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full mt-4" 
                disabled={createRequest.isPending}
              >
                {createRequest.isPending ? (
                  "Posting..."
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" /> Post Teammate Request
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
