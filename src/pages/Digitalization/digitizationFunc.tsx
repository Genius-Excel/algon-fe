import { useState } from "react";
import { DigitizationFlowDesign } from "./digitizationDesign";
import { toast } from "sonner";
import { useFileUpload } from "../../hooks/useFileUpload";
import type { NavigationProps, DigitizationFormData } from "../../Types/types";
import { validateNIN, validateEmail, validatePhone } from "../../utils/validation";

export function DigitizationFlow({ onNavigate }: NavigationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const [formData, setFormData] = useState<DigitizationFormData>({
    nin: "",
    email: "",
    phone: "",
    lga: "",
    certificateRef: "",
    paymentMethod: "",
    profilePhoto: null,
    ninSlip: null
  });

  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use custom file upload hooks
  const profilePhoto = useFileUpload({
    maxSizeMB: 2,
    allowedTypes: ['image/jpeg', 'image/png'],
    onUpload: (file) => setFormData({ ...formData, profilePhoto: file })
  });

  const ninSlip = useFileUpload({
    maxSizeMB: 5,
    allowedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    onUpload: (file) => setFormData({ ...formData, ninSlip: file })
  });

  // Step validation
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        // Identity verification
        const ninValidation = validateNIN(formData.nin);
        if (!ninValidation.valid) {
          toast.error(ninValidation.message);
          return false;
        }

        const emailValidation = validateEmail(formData.email);
        if (!emailValidation.valid) {
          toast.error(emailValidation.message);
          return false;
        }

        const phoneValidation = validatePhone(formData.phone);
        if (!phoneValidation.valid) {
          toast.error(phoneValidation.message);
          return false;
        }

        if (!formData.lga) {
          toast.error("Please select your Local Government");
          return false;
        }

        if (!formData.profilePhoto) {
          toast.error("Please upload your profile photo");
          return false;
        }

        if (!formData.ninSlip) {
          toast.error("Please upload your NIN slip");
          return false;
        }

        return true;

      case 2:
        // Certificate upload
        if (!uploadedFile) {
          toast.error("Please upload your existing certificate");
          return false;
        }
        return true;

      case 3:
        // Payment
        if (!formData.paymentMethod) {
          toast.error("Please select a payment method");
          return false;
        }
        return true;

      case 4:
        // Confirmation - no validation needed
        return true;

      default:
        return true;
    }
  };

  // Navigation handlers
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

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);

    try {
      // Create FormData for submission
      const formDataForSubmission = new FormData();
      
      // Add fields
      Object.keys(formData).forEach(key => {
        const typedKey = key as keyof DigitizationFormData;
        const value = formData[typedKey];
        
        if (typedKey === 'profilePhoto' && value) {
          formDataForSubmission.append('profile_photo', value as File);
        } else if (typedKey === 'ninSlip' && value) {
          formDataForSubmission.append('nin_slip', value as File);
        } else if (value !== null && typedKey !== 'profilePhoto' && typedKey !== 'ninSlip') {
          formDataForSubmission.append(typedKey, value as string);
        }
      });

      // Mock API call - replace with actual endpoint
      // const response = await fetch('/api/digitization/', {
      //   method: 'POST',
      //   body: formDataForSubmission,
      // });

      // Mock success
      toast.success("Digitization request submitted successfully!");
      setTimeout(() => {
        onNavigate('applicant-dashboard');
      }, 1500);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel? All entered data will be lost.")) {
      onNavigate('applicant-dashboard');
    }
  };

  return (
    <DigitizationFlowDesign
      currentStep={currentStep}
      totalSteps={totalSteps}
      progress={progress}
      formData={formData}
      setFormData={setFormData}
      photoPreview={profilePhoto.preview}
      ninSlipPreview={ninSlip.preview}
      uploadedFile={uploadedFile}
      setUploadedFile={setUploadedFile}
      handlePhotoUpload={profilePhoto.handleUpload}
      removePhoto={() => profilePhoto.remove('profile-photo')}
      handleNinSlipUpload={ninSlip.handleUpload}
      removeNinSlip={() => ninSlip.remove('nin-slip')}
      handleNext={handleNext}
      handleBack={handleBack}
      handleSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
}