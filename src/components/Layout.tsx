
import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function Layout({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />
      <div className="flex">
        {user && <Sidebar />}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
