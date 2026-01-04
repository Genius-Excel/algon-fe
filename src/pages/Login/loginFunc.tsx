import { useState } from 'react';
import { LoginDesign } from './loginDesign';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';

export function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      // ✅ AuthContext handles ALL navigation
      await login(email, password);
      
      toast.success('Login successful!');
      
      // ❌ REMOVED: No manual navigation - AuthContext does it
    } catch (error: any) {
      console.error('Login error:', error);
      
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.detail 
        || 'Login failed. Please check your credentials.';
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginDesign
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      handleLogin={handleLogin}
      isLoading={isLoading}
    />
  );
}