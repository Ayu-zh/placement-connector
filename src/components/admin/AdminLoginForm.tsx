
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Mail, Lock } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { defaultCredentials } from '@/integrations/supabase/client';

interface AdminLoginFormProps {
  isLoading: boolean;
  error: string;
  setError: (error: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsSignUp: (isSignUp: boolean) => void;
}

const AdminLoginForm = ({ 
  isLoading, 
  error, 
  setError, 
  setIsLoading, 
  setIsSignUp 
}: AdminLoginFormProps) => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const fillTestCredentials = () => {
    setEmail(defaultCredentials.admin.email);
    setPassword(defaultCredentials.admin.password);
  };

  return (
    <>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleAdminLogin} className="mt-8 space-y-4">
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="admin-email" 
              className="block text-sm font-medium text-zinc-700"
            >
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10"
                placeholder="admin@example.com"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="block text-sm font-medium text-zinc-700"
            >
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pl-10"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in as Admin'}
        </Button>

        <div className="text-center mt-2">
          <Button 
            type="button" 
            variant="outline" 
            size="sm"
            className="text-xs" 
            onClick={fillTestCredentials}
          >
            Fill Admin Credentials
          </Button>
        </div>

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
        
        <div className="mt-4 text-center text-xs text-zinc-500">
          <p>Admin credentials: {defaultCredentials.admin.email} / {defaultCredentials.admin.password}</p>
        </div>
      </form>
    </>
  );
};

export default AdminLoginForm;
