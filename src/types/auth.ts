
export type UserRole = 'student' | 'admin' | 'hr';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  company?: string;
}
