// src/pages/Login/LoginFunc.tsx
import { useState } from 'react';
import { LoginDesign } from './loginDesign';
import type { NavigationProps, UserRole } from '../../Types/types';

export function Login({ onNavigate }: NavigationProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (userType: UserRole) => {
    // Mock login - redirect to appropriate dashboard
    if (userType === 'applicant') {
      onNavigate('applicant-dashboard');
    } else if (userType === 'lg-admin') {
      onNavigate('lg-admin-dashboard');
    } else if (userType === 'super-admin') {
      onNavigate('super-admin-dashboard');
    }
  };

  return (
    <LoginDesign
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      handleLogin={handleLogin}
      onNavigate={onNavigate}
    />
  );
}