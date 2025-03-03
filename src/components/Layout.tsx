
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useLocation } from 'react-router-dom';

export function Layout({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const location = useLocation();
  
  // Check if the current path is an admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="flex">
        {user && !isAdminRoute && <Sidebar />}
        <main className={`${isAdminRoute ? 'w-full' : 'flex-1'} p-6`}>{children}</main>
      </div>
    </div>
  );
}
