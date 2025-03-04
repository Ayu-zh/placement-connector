
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, Plus, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeammateRequest {
  id: string;
  hackathonName: string;
  skills: string[];
  description: string;
  contactInfo: string;
  postedBy: {
    name: string;
    department: string;
    year: string;
  };
}

export const HackathonTeammates = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'find' | 'post'>('find');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state for posting a new request
  const [formData, setFormData] = useState({
    hackathonName: '',
    skills: '',
    description: '',
    contactInfo: ''
  });

  // Mock data for teammate requests
  const teammateRequests: TeammateRequest[] = [
    {
      id: '1',
      hackathonName: 'CodeFest 2024',
      skills: ['React', 'Node.js', 'UI/UX'],
      description: 'Looking for frontend and backend developers to build a social impact project.',
      contactInfo: 'john.doe@example.com',
      postedBy: {
        name: 'John Doe',
        department: 'Computer Science',
        year: '3rd Year'
      }
    },
    {
      id: '2',
      hackathonName: 'AI Innovate',
      skills: ['Python', 'Machine Learning', 'Data Analysis'],
      description: 'Need team members with ML experience for healthcare AI solution.',
      contactInfo: 'jane.smith@example.com',
      postedBy: {
        name: 'Jane Smith',
        department: 'Data Science',
        year: '4th Year'
      }
    },
    {
      id: '3',
      hackathonName: 'Blockchain Summit',
      skills: ['Solidity', 'Web3.js', 'Smart Contracts'],
      description: 'Building a decentralized application for supply chain tracking.',
      contactInfo: 'mike.crypto@example.com',
      postedBy: {
        name: 'Mike Johnson',
        department: 'Information Technology',
        year: '2nd Year'
      }
    }
  ];

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
    // In a real implementation, this would call an API to save the request
    console.log('Submitting form:', formData);
    
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
  };

  const handleConnect = (request: TeammateRequest) => {
    // In a real implementation, this would handle the connection logic
    toast({
      title: "Connection Request Sent",
      description: `Your request to connect with ${request.postedBy.name} has been sent.`,
    });
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
              {filteredRequests.length === 0 ? (
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
              
              <Button type="submit" className="w-full mt-4">
                <Plus className="h-4 w-4 mr-2" /> Post Teammate Request
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
