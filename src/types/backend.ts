
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
