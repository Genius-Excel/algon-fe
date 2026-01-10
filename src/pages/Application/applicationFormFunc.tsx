import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ApplicationFormDesign } from "./applicationFormDesign";
import { toast } from "sonner";
import type { ApplicationFormData } from "../../Types/types";
import { validateApplicationForm } from "../../utils/validation";
import { applicationService, adminService } from "../../services";
import { useFileUploadEnhanced } from "../../hooks/useFileUploadEnhanced";

export function ApplicationForm() {
  const navigate = useNavigate();
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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string>("");
  const [applicationId, setApplicationId] = useState<string>("");
  const [certificateAmount, setCertificateAmount] = useState<number>(0);

  // States and LGAs
  const [states, setStates] = useState<any[]>([]);
  const [availableLGAs, setAvailableLGAs] = useState<any[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);

  // Load states on mount
  useEffect(() => {
    loadStates();
  }, []);

  // Update available LGAs when state changes
  useEffect(() => {
    if (formData.state) {
      const selectedState = states.find((s) => s.id === formData.state);
      setAvailableLGAs(selectedState?.local_governtments || []);
    } else {
      setAvailableLGAs([]);
    }
  }, [formData.state, states]);

  const loadStates = async () => {
    setLoadingStates(true);
    try {
      const response = await adminService.getAllStatesAndLGs();
      // Handle paginated response: { data: { count, results: [...] } }
      const statesData = Array.isArray(response)
        ? response
        : response?.data?.results || response?.data || [];

      console.log("Loaded states:", statesData.length, "states");
      setStates(statesData);
    } catch (error: any) {
      console.error("Failed to load states:", error);
      toast.error("Failed to load states. Please refresh the page.");
    } finally {
      setLoadingStates(false);
    }
  };

  // File upload hooks
  const profilePhoto = useFileUploadEnhanced({
    maxSizeMB: 2,
    allowedTypes: ["image/jpeg", "image/png"],
    compressImages: true,
    onUpload: (file) => setFormData({ ...formData, profilePhoto: file }),
  });

  const ninSlip = useFileUploadEnhanced({
    maxSizeMB: 5,
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
    compressImages: true,
    onUpload: (file) => setFormData({ ...formData, ninSlip: file }),
  });

  // Validate step 1 and move to next step (no API submission yet)
  const handleStep1Next = () => {
    if (!validateCurrentStep()) return;

    // Validate state/LGA selection
    const selectedState = states.find((s) => s.id === formData.state);
    const lgasForState = selectedState?.local_governtments || [];
    const selectedLga = lgasForState.find((l: any) => l.id === formData.lga);

    if (!selectedState || !selectedLga) {
      toast.error("Please select a valid State and Local Government");
      return;
    }

    setCurrentStep(2);
  };

  // Validate step 2 and move to next step (no API submission yet)
  const handleStep2Next = () => {
    if (!validateCurrentStep()) return;
    setCurrentStep(3);
  };

  // Submit application and initialize payment when clicking "Proceed to Payment"
  const handleProceedToPayment = async () => {
    setIsInitializingPayment(true);

    try {
      // Step 1: Submit application with personal info and documents
      const selectedState = states.find((s) => s.id === formData.state);
      const lgasForState = selectedState?.local_governtments || [];
      const selectedLga = lgasForState.find((l: any) => l.id === formData.lga);

      if (!selectedState || !selectedLga) {
        toast.error("Please select a valid State and Local Government");
        setIsInitializingPayment(false);
        return;
      }

      const stateName = selectedState.name;
      const lgaName = selectedLga.name;

      const step1Response =
        await applicationService.submitCertificateApplication({
          date_of_birth: formData.dob,
          email: formData.email,
          full_name: formData.fullName,
          landmark: formData.landmark,
          local_government: lgaName,
          phone_number: formData.phone,
          state: stateName,
          village: formData.village,
          nin: formData.nin,
          nin_slip: ninSlip.file || undefined,
          profile_photo: profilePhoto.file || undefined,
        });

      const appId = step1Response.data.application_id;
      setApplicationId(appId);

      // Step 2: Update application with address and additional info
      const step2Response = await applicationService.updateApplicationStep2(
        appId,
        {
          residential_address: formData.address,
          landmark: formData.landmark,
        }
      );

      // Set the fee amount from response
      const fee = step2Response.data.fee.application_fee || 0;
      setCertificateAmount(fee);

      // Verify NIN information (non-blocking)
      try {
        const ninResult = await applicationService.verifyNIN(
          appId,
          "certificate"
        );
        if (ninResult.message.toLowerCase().includes("success")) {
          toast.success("NIN verified successfully!");
        } else {
          toast.warning(ninResult.message || "NIN verification pending");
        }
      } catch (ninError: any) {
        console.warn("NIN verification warning:", ninError);
        const status = ninError.response?.status;
        const errorMessage = ninError.response?.data?.message;

        // Handle specific error codes per API spec
        if (status === 400) {
          toast.warning(errorMessage || "Invalid verification request");
        } else if (status === 401 || status === 403) {
          toast.error("Authentication failed. Please log in again.");
        } else if (status === 404) {
          toast.warning("Application not found for NIN verification");
        } else {
          toast.warning(errorMessage || "NIN verification pending");
        }
      }

      // Step 3: Initialize payment
      const result = await applicationService.initiatePayment({
        payment_type: "certificate",
        application_id: appId,
        amount: fee > 0 ? fee : undefined,
      });

      if (result.status) {
        setPaymentReference(result.data.reference);

        // Open Paystack payment in a new tab (more reliable than popup)
        const paymentTab = window.open(
          result.data.authorization_url,
          "_blank",
          "noopener,noreferrer"
        );

        if (!paymentTab) {
          // If popup blocked, show error message
          toast.error(
            "Popup blocked! Please allow popups to complete payment.",
            {
              duration: 10000,
            }
          );
        } else {
          toast.success("Payment window opened! Complete payment to continue.");
        }

        // Move to review step
        setCurrentStep(4);
      } else {
        toast.error("Failed to initialize payment");
      }
    } catch (error: any) {
      console.error("Application submission error:", error);

      const status = error.response?.status;
      const errorData = error.response?.data;
      let errorMessage = "Failed to submit application. Please try again.";

      // Handle specific error status codes based on API documentation
      if (status === 400) {
        // Bad Request: Validation errors
        if (errorData?.error) {
          const errorObj = errorData.error;
          const errorMessages = Object.entries(errorObj)
            .map(([field, messages]) => {
              const msgArray = Array.isArray(messages) ? messages : [messages];
              return `${field}: ${msgArray.join(", ")}`;
            })
            .join("; ");
          errorMessage = errorMessages;
        } else {
          errorMessage =
            errorData?.message ||
            "Invalid form data. Please check your inputs.";
        }
      } else if (status === 401) {
        // Unauthorized: Invalid or missing token
        errorMessage = "Session expired. Please login again.";
        toast.error(errorMessage);
        setTimeout(() => navigate("/login"), 2000);
        return;
      } else if (status === 403) {
        // Forbidden: Not permitted to apply
        errorMessage = "You do not have permission to submit applications.";
      } else if (status === 409) {
        // Conflict: Duplicate application
        errorMessage =
          "An application with this NIN and email already exists. Please check your previous applications.";
      } else if (status === 422) {
        // Unprocessable Entity: Validation errors
        if (errorData?.error) {
          const errorObj = errorData.error;
          const errorMessages = Object.entries(errorObj)
            .map(([field, messages]) => {
              const msgArray = Array.isArray(messages) ? messages : [messages];
              return `${field}: ${msgArray.join(", ")}`;
            })
            .join("; ");
          errorMessage = errorMessages;
        } else {
          errorMessage =
            errorData?.message ||
            "Validation failed. Please review your information.";
        }
      } else if (status === 429) {
        // Too Many Requests: Rate limit
        errorMessage = "Too many application attempts. Please try again later.";
      } else if (status === 500) {
        // Internal Server Error
        errorMessage = "Server error. Please try again in a few moments.";
      } else if (errorData?.error) {
        // Generic error object handling
        const errorObj = errorData.error;
        if (typeof errorObj === "string") {
          errorMessage = errorObj;
        } else {
          const errorMessages = Object.entries(errorObj)
            .map(([field, messages]) => {
              const msgArray = Array.isArray(messages) ? messages : [messages];
              return `${field}: ${msgArray.join(", ")}`;
            })
            .join("; ");
          errorMessage = errorMessages;
        }
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsInitializingPayment(false);
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
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

        if (!profilePhoto.file) {
          toast.error("Please upload a profile photo");
          return false;
        }

        if (!ninSlip.file) {
          toast.error("Please upload your NIN slip");
          return false;
        }

        return true;

      case 2:
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
        return true;

      case 4:
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep === 1) {
      handleStep1Next();
    } else if (currentStep === 2) {
      handleStep2Next();
    } else if (validateCurrentStep()) {
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

  // Final submission - just navigate since payment was already completed
  const handleSubmit = async () => {
    if (!paymentReference) {
      toast.error("Please complete payment first");
      return;
    }

    toast.success("Application submitted successfully!");
    setTimeout(() => {
      navigate("/applicant-dashboard");
    }, 1500);
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <ApplicationFormDesign
      currentStep={currentStep}
      totalSteps={totalSteps}
      progress={progress}
      formData={formData}
      setFormData={setFormData}
      states={states}
      availableLGAs={availableLGAs}
      loadingStates={loadingStates}
      photoPreview={profilePhoto.preview}
      photoFile={profilePhoto.file}
      photoUploading={profilePhoto.isUploading}
      photoProgress={profilePhoto.uploadProgress}
      photoError={profilePhoto.error}
      handlePhotoUpload={profilePhoto.handleUpload}
      removePhoto={() => profilePhoto.remove()}
      ninSlipPreview={ninSlip.preview}
      ninSlipFile={ninSlip.file}
      ninSlipUploading={ninSlip.isUploading}
      ninSlipProgress={ninSlip.uploadProgress}
      ninSlipError={ninSlip.error}
      handleNinSlipUpload={ninSlip.handleUpload}
      removeNinSlip={() => ninSlip.remove()}
      certificateAmount={certificateAmount || 5500}
      paymentReference={paymentReference}
      isInitializingPayment={isInitializingPayment}
      handleProceedToPayment={handleProceedToPayment}
      handleNext={handleNext}
      handleBack={handleBack}
      handleSubmit={handleSubmit}
      onCancel={handleCancel}
      isSubmitting={isSubmitting}
    />
  );
}
