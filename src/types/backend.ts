
import { User, UserRole } from './auth';

// Student credentials
export interface StudentCredentials {
  email: string;
  password: string;
  userId: string;
}

// Job posting interface
export interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  deadline: string;
  requirements: string[];
  hrContact: {
    name: string;
    email: string;
    phone: string;
  };
  alumniContact: {
    name: string;
    batch: string;
    email: string;
  };
}

// Job application interface
export interface JobApplication {
  id: string;
  jobId: number;
  studentId: string;
  appliedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  studentName: string;
  jobTitle: string;
  company: string;
}

// Student interface with more details
export interface Student {
  id: string;
  name: string;
  email: string;
  department: string;
  year: string;
  status: 'active' | 'inactive' | 'suspended';
  verified: boolean;
}

// Certification interface
export interface Certification {
  id: string;
  name: string;
  provider: string;
  description: string;
  skillsGained: string[];
  duration: string;
  isActive: boolean;
}

// Hackathon interface
export interface Hackathon {
  id: string;
  name: string;
  date: string;
  participants: string;
  mode: 'Online' | 'Offline' | 'Hybrid';
  registrationUrl: string;
}

// Hackathon Teammate Request interface
export interface TeammateRequest {
  id: string;
  hackathonName: string;
  skills: string[];
  description: string;
  contactInfo: string;
  linkedinUrl?: string; // Added LinkedIn URL (optional)
  postedBy: {
    id: string;
    name: string;
    department: string;
    year: string;
  };
  createdAt: string;
}

// Dashboard Statistics
export interface DashboardStats {
  totalStudents: number;
  activeStudents: number;
  registeredCompanies: number;
  activeJobs: number;
  totalPlacements: number;
  placementRate: number;
  departmentPlacements: {
    department: string;
    count: number;
  }[];
  recentActivities: {
    id: string;
    type: 'job' | 'company' | 'student' | 'placement';
    title: string;
    description: string;
    date: string;
  }[];
}
