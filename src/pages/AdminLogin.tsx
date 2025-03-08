
import { useState } from 'react';
import AdminAuthContainer from '@/components/admin/AdminAuthContainer';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import AdminSignUpForm from '@/components/admin/AdminSignUpForm';

const AdminLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AdminAuthContainer 
      title="Admin Portal"
      subtitle={isSignUp ? 'Create a new admin account' : 'Sign in to access the college placement administration'}
      backgroundImage="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80"
    >
      {isSignUp ? (
        <AdminSignUpForm 
          isLoading={isLoading}
          error={error}
          setError={setError}
          setIsLoading={setIsLoading}
          setIsSignUp={setIsSignUp}
        />
      ) : (
        <AdminLoginForm 
          isLoading={isLoading}
          error={error}
          setError={setError}
          setIsLoading={setIsLoading}
          setIsSignUp={setIsSignUp}
        />
      )}
    </AdminAuthContainer>
  );
};

export default AdminLogin;
