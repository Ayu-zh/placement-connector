
import { Job, Student, StudentCredentials } from '@/types/backend';
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
  }
};
