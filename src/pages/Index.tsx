
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'student'
          }
        }
      });
      
      if (error) throw error;
      
      if (data.user) {
        // Update additional profile details
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            department,
            year
          })
          .eq('id', data.user.id);
        
        if (profileError) throw profileError;
      }
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created. You can now log in.",
      });
      setIsSignUp(false);
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast({
        title: "Registration Failed",
        description: error.message || "There was an error creating your account.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 bg-cover bg-center"
      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80")', }}
    >
      <div className="w-full max-w-md space-y-8 bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900">
            College Placement Cell
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            {isSignUp ? 'Sign up to create your account' : 'Sign in to access placement opportunities and resources'}
          </p>
        </div>

        {isSignUp ? (
          <form onSubmit={handleSignUp} className="mt-8 space-y-4">
            <div className="space-y-4">
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium text-zinc-700"
                >
                  Full Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="Your full name"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-zinc-700"
                >
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label
                  htmlFor="department"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Department
                </label>
                <Input
                  id="department"
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="mt-1"
                  placeholder="e.g. Computer Science"
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <label
                  htmlFor="year"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Year
                </label>
                <Input
                  id="year"
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="mt-1"
                  placeholder="e.g. 3rd Year"
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
            
            <div className="text-center">
              <Button 
                variant="link" 
                onClick={() => setIsSignUp(false)}
                className="text-sm"
                disabled={isLoading}
              >
                Already have an account? Sign in
              </Button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <div className="space-y-4">
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-zinc-700"
                >
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Password
                </label>
                <Input
                  id="password"
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
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
            
            <div className="flex flex-col space-y-2 text-center">
              <Button 
                variant="link" 
                onClick={() => setIsSignUp(true)}
                className="text-sm"
                disabled={isLoading}
              >
                Don't have an account? Sign up
              </Button>
              
              <Button 
                variant="link" 
                onClick={() => navigate('/admin')}
                className="text-sm"
                disabled={isLoading}
              >
                Admin Login
              </Button>
            </div>
            
            <div className="mt-4 text-center text-xs text-zinc-500">
              <p>Sign up to create a new account or use the login for testing</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Index;
