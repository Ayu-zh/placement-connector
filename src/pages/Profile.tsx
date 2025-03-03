
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  GraduationCap,
  Github,
  Link as LinkIcon,
  ProjectorIcon,
  Award,
  Star,
  Edit,
  Save,
  FileDown,
  X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // State for user information
  const [education, setEducation] = useState({
    matriculation: {
      school: "Delhi Public School",
      board: "CBSE",
      year: "2018",
      percentage: "95%",
    },
    intermediate: {
      school: "Delhi Public School",
      board: "CBSE",
      year: "2020",
      percentage: "92%",
    },
    graduation: {
      college: "Indian Institute of Technology",
      course: "B.Tech in Computer Science",
      year: "2024",
      cgpa: "8.9",
    },
  });

  const [links, setLinks] = useState([
    { platform: "GitHub", url: "https://github.com/username", icon: Github },
    { platform: "LeetCode", url: "https://leetcode.com/username", icon: LinkIcon },
    { platform: "CodeChef", url: "https://codechef.com/username", icon: LinkIcon },
  ]);

  const [projects, setProjects] = useState([
    {
      title: "E-commerce Platform",
      description: "Built a full-stack e-commerce platform using MERN stack",
      tech: ["React", "Node.js", "MongoDB"],
      link: "https://github.com/username/ecommerce",
    },
    {
      title: "AI Image Generator",
      description: "Created an AI-powered image generation tool",
      tech: ["Python", "TensorFlow", "Flask"],
      link: "https://github.com/username/ai-image-gen",
    },
  ]);

  const [certifications, setCertifications] = useState([
    {
      name: "AWS Solutions Architect Associate",
      issuer: "Amazon Web Services",
      date: "Jan 2024",
      link: "https://aws.certificate.com/123",
    },
    {
      name: "Python Professional",
      issuer: "Python Institute",
      date: "Dec 2023",
      link: "https://python.cert.com/456",
    },
  ]);

  const [others, setOthers] = useState([
    {
      title: "College Sports Captain",
      category: "Leadership",
      year: "2023",
      description: "Led college basketball team to inter-college championship",
    },
    {
      title: "Technical Paper Publication",
      category: "Academic Achievement",
      year: "2023",
      description: "Published paper on ML algorithms in IEEE conference",
    },
  ]);

  // Handlers for updating state
  const handleEducationChange = (level, field, value) => {
    setEducation(prev => ({
      ...prev,
      [level]: {
        ...prev[level],
        [field]: value
      }
    }));
  };

  const handleLinkChange = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setLinks(newLinks);
  };

  const handleProjectChange = (index, field, value) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setProjects(newProjects);
  };

  const handleProjectTechChange = (index, techIndex, value) => {
    const newProjects = [...projects];
    const newTech = [...newProjects[index].tech];
    newTech[techIndex] = value;
    newProjects[index] = { ...newProjects[index], tech: newTech };
    setProjects(newProjects);
  };

  const handleCertificationChange = (index, field, value) => {
    const newCerts = [...certifications];
    newCerts[index] = { ...newCerts[index], [field]: value };
    setCertifications(newCerts);
  };

  const handleOtherChange = (index, field, value) => {
    const newOthers = [...others];
    newOthers[index] = { ...newOthers[index], [field]: value };
    setOthers(newOthers);
  };

  const saveChanges = () => {
    // In a real app, you would save changes to a backend here
    setIsEditing(false);
    toast({
      title: "Changes saved",
      description: "Your profile has been updated successfully.",
    });
  };

  const generateResume = async () => {
    try {
      toast({
        title: "Generating resume",
        description: "Please wait while we generate your resume...",
      });
      
      // Create HTML content for the resume
      const resumeContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Resume - ${user?.name || "Student"}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
            h1 { color: #2563eb; }
            h2 { color: #1e40af; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
            .section { margin-bottom: 20px; }
            .item { margin-bottom: 10px; }
            .item h3 { margin-bottom: 5px; }
            .item p { margin: 3px 0; }
            .links { display: flex; gap: 15px; }
            .tech-stack { display: flex; gap: 10px; flex-wrap: wrap; }
            .tech { background: #e5e7eb; padding: 3px 8px; border-radius: 4px; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>${user?.name || "Student"} - Resume</h1>
          
          <div class="section">
            <h2>Education</h2>
            <div class="item">
              <h3>Graduation - ${education.graduation.college}</h3>
              <p>${education.graduation.course}</p>
              <p>Year: ${education.graduation.year}</p>
              <p>CGPA: ${education.graduation.cgpa}</p>
            </div>
            <div class="item">
              <h3>Intermediate - ${education.intermediate.school}</h3>
              <p>Board: ${education.intermediate.board}</p>
              <p>Year: ${education.intermediate.year}</p>
              <p>Percentage: ${education.intermediate.percentage}</p>
            </div>
            <div class="item">
              <h3>Matriculation - ${education.matriculation.school}</h3>
              <p>Board: ${education.matriculation.board}</p>
              <p>Year: ${education.matriculation.year}</p>
              <p>Percentage: ${education.matriculation.percentage}</p>
            </div>
          </div>
          
          <div class="section">
            <h2>Projects</h2>
            ${projects.map(project => `
              <div class="item">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="tech-stack">
                  ${project.tech.map(tech => `<span class="tech">${tech}</span>`).join('')}
                </div>
                <p><a href="${project.link}" target="_blank">Project Link</a></p>
              </div>
            `).join('')}
          </div>
          
          <div class="section">
            <h2>Certifications</h2>
            ${certifications.map(cert => `
              <div class="item">
                <h3>${cert.name}</h3>
                <p>Issuer: ${cert.issuer}</p>
                <p>Date: ${cert.date}</p>
                <p><a href="${cert.link}" target="_blank">Certificate Link</a></p>
              </div>
            `).join('')}
          </div>
          
          <div class="section">
            <h2>Other Achievements</h2>
            ${others.map(item => `
              <div class="item">
                <h3>${item.title} (${item.category})</h3>
                <p>${item.description}</p>
                <p>Year: ${item.year}</p>
              </div>
            `).join('')}
          </div>
          
          <div class="section">
            <h2>Links</h2>
            <div class="links">
              ${links.map(link => `
                <p><a href="${link.url}" target="_blank">${link.platform}</a></p>
              `).join('')}
            </div>
          </div>
        </body>
        </html>
      `;
      
      // Convert HTML to a Blob
      const blob = new Blob([resumeContent], { type: 'text/html' });
      
      // Create a URL for the Blob
      const url = URL.createObjectURL(blob);
      
      // Create a link element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `${user?.name || 'student'}_resume.html`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Resume generated",
        description: "Your resume has been downloaded successfully.",
      });
    } catch (error) {
      console.error("Error generating resume:", error);
      toast({
        title: "Error",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-zinc-500">
            Manage your academic and professional information
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={saveChanges}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </>
          ) : (
            <>
              <Button onClick={generateResume} variant="secondary">
                <FileDown className="mr-2 h-4 w-4" />
                Generate Resume
              </Button>
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Education Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Matriculation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {isEditing ? (
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium">School</label>
                      <Input 
                        value={education.matriculation.school} 
                        onChange={(e) => handleEducationChange('matriculation', 'school', e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Board</label>
                      <Input 
                        value={education.matriculation.board} 
                        onChange={(e) => handleEducationChange('matriculation', 'board', e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Year</label>
                      <Input 
                        value={education.matriculation.year} 
                        onChange={(e) => handleEducationChange('matriculation', 'year', e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Percentage</label>
                      <Input 
                        value={education.matriculation.percentage} 
                        onChange={(e) => handleEducationChange('matriculation', 'percentage', e.target.value)} 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-sm">
                    <p className="font-medium">{education.matriculation.school}</p>
                    <p className="text-muted-foreground">{education.matriculation.board}</p>
                    <p className="text-muted-foreground">Year: {education.matriculation.year}</p>
                    <p>Percentage: {education.matriculation.percentage}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Intermediate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {isEditing ? (
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium">School</label>
                      <Input 
                        value={education.intermediate.school} 
                        onChange={(e) => handleEducationChange('intermediate', 'school', e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Board</label>
                      <Input 
                        value={education.intermediate.board} 
                        onChange={(e) => handleEducationChange('intermediate', 'board', e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Year</label>
                      <Input 
                        value={education.intermediate.year} 
                        onChange={(e) => handleEducationChange('intermediate', 'year', e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Percentage</label>
                      <Input 
                        value={education.intermediate.percentage} 
                        onChange={(e) => handleEducationChange('intermediate', 'percentage', e.target.value)} 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-sm">
                    <p className="font-medium">{education.intermediate.school}</p>
                    <p className="text-muted-foreground">{education.intermediate.board}</p>
                    <p className="text-muted-foreground">Year: {education.intermediate.year}</p>
                    <p>Percentage: {education.intermediate.percentage}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Graduation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {isEditing ? (
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium">College</label>
                      <Input 
                        value={education.graduation.college} 
                        onChange={(e) => handleEducationChange('graduation', 'college', e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Course</label>
                      <Input 
                        value={education.graduation.course} 
                        onChange={(e) => handleEducationChange('graduation', 'course', e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Year</label>
                      <Input 
                        value={education.graduation.year} 
                        onChange={(e) => handleEducationChange('graduation', 'year', e.target.value)} 
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">CGPA</label>
                      <Input 
                        value={education.graduation.cgpa} 
                        onChange={(e) => handleEducationChange('graduation', 'cgpa', e.target.value)} 
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-sm">
                    <p className="font-medium">{education.graduation.college}</p>
                    <p className="text-muted-foreground">{education.graduation.course}</p>
                    <p className="text-muted-foreground">Year: {education.graduation.year}</p>
                    <p>CGPA: {education.graduation.cgpa}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Links</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              {links.map((link, index) => (
                <div key={index} className="grid grid-cols-3 gap-4 items-center">
                  <div>
                    <label className="text-sm font-medium">Platform</label>
                    <Input 
                      value={link.platform} 
                      onChange={(e) => handleLinkChange(index, 'platform', e.target.value)} 
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium">URL</label>
                    <Input 
                      value={link.url} 
                      onChange={(e) => handleLinkChange(index, 'url', e.target.value)} 
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-lg border hover:bg-accent transition-colors"
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.platform}</span>
                </a>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <ProjectorIcon className="h-4 w-4" />
            Projects
          </TabsTrigger>
          <TabsTrigger value="certifications" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Certifications
          </TabsTrigger>
          <TabsTrigger value="others" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Others
          </TabsTrigger>
        </TabsList>

        <TabsContent value="projects">
          <div className="grid gap-4 md:grid-cols-2">
            {projects.map((project, index) => (
              <Card key={index}>
                <CardHeader>
                  {isEditing ? (
                    <Input 
                      value={project.title} 
                      onChange={(e) => handleProjectChange(index, 'title', e.target.value)} 
                      className="text-lg font-semibold"
                    />
                  ) : (
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea 
                          value={project.description} 
                          onChange={(e) => handleProjectChange(index, 'description', e.target.value)} 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Technologies</label>
                        <div className="grid grid-cols-3 gap-2">
                          {project.tech.map((tech, techIndex) => (
                            <Input 
                              key={techIndex}
                              value={tech} 
                              onChange={(e) => handleProjectTechChange(index, techIndex, e.target.value)} 
                            />
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Project Link</label>
                        <Input 
                          value={project.link} 
                          onChange={(e) => handleProjectChange(index, 'link', e.target.value)} 
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {project.tech.map((tech, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs rounded-full bg-secondary"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Github className="h-4 w-4" />
                        View Project
                      </a>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certifications">
          <div className="grid gap-4 md:grid-cols-2">
            {certifications.map((cert, index) => (
              <Card key={index}>
                <CardHeader>
                  {isEditing ? (
                    <Input 
                      value={cert.name} 
                      onChange={(e) => handleCertificationChange(index, 'name', e.target.value)} 
                      className="text-lg font-semibold"
                    />
                  ) : (
                    <CardTitle className="text-lg">{cert.name}</CardTitle>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Issuer</label>
                        <Input 
                          value={cert.issuer} 
                          onChange={(e) => handleCertificationChange(index, 'issuer', e.target.value)} 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Date</label>
                        <Input 
                          value={cert.date} 
                          onChange={(e) => handleCertificationChange(index, 'date', e.target.value)} 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Certificate Link</label>
                        <Input 
                          value={cert.link} 
                          onChange={(e) => handleCertificationChange(index, 'link', e.target.value)} 
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground">
                        {cert.issuer}
                      </p>
                      <p className="text-sm">Issued: {cert.date}</p>
                      <a
                        href={cert.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <LinkIcon className="h-4 w-4" />
                        View Certificate
                      </a>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="others">
          <div className="grid gap-4 md:grid-cols-2">
            {others.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  {isEditing ? (
                    <Input 
                      value={item.title} 
                      onChange={(e) => handleOtherChange(index, 'title', e.target.value)} 
                      className="text-lg font-semibold"
                    />
                  ) : (
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  )}
                </CardHeader>
                <CardContent className="space-y-2">
                  {isEditing ? (
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Category</label>
                        <Input 
                          value={item.category} 
                          onChange={(e) => handleOtherChange(index, 'category', e.target.value)} 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Year</label>
                        <Input 
                          value={item.year} 
                          onChange={(e) => handleOtherChange(index, 'year', e.target.value)} 
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Description</label>
                        <Textarea 
                          value={item.description} 
                          onChange={(e) => handleOtherChange(index, 'description', e.target.value)} 
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="px-2 py-1 rounded-full bg-secondary">
                          {item.category}
                        </span>
                        <span>{item.year}</span>
                      </div>
                      <p className="text-sm">{item.description}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Profile;
