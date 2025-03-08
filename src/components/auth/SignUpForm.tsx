
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';

interface SignUpFormProps {
  onSuccess: () => void;
}

const SignUpForm = ({ onSuccess }: SignUpFormProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      onSuccess();
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
    </form>
  );
};

export default SignUpForm;
