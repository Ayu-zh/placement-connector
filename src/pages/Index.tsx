
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import LoginForm from '@/components/auth/LoginForm';
import SignUpForm from '@/components/auth/SignUpForm';
import AuthContainer from '@/components/auth/AuthContainer';

const Index = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div 
      className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 bg-cover bg-center"
      style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80")', }}
    >
      <AuthContainer 
        title="College Placement Cell"
        subtitle={isSignUp ? 'Sign up to create your account' : 'Sign in to access placement opportunities and resources'}
      >
        {isSignUp ? (
          <>
            <SignUpForm onSuccess={() => setIsSignUp(false)} />
            <div className="text-center">
              <Button 
                variant="link" 
                onClick={() => setIsSignUp(false)}
                className="text-sm"
              >
                Already have an account? Sign in
              </Button>
            </div>
          </>
        ) : (
          <>
            <LoginForm />
            <div className="flex flex-col space-y-2 text-center">
              <Button 
                variant="link" 
                onClick={() => setIsSignUp(true)}
                className="text-sm"
              >
                Don't have an account? Sign up
              </Button>
              
              <Button 
                variant="link" 
                onClick={() => navigate('/admin')}
                className="text-sm"
              >
                Admin Login
              </Button>
            </div>
            
            <div className="mt-4 text-center text-xs text-zinc-500">
              <p>Sign up to create a new account or use the login for testing</p>
            </div>
          </>
        )}
      </AuthContainer>
    </div>
  );
};

export default Index;
