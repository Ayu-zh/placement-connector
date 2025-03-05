import { Job, Student, StudentCredentials, Certification, Hackathon, TeammateRequest, DashboardStats, Notification } from '@/types/backend';
import { User, AdminCredentials } from '@/types/auth';

// Mock database using localStorage
const initializeDatabase = () => {
  // Initialize jobs if not already present
  if (!localStorage.getItem('jobs')) {
    localStorage.setItem('jobs', JSON.stringify([
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
      }
    ]));
  }

  // Initialize students if not already present
  if (!localStorage.getItem('students')) {
    localStorage.setItem('students', JSON.stringify([
      {
        id: 's1',
        name: 'Rahul Sharma',
        email: 'rahul.s@college.edu',
        department: 'Computer Science',
        year: '4th Year',
        status: 'active',
        verified: true,
      },
      {
        id: 's2',
        name: 'Priya Patel',
        email: 'priya.p@college.edu',
        department: 'Electronics',
        year: '3rd Year',
        status: 'active',
        verified: true,
      },
      {
        id: 's3',
        name: 'Ajay Kumar',
        email: 'ajay.k@college.edu',
        department: 'Mechanical',
        year: '4th Year',
        status: 'inactive',
        verified: false,
      },
      {
        id: 's4',
        name: 'Neha Gupta',
        email: 'neha.g@college.edu',
        department: 'Civil',
        year: '2nd Year',
        status: 'active',
        verified: true,
      },
      {
        id: 's5',
        name: 'Vikram Singh',
        email: 'vikram.s@college.edu',
        department: 'Computer Science',
        year: '4th Year',
        status: 'suspended',
        verified: true,
      }
    ]));
  }

  // Initialize student credentials if not already present
  if (!localStorage.getItem('studentCredentials')) {
    localStorage.setItem('studentCredentials', JSON.stringify([
      { userId: 's1', email: 'rahul.s@college.edu', password: 'password123' },
      { userId: 's2', email: 'priya.p@college.edu', password: 'password123' },
      { userId: 's3', email: 'ajay.k@college.edu', password: 'password123' },
      { userId: 's4', email: 'neha.g@college.edu', password: 'password123' },
      { userId: 's5', email: 'vikram.s@college.edu', password: 'password123' },
    ]));
  }

  // Initialize certifications if not already present
  if (!localStorage.getItem('certifications')) {
    localStorage.setItem('certifications', JSON.stringify([
      {
        id: 'cert1',
        name: 'AWS Certified Solutions Architect',
        provider: 'Amazon Web Services',
        description: 'Validates expertise in designing distributed systems on AWS',
        skillsGained: ['Cloud Architecture', 'AWS Services', 'Security Best Practices'],
        duration: '3 months',
        isActive: true,
      },
      {
        id: 'cert2',
        name: 'Microsoft Azure Developer Associate',
        provider: 'Microsoft',
        description: 'For developers who design, build, test, and maintain cloud applications',
        skillsGained: ['Azure Services', 'Cloud Development', 'Secure Solutions'],
        duration: '2 months',
        isActive: true,
      },
      {
        id: 'cert3',
        name: 'Google Cloud Professional Data Engineer',
        provider: 'Google Cloud',
        description: 'For professionals who design and build data processing systems',
        skillsGained: ['Data Engineering', 'Machine Learning', 'Big Data'],
        duration: '4 months',
        isActive: false,
      }
    ]));
  }

  // Initialize hackathons if not already present
  if (!localStorage.getItem('hackathons')) {
    localStorage.setItem('hackathons', JSON.stringify([
      {
        id: 'hack1',
        name: 'CodeFest 2024',
        date: '2024-03-30',
        participants: '500+',
        mode: 'Hybrid',
        registrationUrl: 'https://unstop.com/hackathons/codefest-2024'
      },
      {
        id: 'hack2',
        name: 'AI Innovate',
        date: '2024-04-05',
        participants: '300+',
        mode: 'Online',
        registrationUrl: 'https://unstop.com/hackathons/ai-innovate-2024'
      }
    ]));
  }

  // Initialize teammate requests if not already present
  if (!localStorage.getItem('teammateRequests')) {
    localStorage.setItem('teammateRequests', JSON.stringify([
      {
        id: 'req1',
        hackathonName: 'CodeFest 2024',
        skills: ['React', 'Node.js', 'UI/UX'],
        description: 'Looking for a frontend developer with React experience for CodeFest 2024',
        contactInfo: 'rahul.s@college.edu',
        postedBy: {
          id: 's1',
          name: 'Rahul Sharma',
          department: 'Computer Science',
          year: '4th Year'
        },
        createdAt: '2024-03-20T08:30:00.000Z'
      },
      {
        id: 'req2',
        hackathonName: 'AI Innovate',
        skills: ['Python', 'TensorFlow', 'NLP'],
        description: 'Need a partner with ML experience for AI Innovate hackathon',
        contactInfo: 'neha.g@college.edu',
        postedBy: {
          id: 's4',
          name: 'Neha Gupta',
          department: 'Civil',
          year: '2nd Year'
        },
        createdAt: '2024-03-22T14:45:00.000Z'
      }
    ]));
  }

  // Initialize notifications if not already present
  if (!localStorage.getItem('notifications')) {
    localStorage.setItem('notifications', JSON.stringify([]));
  }

  // Initialize dashboard stats
  if (!localStorage.getItem('dashboardStats')) {
    const students = JSON.parse(localStorage.getItem('students') || '[]');
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    
    // Create random department stats
    const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil'];
    const departmentPlacements = departments.map(dept => ({
      department: dept,
      count: Math.floor(Math.random() * 40) + 10 // Random between 10-50
    }));
    
    // Calculate active students count
    const activeStudents = students.filter(s => s.status === 'active').length;
    
    // Random total placements
    const totalPlacements = Math.floor(Math.random() * 100) + 50; // 50-150 placements
    
    // Calculate placement rate
    const placementRate = Math.round((totalPlacements / students.length) * 100);
    
    // Generate random recent activities
    const activities = [
      {
        id: 'act1',
        type: 'job' as const,
        title: 'New Job Posted',
        description: 'Google has posted a new Software Engineer position',
        date: '2024-03-25T09:45:00.000Z'
      },
      {
        id: 'act2',
        type: 'company' as const,
        title: 'New Company Registration',
        description: 'Microsoft has registered for campus placements',
        date: '2024-03-24T13:20:00.000Z'
      },
      {
        id: 'act3',
        type: 'student' as const,
        title: 'Student Verified',
        description: 'Neha Gupta has been verified',
        date: '2024-03-23T10:15:00.000Z'
      },
      {
        id: 'act4',
        type: 'placement' as const,
        title: 'Placement Offer',
        description: 'Rahul Sharma received an offer from Amazon',
        date: '2024-03-22T16:30:00.000Z'
      }
    ];
    
    const stats: DashboardStats = {
      totalStudents: students.length,
      activeStudents,
      registeredCompanies: 12, // Random number
      activeJobs: jobs.length,
      totalPlacements,
      placementRate,
      departmentPlacements,
      recentActivities: activities
    };
    
    localStorage.setItem('dashboardStats', JSON.stringify(stats));
  }
};

