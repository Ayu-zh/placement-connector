
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, User, Mail, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AdminSignUpFormProps {
  isLoading: boolean;
  error: string;
  setError: (error: string) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsSignUp: (isSignUp: boolean) => void;
}

const AdminSignUpForm = ({ 
  isLoading, 
  error, 
  setError, 
  setIsLoading, 
  setIsSignUp 
}: AdminSignUpFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

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
    <>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleAdminSignUp} className="mt-8 space-y-4">
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="admin-name" 
              className="block text-sm font-medium text-zinc-700"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                id="admin-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="pl-10"
                placeholder="Admin Name"
                disabled={isLoading}
              />
            </div>
          </div>
          
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
              Password
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
    </>
  );
};

export default AdminSignUpForm;
