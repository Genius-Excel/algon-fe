// src/pages/Application/applicationFormFunc.tsx
import { useState } from "react";
import { ApplicationFormDesign } from "./applicationFormDesign";
import { toast } from "sonner";
import type { NavigationProps, ApplicationFormData } from "../../Types/types";
import { validateApplicationForm, validateFile } from "../../utils/validation";

export function ApplicationForm({ onNavigate }: NavigationProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const [formData, setFormData] = useState<ApplicationFormData>({
    fullName: "",
    nin: "",
    dob: "",
    state: "",
    lga: "",
    village: "",
    phone: "",
    email: "",
    profilePhoto: null,
    ninSlip: null,
    landmark: "",
    address: "",
    paymentMethod: "",
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [ninSlipPreview, setNinSlipPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File Upload Handlers
  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, 2, ["image/jpeg", "image/png"]);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    setFormData({ ...formData, profilePhoto: file });

    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setFormData({ ...formData, profilePhoto: null });
    setPhotoPreview(null);
    const input = document.getElementById("profile-photo") as HTMLInputElement;
    if (input) input.value = "";
  };

  const handleNinSlipUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateFile(file, 5, [
      "image/jpeg",
      "image/png",
      "application/pdf",
    ]);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    setFormData({ ...formData, ninSlip: file });

    if (file.type === "application/pdf") {
      setNinSlipPreview("pdf");
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNinSlipPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeNinSlip = () => {
    setFormData({ ...formData, ninSlip: null });
    setNinSlipPreview(null);
    const input = document.getElementById("nin-slip") as HTMLInputElement;
    if (input) input.value = "";
  };

  // Step Validation
  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        // Personal details validation
        const personalValidation = validateApplicationForm({
          fullName: formData.fullName,
          nin: formData.nin,
          dob: formData.dob,
          phone: formData.phone,
          state: formData.state,
          lga: formData.lga,
          village: formData.village,
        });

        if (!personalValidation.valid) {
          toast.error(personalValidation.message);
          return false;
        }

        if (!formData.email) {
          toast.error("Email is required");
          return false;
        }

        if (!formData.profilePhoto) {
          toast.error("Please upload a profile photo");
          return false;
        }

        if (!formData.ninSlip) {
          toast.error("Please upload your NIN slip");
          return false;
        }

        return true;

      case 2:
        // Requirements validation
        if (!formData.address.trim()) {
          toast.error("Residential address is required");
          return false;
        }
        if (!formData.landmark.trim()) {
          toast.error("Landmark is required");
          return false;
        }
        return true;

      case 3:
        // Payment validation
        if (!formData.paymentMethod) {
          toast.error("Please select a payment method");
          return false;
        }
        return true;

      case 4:
        // Review step - no validation needed
        return true;

      default:
        return true;
    }
  };

  // Navigation Handlers
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
      // Create FormData for file upload
      const formDataForSubmission = new FormData();

      // Add form fields
      Object.keys(formData).forEach((key) => {
        const typedKey = key as keyof ApplicationFormData;
        const value = formData[typedKey];

        if (typedKey === "profilePhoto" && value) {
          formDataForSubmission.append("profile_photo", value as File);
        } else if (typedKey === "ninSlip" && value) {
          formDataForSubmission.append("nin_slip", value as File);
        } else if (
          value !== null &&
          typedKey !== "profilePhoto" &&
          typedKey !== "ninSlip"
        ) {
          formDataForSubmission.append(typedKey, value as string);
        }
      });

      // Mock API call - replace with actual endpoint
      // const response = await fetch('/api/applications/', {
      //   method: 'POST',
      //   body: formDataForSubmission,
      // });

      // Mock success
      toast.success("Application submitted successfully!");
      setTimeout(() => {
        onNavigate("applicant-dashboard");
      }, 1500);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel your application? All entered data will be lost."
      )
    ) {
      onNavigate("landing");
    }
  };

  return (
    <ApplicationFormDesign
      currentStep={currentStep}
      totalSteps={totalSteps}
      progress={progress}
      formData={formData}
      setFormData={setFormData}
      photoPreview={photoPreview}
      ninSlipPreview={ninSlipPreview}
      handlePhotoUpload={handlePhotoUpload}
      removePhoto={removePhoto}
      handleNinSlipUpload={handleNinSlipUpload}
      removeNinSlip={removeNinSlip}
      handleNext={handleNext}
      handleBack={handleBack}
      handleSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
}
