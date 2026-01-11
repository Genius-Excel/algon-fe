import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DigitizationFlowDesign } from "./digitizationDesign";
import { toast } from "sonner";
import type { DigitizationFormData, StateWithLGAs } from "../../Types/types";
import {
  validateNIN,
  validateEmail,
  validatePhone,
} from "../../utils/validation";
import {
  digitizationService,
  paymentService,
  applicationService,
  adminService,
} from "../../services";
import { useFileUploadEnhanced } from "../../hooks/useFileUploadEnhanced";

export function DigitizationFlow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  // States and LGAs
  const [states, setStates] = useState<StateWithLGAs[]>([]);
  const [availableLGAs, setAvailableLGAs] = useState<any[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);

  const [formData, setFormData] = useState<DigitizationFormData>({
    nin: "",
    email: "",
    full_name: "",
    phone: "",
    state: "",
    lga: "",
    certificateRef: "",
    profilePhoto: null,
    ninSlip: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [paymentReference, setPaymentReference] = useState<string>("");
  const [digitizationAmount, setDigitizationAmount] = useState<number>(0);

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

  // Fetch fee when user reaches payment step (step 3)
  useEffect(() => {
    const fetchFee = async () => {
      if (currentStep === 3 && formData.lga && digitizationAmount === 0) {
        try {
          // Get selected LGA details
          const selectedState = states.find((s) => s.id === formData.state);
          const selectedLga = selectedState?.local_governtments?.find(
            (l: any) => l.id === formData.lga
          );

          if (selectedLga) {
            // Fetch fee from backend using LGA ID
            const response = await adminService.getAllLGAs({
              state: selectedState?.name,
            });

            const lgaData = response.data?.find(
              (lga: any) => lga.id === formData.lga
            );

            // Extract fee from LGA data if available
            const feeData = lgaData?.fee || lgaData?.fees;
            if (feeData?.digitization_fee) {
              const fee =
                typeof feeData.digitization_fee === "string"
                  ? parseFloat(feeData.digitization_fee)
                  : feeData.digitization_fee;
              setDigitizationAmount(fee);
              console.log("Fee loaded for payment step:", fee, "NGN");
            }
          }
        } catch (error) {
          console.warn("Could not pre-fetch fee:", error);
          // Non-critical error - fee will be fetched during payment initiation
        }
      }
    };

    fetchFee();
  }, [currentStep, formData.lga, formData.state, states, digitizationAmount]);

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
    maxSizeMB: 1,
    allowedTypes: ["image/jpeg", "image/png"],
    compressImages: true,
    onUpload: (file) => setFormData({ ...formData, profilePhoto: file }),
  });

  const ninSlip = useFileUploadEnhanced({
    maxSizeMB: 2,
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
    compressImages: true,
    onUpload: (file) => setFormData({ ...formData, ninSlip: file }),
  });

  const certificateUpload = useFileUploadEnhanced({
    maxSizeMB: 3,
    allowedTypes: ["image/jpeg", "image/png", "application/pdf"],
    compressImages: true,
    onUpload: (file) => {
      setFormData({ ...formData, certificateRef: file.name });
    },
  });

  // Initialize payment
  const handleProceedToPayment = async () => {
    if (!validateCurrentStep()) return;

    setIsInitializingPayment(true);

    try {
      // Validate total file size before submission
      const totalFileSize =
        (profilePhoto.file?.size || 0) +
        (ninSlip.file?.size || 0) +
        (certificateUpload.file?.size || 0);
      const totalSizeMB = totalFileSize / (1024 * 1024);

      if (totalSizeMB > 6) {
        toast.error(
          `Total file size (${totalSizeMB.toFixed(
            2
          )}MB) exceeds 6MB limit. Please compress or reduce file sizes.`
        );
        setIsInitializingPayment(false);
        return;
      }

      // Get selected state and LGA names
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
      const lgaId = selectedLga.id;

      console.log("Submitting digitization with:", {
        state: stateName,
        lga: lgaName,
        local_government_id: lgaId,
      });

      // First, submit the digitization application to get application_id
      const submitResult = await digitizationService.submitDigitization({
        ...formData,
        full_name: formData.full_name,
        state: stateName,
        lga: lgaName,
        local_government_id: lgaId,
        certificateFile: certificateUpload.file as File,
      });

      // Extract application ID from response - handle various backend shapes
      const responseData = submitResult?.data ?? submitResult;
      const applicationId =
        // Common shape: data.user_data.id
        responseData?.user_data?.id ??
        // Direct id on data
        responseData?.id ??
        // Nested: data.data.id
        (responseData as any)?.data?.id ??
        // Fallbacks from original object
        submitResult?.data?.user_data?.id ??
        (submitResult as any)?.data?.data?.id;

      console.log("Digitization submit response structure:", responseData);
      console.log("Extracted applicationId:", applicationId);

      if (!applicationId) {
        console.error("Submit result structure:", submitResult);
        console.error("Response data:", responseData);
        toast.error(
          "Application submitted but couldn't retrieve application ID. Please check console or contact support."
        );
        setIsInitializingPayment(false);
        return;
      }

      toast.success("Application submitted! Initiating payment...");

      // Verify NIN information (non-blocking)
      try {
        const ninResult = await applicationService.verifyNIN(
          applicationId,
          "digitization"
        );
        if (ninResult.message.toLowerCase().includes("success")) {
        }
      } catch (ninError: any) {
        console.warn("NIN verification warning:", ninError);
      }

      // Extract digitization fee from response (backend returns fee based on local government)
      const digitizationFee =
        submitResult.data?.fee?.digitization_fee ||
        submitResult.data?.digitization_fee ||
        0;

      const feeAmount =
        typeof digitizationFee === "string"
          ? parseFloat(digitizationFee)
          : digitizationFee;

      console.log("Digitization fee extracted:", feeAmount, "NGN");
      setDigitizationAmount(feeAmount);

      // Now initiate payment with the application_id (amount determined by backend from local government)
      const result = await applicationService.initiatePayment({
        payment_type: "digitization",
        application_id: applicationId,
      });

      if (result.status) {
        setPaymentReference(result.data.reference);

        // Use Paystack inline popup modal
        const handler = (window as any).PaystackPop.setup({
          key: result.data.public_key || "pk_test_xxxx", // Use public key from response or fallback
          email: formData.email,
          amount: (digitizationAmount + 500) * 100, // Convert to kobo (NGN minor unit)
          ref: result.data.reference,
          callback: function (response: any) {
            toast.success(
              "Payment successful! Reference: " + response.reference
            );
            setCurrentStep(4);
          },
          onClose: function () {
            toast.info(
              "Payment window closed. You can retry payment if needed."
            );
          },
        });

        handler.openIframe();
      } else {
        toast.error(result.message || "Failed to initialize payment");
      }
    } catch (error: any) {
      console.error("Payment initialization error:", error);

      const status = error.response?.status;
      const errorData = error.response?.data;

      // Handle specific HTTP status codes per API spec
      if (status === 413) {
        toast.error(
          "File size too large. Please reduce file sizes and try again. Total size must be under 6MB."
        );
      } else if (status === 400) {
        toast.error(
          errorData?.message ||
            "Invalid payment request. Please check all fields."
        );
      } else if (status === 401) {
        toast.error("Session expired. Please log in again.");
        setTimeout(() => navigate("/login"), 1500);
      } else if (status === 409) {
        toast.error(
          errorData?.message ||
            "Payment already initiated or application not payable."
        );
      } else if (status >= 500) {
        toast.error(
          "Server error occurred. Please try again later or contact support."
        );
      } else {
        toast.error(
          errorData?.message ||
            "Failed to initialize payment. Please try again."
        );
      }
    } finally {
      setIsInitializingPayment(false);
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.full_name || formData.full_name.trim().length < 3) {
          toast.error("Please enter your full name (minimum 3 characters)");
          return false;
        }

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

        if (!formData.state) {
          toast.error("Please select your State");
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
        if (!certificateUpload.file) {
          toast.error("Please upload your existing certificate");
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
    if (!paymentReference) {
      toast.error("Please complete payment first");
      return;
    }

    setIsSubmitting(true);

    try {
      const verification = await paymentService.verifyPayment(paymentReference);

      if (verification.status !== "success") {
        toast.error("Payment not verified. Please complete payment first.");
        setIsSubmitting(false);
        return;
      }

      toast.success(
        "Payment verified! Your digitization request has been submitted successfully."
      );

      setTimeout(() => {
        navigate("/applicant-dashboard");
      }, 1500);
    } catch (error: any) {
      console.error("Payment verification error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to verify payment. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/applicant-dashboard");
  };

  return (
    <DigitizationFlowDesign
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
      handlePhotoUpload={(e) => {
        const file = e.target.files?.[0];
        if (file) profilePhoto.handleUpload(file);
      }}
      removePhoto={() => profilePhoto.remove("profile-photo")}
      ninSlipPreview={ninSlip.preview}
      ninSlipFile={ninSlip.file}
      ninSlipUploading={ninSlip.isUploading}
      ninSlipProgress={ninSlip.uploadProgress}
      ninSlipError={ninSlip.error}
      handleNinSlipUpload={(e) => {
        const file = e.target.files?.[0];
        if (file) ninSlip.handleUpload(file);
      }}
      removeNinSlip={() => ninSlip.remove("nin-slip")}
      certificatePreview={certificateUpload.preview}
      certificateFile={certificateUpload.file}
      certificateUploading={certificateUpload.isUploading}
      certificateProgress={certificateUpload.uploadProgress}
      certificateError={certificateUpload.error}
      handleCertificateUpload={(e) => {
        const file = e.target.files?.[0];
        if (file) certificateUpload.handleUpload(file);
      }}
      removeCertificate={() => certificateUpload.remove("certificate-upload")}
      digitizationAmount={digitizationAmount}
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
