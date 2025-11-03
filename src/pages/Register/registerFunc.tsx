// src/pages/Register/RegisterFunc.tsx
import { useState } from 'react';
import { RegisterDesign } from './registerDesign';
import type { NavigationProps } from '../../Types/types';

interface RegisterFormData {
  nin: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export function Register({ onNavigate }: NavigationProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    nin: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const handleSubmit = () => {
    // Validation would go here
    if (!formData.nin || !formData.email || !formData.phone || !formData.password) {
      alert('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (formData.nin.length !== 11) {
      alert('NIN must be 11 digits');
      return;
    }

    // Mock registration - redirect to application form
    onNavigate('application-form');
  };

  return (
    <RegisterDesign
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleSubmit}
      onNavigate={onNavigate}
    />
  );
}