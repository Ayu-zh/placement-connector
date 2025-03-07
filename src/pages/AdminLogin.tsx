
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const success = await adminLogin(email, password);
      if (success) {
        toast({
          title: "Admin Login Successful",
          description: "Welcome to the admin dashboard",
        });
        navigate('/admin/dashboard');
      } else {
        setError('Invalid admin credentials or account is not an admin');
      }
    } catch (error: any) {
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Create admin user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'admin'
          }
        }
      });
      
      if (error) throw error;
      
      toast({
        title: "Admin Account Created",
        description: "You can now log in with your admin credentials.",
      });
      setIsSignUp(false);
    } catch (error: any) {
      setError(error.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 bg-cover bg-center"
      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80")', }}
    >
      <div className="w-full max-w-md space-y-8 bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
            Admin Portal
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            {isSignUp ? 'Create a new admin account' : 'Sign in to access the college placement administration'}
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isSignUp ? (
          <form onSubmit={handleAdminSignUp} className="mt-8 space-y-4">
            <div className="space-y-4">
              <div>
                <label 
                  htmlFor="admin-name" 
                  className="block text-sm font-medium text-zinc-700"
                >
                  Full Name
                </label>
                <Input
                  id="admin-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Admin Name"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label 
                  htmlFor="admin-email" 
                  className="block text-sm font-medium text-zinc-700"
                >
                  Admin Email
                </label>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="admin@example.com"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Password
                </label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Admin Account'}
            </Button>
            
            <div className="text-center">
              <Button 
                variant="link" 
                onClick={() => setIsSignUp(false)}
                className="text-sm"
                disabled={isLoading}
              >
                Already have an admin account? Sign in
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAdminLogin} className="mt-8 space-y-4">
            <div className="space-y-4">
              <div>
                <label 
                  htmlFor="admin-email" 
                  className="block text-sm font-medium text-zinc-700"
                >
                  Admin Email
                </label>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="admin@example.com"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Admin Password
                </label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in as Admin'}
            </Button>

            <div className="flex justify-between items-center text-center mt-4">
              <Button 
                variant="link" 
                onClick={() => setIsSignUp(true)}
                className="text-sm"
                disabled={isLoading}
              >
                Create Admin Account
              </Button>
              
              <Button 
                variant="link" 
                onClick={() => navigate('/')}
                className="text-sm"
                disabled={isLoading}
              >
                Back to Student Login
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
