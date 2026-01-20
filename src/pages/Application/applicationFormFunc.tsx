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

  // Step 1: Submit application and move to next step
  const handleStep1Next = async () => {
    if (!validateCurrentStep()) return;

    // Validate state/LGA selection
    const selectedState = states.find((s) => s.id === formData.state);
    const lgasForState = selectedState?.local_governtments || [];
    const selectedLga = lgasForState.find((l: any) => l.id === formData.lga);

    if (!selectedState || !selectedLga) {
      toast.error("Please select a valid State and Local Government");
      return;
    }

    setIsSubmitting(true);

    try {
      const stateName = selectedState.name;
      const lgaName = selectedLga.name;

      // Submit application (Step 1 API call)
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

      toast.success("Application created successfully!");
      setCurrentStep(2);
    } catch (error: any) {
      console.error("Step 1 submission error:", error);

      const status = error.response?.status;
      const errorData = error.response?.data;
      let errorMessage = "Failed to submit application. Please try again.";

      // Handle specific error status codes
      if (status === 400 || status === 422) {
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
        errorMessage = "Session expired. Please login again.";
        toast.error(errorMessage);
        setTimeout(() => navigate("/login"), 2000);
        return;
      } else if (status === 403) {
        errorMessage = "You do not have permission to submit applications.";
      } else if (status === 409) {
        errorMessage =
          "An application with this NIN and email already exists. Please check your previous applications.";
      } else if (status === 429) {
        errorMessage = "Too many application attempts. Please try again later.";
      } else if (status === 500) {
        errorMessage = "Server error. Please try again in a few moments.";
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fetch certificate fees (called when moving to step 3)
  const fetchCertificateFees = async () => {
    if (!applicationId) {
      toast.error("Application ID not found. Please start over.");
      return false;
    }

    setIsSubmitting(true);
    try {
      // Fetch fees by calling the step 2 endpoint again
      const response = await applicationService.updateApplicationStep2(
        applicationId,
        {
          residential_address: formData.address,
          landmark: formData.landmark,
        },
      );

      const fee = response.data.fee.application_fee || 0;
      setCertificateAmount(fee);
      return true;
    } catch (error: any) {
      console.error("Failed to fetch fees:", error);
      toast.error("Failed to load payment information. Please try again.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Update application with address and move to next step
  const handleStep2Next = async () => {
    if (!validateCurrentStep()) return;

    if (!applicationId) {
      toast.error("Application ID not found. Please start over.");
      setCurrentStep(1);
      return;
    }

    setIsSubmitting(true);

    try {
      // Update application with address (Step 2 API call)
      const step2Response = await applicationService.updateApplicationStep2(
        applicationId,
        {
          residential_address: formData.address,
          landmark: formData.landmark,
        },
      );

      toast.success("Application updated successfully!");
      setCurrentStep(3);
    } catch (error: any) {
      console.error("Step 2 update error:", error);

      const status = error.response?.status;
      const errorData = error.response?.data;
      let errorMessage = "Failed to update application. Please try again.";

      if (status === 400 || status === 422) {
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
          errorMessage = errorData?.message || "Invalid data provided.";
        }
      } else if (status === 401) {
        errorMessage = "Session expired. Please login again.";
        toast.error(errorMessage);
        setTimeout(() => navigate("/login"), 2000);
        return;
      } else if (status === 404) {
        errorMessage = "Application not found. Please start over.";
      } else if (status === 500) {
        errorMessage = "Server error. Please try again in a few moments.";
      }

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Verify NIN and initialize payment when clicking "Proceed to Payment"
  const handleProceedToPayment = async () => {
    if (!applicationId) {
      toast.error("Application ID not found. Please start over.");
      setCurrentStep(1);
      return;
    }

    setIsInitializingPayment(true);

    try {
      // Step 3: Verify NIN information BEFORE payment (blocking operation)
      try {
        const ninResult = await applicationService.verifyNIN(
          applicationId,
          "certificate",
        );
        if (ninResult.message.toLowerCase().includes("success")) {
          toast.success("NIN verified successfully!");
        } else {
          toast.warning(ninResult.message || "NIN verification pending");
        }
      } catch (ninError: any) {
        console.warn("NIN verification error:", ninError);
        const status = ninError.response?.status;
        const errorMessage = ninError.response?.data?.message;

        // Handle specific error codes per API spec
        if (status === 400) {
          toast.error(errorMessage || "Invalid verification request");
          setIsInitializingPayment(false);
          return;
        } else if (status === 401 || status === 403) {
          toast.error("Authentication failed. Please log in again.");
          setIsInitializingPayment(false);
          return;
        } else if (status === 404) {
          toast.error("Application not found for NIN verification");
          setIsInitializingPayment(false);
          return;
        } else {
          toast.error(errorMessage || "NIN verification failed");
          setIsInitializingPayment(false);
          return;
        }
      }

      // Step 4: Initialize payment (after successful NIN verification)
      const result = await applicationService.initiatePayment({
        payment_type: "certificate",
        application_id: applicationId,
      });

      if (!result.data.status) {
        toast.error("Failed to initialize payment");
        setIsInitializingPayment(false);
        return;
      }

      setPaymentReference(result.data.data.reference);

      const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

      if (!paystackKey || !(window as any).PaystackPop) {
        toast.error("Payment service unavailable. Please contact support.");
        setIsInitializingPayment(false);
        return;
      }

      const handler = (window as any).PaystackPop.setup({
        key: paystackKey,
        access_code: result.data.data.access_code,
        callback: (response: any) => {
          setPaymentReference(response.reference);
          toast.success("Payment successful!");
          setCurrentStep(4);
        },
        onClose: () => {
          toast.info("Payment cancelled");
        },
      });

      handler.openIframe();
    } catch (error: any) {
      console.error("Payment initialization error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to initialize payment. Please try again.";
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

  const handleNext = async () => {
    if (currentStep === 1) {
      handleStep1Next();
    } else if (currentStep === 2) {
      handleStep2Next();
    } else if (currentStep === 3) {
      // Fetch fees before showing payment section
      const feesLoaded = await fetchCertificateFees();
      if (feesLoaded && validateCurrentStep()) {
        // Fees are loaded, payment section is ready
      }
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
    navigate("/applicant-dashboard");
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
