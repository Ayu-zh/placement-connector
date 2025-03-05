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

// Notification interface
export interface Notification {
  id: string;
  userId: string; // ID of the user who should receive the notification
  type: 'connection_request' | 'request_accepted' | 'system';
  title: string;
  message: string;
  relatedTo?: {
    type: 'hackathon' | 'job';
    id: string;
    name: string;
  };
  from?: {
    id: string;
    name: string;
  };
  isRead: boolean;
  createdAt: string;
}

// Hackathon Teammate Request interface
export interface TeammateRequest {
  id: string;
  hackathonName: string;
  skills: string[];
  description: string;
  contactInfo: string;
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
