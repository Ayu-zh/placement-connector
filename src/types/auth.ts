
export type UserRole = 'student' | 'admin' | 'hr';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  company?: string;
  isVerified?: boolean;
}

// Admin credentials
export interface AdminCredentials {
  email: string;
  password: string;
}