// Initialize database on module import
initializeDatabase();

// API Service
export const ApiService = {
  // Admin login
  adminLogin: async (credentials: AdminCredentials): Promise<User | null> => {
    // Mock admin credentials stored in the code
    const storedAdmin = { 
      email: 'admin@college.edu', 
      password: 'admin123' 
    };
    
    if (credentials.email === storedAdmin.email && credentials.password === storedAdmin.password) {
      return {
        id: 'admin-1',
        name: 'Admin User',
        email: credentials.email,
        role: 'admin',
        isVerified: true,
      };
    }
    return null;
  },

  // Student login
  studentLogin: async (email: string, password: string): Promise<User | null> => {
    const credentials = JSON.parse(localStorage.getItem('studentCredentials') || '[]') as StudentCredentials[];
    const credential = credentials.find(c => c.email === email && c.password === password);
    
    if (credential) {
      const students = JSON.parse(localStorage.getItem('students') || '[]') as Student[];
      const student = students.find(s => s.id === credential.userId);
      
      if (student) {
        return {
          id: student.id,
          name: student.name,
          email: student.email,
          role: 'student',
          department: student.department,
          isVerified: student.verified,
        };
      }
    }
    return null;
  },

  // Jobs API
  jobs: {
    getAll: async (): Promise<Job[]> => {
      return JSON.parse(localStorage.getItem('jobs') || '[]');
    },
    
    add: async (job: Omit<Job, 'id'>): Promise<Job> => {
      const jobs = JSON.parse(localStorage.getItem('jobs') || '[]') as Job[];
      const newId = jobs.length > 0 ? Math.max(...jobs.map(j => j.id)) + 1 : 1;
      
      const newJob: Job = {
        id: newId,
        ...job
      };
      
      jobs.push(newJob);
      localStorage.setItem('jobs', JSON.stringify(jobs));
      return newJob;
    },
    
    update: async (job: Job): Promise<Job> => {
      const jobs = JSON.parse(localStorage.getItem('jobs') || '[]') as Job[];
      const updatedJobs = jobs.map(j => j.id === job.id ? job : j);
      localStorage.setItem('jobs', JSON.stringify(updatedJobs));
      return job;
    },
    
    delete: async (id: number): Promise<void> => {
      const jobs = JSON.parse(localStorage.getItem('jobs') || '[]') as Job[];
      const filteredJobs = jobs.filter(j => j.id !== id);
      localStorage.setItem('jobs', JSON.stringify(filteredJobs));
    }
  },

  // Students API
  students: {
    getAll: async (): Promise<Student[]> => {
      return JSON.parse(localStorage.getItem('students') || '[]');
    },
    
    add: async (student: Omit<Student, 'id'>, password: string): Promise<Student> => {
      const students = JSON.parse(localStorage.getItem('students') || '[]') as Student[];
      const newId = `s${Math.floor(Math.random() * 10000)}`;
      
      const newStudent: Student = {
        id: newId,
        ...student
      };
      
      students.push(newStudent);
      localStorage.setItem('students', JSON.stringify(students));
      
      // Add credentials
      const credentials = JSON.parse(localStorage.getItem('studentCredentials') || '[]') as StudentCredentials[];
      credentials.push({
        userId: newId,
        email: student.email,
        password
      });
      localStorage.setItem('studentCredentials', JSON.stringify(credentials));
      
      return newStudent;
    },
    
    update: async (student: Student, password?: string): Promise<Student> => {
      const students = JSON.parse(localStorage.getItem('students') || '[]') as Student[];
      const updatedStudents = students.map(s => s.id === student.id ? student : s);
      localStorage.setItem('students', JSON.stringify(updatedStudents));
      
      // Update credentials if password is provided
      if (password) {
        const credentials = JSON.parse(localStorage.getItem('studentCredentials') || '[]') as StudentCredentials[];
        const updatedCredentials = credentials.map(c => 
          c.userId === student.id ? { ...c, email: student.email, password } : c
        );
        localStorage.setItem('studentCredentials', JSON.stringify(updatedCredentials));
      }
      
      return student;
    },
    
    delete: async (id: string): Promise<void> => {
      const students = JSON.parse(localStorage.getItem('students') || '[]') as Student[];
      const filteredStudents = students.filter(s => s.id !== id);
      localStorage.setItem('students', JSON.stringify(filteredStudents));
      
      // Remove credentials
      const credentials = JSON.parse(localStorage.getItem('studentCredentials') || '[]') as StudentCredentials[];
      const filteredCredentials = credentials.filter(c => c.userId !== id);
      localStorage.setItem('studentCredentials', JSON.stringify(filteredCredentials));
    },
    
    toggleVerification: async (id: string): Promise<Student> => {
      const students = JSON.parse(localStorage.getItem('students') || '[]') as Student[];
      const student = students.find(s => s.id === id);
      
      if (student) {
        student.verified = !student.verified;
        const updatedStudents = students.map(s => s.id === id ? student : s);
        localStorage.setItem('students', JSON.stringify(updatedStudents));
        return student;
      }
      
      throw new Error('Student not found');
    }
  },

  // Certifications API
  certifications: {
    getAll: async (): Promise<Certification[]> => {
      return JSON.parse(localStorage.getItem('certifications') || '[]');
    },
    
    add: async (certification: Omit<Certification, 'id'>): Promise<Certification> => {
      const certifications = JSON.parse(localStorage.getItem('certifications') || '[]') as Certification[];
      const newId = `cert${Math.floor(Math.random() * 10000)}`;
      
      const newCertification: Certification = {
        id: newId,
        ...certification
      };
      
      certifications.push(newCertification);
      localStorage.setItem('certifications', JSON.stringify(certifications));
      return newCertification;
    },
    
    update: async (certification: Certification): Promise<Certification> => {
      const certifications = JSON.parse(localStorage.getItem('certifications') || '[]') as Certification[];
      const updatedCertifications = certifications.map(c => c.id === certification.id ? certification : c);
      localStorage.setItem('certifications', JSON.stringify(updatedCertifications));
      return certification;
    },
    
    delete: async (id: string): Promise<void> => {
      const certifications = JSON.parse(localStorage.getItem('certifications') || '[]') as Certification[];
      const filteredCertifications = certifications.filter(c => c.id !== id);
      localStorage.setItem('certifications', JSON.stringify(filteredCertifications));
    },
    
    toggleActive: async (id: string): Promise<Certification> => {
      const certifications = JSON.parse(localStorage.getItem('certifications') || '[]') as Certification[];
      const certification = certifications.find(c => c.id === id);
      
      if (certification) {
        certification.isActive = !certification.isActive;
        const updatedCertifications = certifications.map(c => c.id === id ? certification : c);
        localStorage.setItem('certifications', JSON.stringify(updatedCertifications));
        return certification;
      }
      
      throw new Error('Certification not found');
    }
  },

  // Hackathons API
  hackathons: {
    getAll: async (): Promise<Hackathon[]> => {
      return JSON.parse(localStorage.getItem('hackathons') || '[]');
    },
    
    add: async (hackathon: Omit<Hackathon, 'id'>): Promise<Hackathon> => {
      const hackathons = JSON.parse(localStorage.getItem('hackathons') || '[]') as Hackathon[];
      const newId = `hack${Math.floor(Math.random() * 10000)}`;
      
      const newHackathon: Hackathon = {
        id: newId,
        ...hackathon
      };
      
      hackathons.push(newHackathon);
      localStorage.setItem('hackathons', JSON.stringify(hackathons));
      return newHackathon;
    },
    
    update: async (hackathon: Hackathon): Promise<Hackathon> => {
      const hackathons = JSON.parse(localStorage.getItem('hackathons') || '[]') as Hackathon[];
      const updatedHackathons = hackathons.map(h => h.id === hackathon.id ? hackathon : h);
      localStorage.setItem('hackathons', JSON.stringify(updatedHackathons));
      return hackathon;
    },
    
    delete: async (id: string): Promise<void> => {
      const hackathons = JSON.parse(localStorage.getItem('hackathons') || '[]') as Hackathon[];
      const filteredHackathons = hackathons.filter(h => h.id !== id);
      localStorage.setItem('hackathons', JSON.stringify(filteredHackathons));
    }
  },
  
  // Password validation
  validatePassword: async (userId: string, password: string): Promise<boolean> => {
    const credentials = JSON.parse(localStorage.getItem('studentCredentials') || '[]') as StudentCredentials[];
    const credential = credentials.find(c => c.userId === userId && c.password === password);
    return !!credential;
  },
  
  // Dashboard Stats API
  dashboardStats: {
    get: async (): Promise<DashboardStats> => {
      return JSON.parse(localStorage.getItem('dashboardStats') || '{}');
    },
    
    update: async (stats: Partial<DashboardStats>): Promise<DashboardStats> => {
      const currentStats = JSON.parse(localStorage.getItem('dashboardStats') || '{}');
      const updatedStats = { ...currentStats, ...stats };
      localStorage.setItem('dashboardStats', JSON.stringify(updatedStats));
      return updatedStats;
    }
  },
  
  // Teammate Requests API
  teammateRequests: {
    getAll: async (): Promise<TeammateRequest[]> => {
      return JSON.parse(localStorage.getItem('teammateRequests') || '[]');
    },
    
    getByHackathon: async (hackathonName: string): Promise<TeammateRequest[]> => {
      const requests = JSON.parse(localStorage.getItem('teammateRequests') || '[]') as TeammateRequest[];
      return requests.filter(req => req.hackathonName === hackathonName);
    },
    
    add: async (request: Omit<TeammateRequest, 'id' | 'createdAt'>): Promise<TeammateRequest> => {
      const requests = JSON.parse(localStorage.getItem('teammateRequests') || '[]') as TeammateRequest[];
      const newId = `req${Math.floor(Math.random() * 10000)}`;
      
      const newRequest: TeammateRequest = {
        id: newId,
        ...request,
        createdAt: new Date().toISOString()
      };
      
      requests.push(newRequest);
      localStorage.setItem('teammateRequests', JSON.stringify(requests));
      return newRequest;
    },
    
    update: async (request: TeammateRequest): Promise<TeammateRequest> => {
      const requests = JSON.parse(localStorage.getItem('teammateRequests') || '[]') as TeammateRequest[];
      const updatedRequests = requests.map(r => r.id === request.id ? request : r);
      localStorage.setItem('teammateRequests', JSON.stringify(updatedRequests));
      return request;
    },
    
    delete: async (id: string): Promise<void> => {
      const requests = JSON.parse(localStorage.getItem('teammateRequests') || '[]') as TeammateRequest[];
      const filteredRequests = requests.filter(r => r.id !== id);
      localStorage.setItem('teammateRequests', JSON.stringify(filteredRequests));
    }
  },

  // Notifications API
  notifications: {
    getAll: async (): Promise<Notification[]> => {
      return JSON.parse(localStorage.getItem('notifications') || '[]');
    },
    
    getByUser: async (userId: string): Promise<Notification[]> => {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]') as Notification[];
      return notifications.filter(n => n.userId === userId).sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    },
    
    add: async (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>): Promise<Notification> => {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]') as Notification[];
      const newId = `notif${Math.floor(Math.random() * 10000)}`;
      
      const newNotification: Notification = {
        id: newId,
        ...notification,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      
      notifications.push(newNotification);
      localStorage.setItem('notifications', JSON.stringify(notifications));
      return newNotification;
    },
    
    markAsRead: async (id: string): Promise<Notification> => {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]') as Notification[];
      const notification = notifications.find(n => n.id === id);
      
      if (notification) {
        notification.isRead = true;
        const updatedNotifications = notifications.map(n => n.id === id ? notification : n);
        localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        return notification;
      }
      
      throw new Error('Notification not found');
    },
    
    markAllAsRead: async (userId: string): Promise<void> => {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]') as Notification[];
      const updatedNotifications = notifications.map(n => 
        n.userId === userId ? { ...n, isRead: true } : n
      );
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    },
    
    delete: async (id: string): Promise<void> => {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]') as Notification[];
      const filteredNotifications = notifications.filter(n => n.id !== id);
      localStorage.setItem('notifications', JSON.stringify(filteredNotifications));
    }
  },
};
