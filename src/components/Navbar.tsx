
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    // Redirect based on user role
    if (user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="border-b bg-white px-6 py-3 sticky top-0 z-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button className="lg:hidden">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold tracking-tight">
            College Placement Cell
          </h1>
        </div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.name}
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
