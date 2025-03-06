
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  Briefcase,
  GraduationCap,
  LayoutDashboard,
  ChartBar,
  Settings,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
}

export function Sidebar() {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  
  // Don't show sidebar on login pages
  if (location.pathname === '/' || location.pathname === '/admin') {
    return null;
  }

  const studentNavItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Jobs',
      href: '/jobs',
      icon: Briefcase,
    },
    {
      title: 'Profile',
      href: '/profile',
      icon: GraduationCap,
    },
    {
      title: 'Statistics',
      href: '/statistics',
      icon: ChartBar,
    },
    {
      title: 'Settings',
      href: '/settings',
      icon: Settings,
    },
  ];

  const adminNavItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: 'Manage Jobs',
      href: '/admin/jobs',
      icon: Briefcase,
    },
    {
      title: 'Students',
      href: '/admin/students',
      icon: GraduationCap,
    },
    {
      title: 'Analytics',
      href: '/admin/analytics',
      icon: ChartBar,
    },
  ];

  const hrNavItems: NavItem[] = [
    {
      title: 'Dashboard',
      href: '/hr',
      icon: LayoutDashboard,
    },
    {
      title: 'Post Jobs',
      href: '/hr/jobs/new',
      icon: Briefcase,
    },
    {
      title: 'Applications',
      href: '/hr/applications',
      icon: GraduationCap,
    },
  ];

  const navItems = user?.role === 'admin' 
    ? adminNavItems 
    : user?.role === 'hr' 
    ? hrNavItems 
    : studentNavItems;

  return (
    <aside className={cn(
      "h-[calc(100vh-4rem)] border-r bg-white sticky top-16 transition-all duration-300",
      isCollapsed ? "w-[70px]" : "w-[240px]"
    )}>
      <nav className="flex flex-col gap-2 p-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-zinc-500 transition-colors hover:text-zinc-900 hover:bg-zinc-50",
              "min-h-[40px]"
            )}
          >
            <item.icon className="h-5 w-5" />
            {!isCollapsed && <span>{item.title}</span>}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
