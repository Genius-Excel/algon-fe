import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminOnboardingDesign } from './adminOnboardDesign';
import { toast } from 'sonner';
import type { OnboardingFormData } from '../../Types/types';

export function AdminOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const [formData, setFormData] = useState<OnboardingFormData>({
    fullName: "",
    email: "admin@example.com",
    phone: "",
    password: "",
    confirmPassword: "",
    state: "",
    localGovernment: "",
    permissions: {
      approveApplications: false,
      manageFees: false,
      manageRequirements: false,
      viewAnalytics: false,
      exportData: false
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.fullName || !formData.phone || !formData.password || !formData.confirmPassword) {
          toast.error("Please fill in all required fields");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return false;
        }
        if (formData.password.length < 8) {
          toast.error("Password must be at least 8 characters");
          return false;
        }
        return true;
      case 2:
        if (!formData.state || !formData.localGovernment) {
          toast.error("Please select both state and local government");
          return false;
        }
        return true;
      case 3:
        const hasPermissions = Object.values(formData.permissions).some(p => p);
        if (!hasPermissions) {
          toast.error("Please select at least one permission");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/admin/onboarding/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Admin Onboarding Completed Successfully");
        setTimeout(() => {
          navigate('/lg-admin-dashboard');
        }, 1500);
      } else {
        throw new Error('Failed to complete onboarding');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error("Failed to complete onboarding. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <AdminOnboardingDesign
      currentStep={currentStep}
      totalSteps={totalSteps}
      progress={progress}
      formData={formData}
      setFormData={setFormData}
      handleNext={handleNext}
      handleBack={handleBack}
      handleSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onCancel={handleCancel}
    />
  );
}