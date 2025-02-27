
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  GraduationCap,
  Github,
  Link as LinkIcon,
  ProjectorIcon,
  Award,
  Star,
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  const education = {
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
  };

  const links = [
    { platform: "GitHub", url: "https://github.com/username", icon: Github },
    { platform: "LeetCode", url: "https://leetcode.com/username", icon: LinkIcon },
    { platform: "CodeChef", url: "https://codechef.com/username", icon: LinkIcon },
  ];

  const projects = [
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
  ];

  const certifications = [
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
  ];

  const others = [
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
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-zinc-500">
          Manage your academic and professional information
        </p>
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
                <div className="text-sm">
                  <p className="font-medium">{education.matriculation.school}</p>
                  <p className="text-muted-foreground">{education.matriculation.board}</p>
                  <p className="text-muted-foreground">Year: {education.matriculation.year}</p>
                  <p>Percentage: {education.matriculation.percentage}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Intermediate</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <p className="font-medium">{education.intermediate.school}</p>
                  <p className="text-muted-foreground">{education.intermediate.board}</p>
                  <p className="text-muted-foreground">Year: {education.intermediate.year}</p>
                  <p>Percentage: {education.intermediate.percentage}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Graduation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <p className="font-medium">{education.graduation.college}</p>
                  <p className="text-muted-foreground">{education.graduation.course}</p>
                  <p className="text-muted-foreground">Year: {education.graduation.year}</p>
                  <p>CGPA: {education.graduation.cgpa}</p>
                </div>
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
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
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
                  <CardTitle className="text-lg">{cert.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
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
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="px-2 py-1 rounded-full bg-secondary">
                      {item.category}
                    </span>
                    <span>{item.year}</span>
                  </div>
                  <p className="text-sm">{item.description}</p>
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
