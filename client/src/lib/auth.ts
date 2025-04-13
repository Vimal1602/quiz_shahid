
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
}

// Mock user data for development purposes
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Vimal',
    email: 'vimal@vitstudent.ac.in',
    role: 'student'
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@vitadmin.ac.in',
    role: 'admin'
  }
];

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}
