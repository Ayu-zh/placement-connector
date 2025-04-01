
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
  
  // Check if we're on a login page
  const isLoginPage = location.pathname === '/' || location.pathname === '/admin';

  // Apply center alignment only to login pages
  const contentClass = isLoginPage ? 'text-center' : '';

  return (
    <div className="min-h-screen bg-zinc-50">
      {!isLoginPage && <Navbar />}
      <div className="flex">
        {user && !isAdminRoute && !isLoginPage && <Sidebar />}
        <main className={`${isAdminRoute || isLoginPage ? 'w-full' : 'flex-1'} p-6 ${contentClass}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
