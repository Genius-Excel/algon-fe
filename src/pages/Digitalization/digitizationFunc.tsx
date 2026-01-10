import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DigitizationFlowDesign } from "./digitizationDesign";
import { toast } from "sonner";
import type { DigitizationFormData } from "../../Types/types";
import {
  validateNIN,
  validateEmail,
  validatePhone,
} from "../../utils/validation";
import {
  digitizationService,
  paymentService,
  applicationService,
} from "../../services";
import { useFileUploadEnhanced } from "../../hooks/useFileUploadEnhanced";

export function DigitizationFlow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

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

  // Fixed amount for digitization
  const DIGITIZATION_AMOUNT = 2300;

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

  const certificateUpload = useFileUploadEnhanced({
    maxSizeMB: 5,
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
      // First, submit the digitization application to get application_id
      const submitResult = await digitizationService.submitDigitization({
        ...formData,
        full_name: formData.full_name,
        state: formData.state,
        certificateFile: certificateUpload.file as File,
      });

      const applicationId = submitResult.data?.user_data?.id;
      if (!applicationId) {
        throw new Error("Failed to get application ID");
      }

      toast.success("Application submitted! Initiating payment...");

      // Verify NIN information (non-blocking)
      try {
        const ninResult = await applicationService.verifyNIN(
          applicationId,
          "digitization"
        );
        if (ninResult.message.toLowerCase().includes("success")) {
          console.log("NIN verified for digitization");
        }
      } catch (ninError: any) {
        console.warn("NIN verification warning:", ninError);
      }

      // Now initiate payment with the application_id
      const result = await applicationService.initiatePayment({
        payment_type: "digitization",
        application_id: applicationId,
        amount: DIGITIZATION_AMOUNT,
      });

      if (result.status) {
        setPaymentReference(result.data.reference);

        window.open(
          result.data.authorization_url,
          "Paystack Payment",
          "width=500,height=700,left=200,top=100"
        );

        toast.success("Payment window opened! Complete payment to continue.");

        setCurrentStep(4);
      } else {
        toast.error(result.message || "Failed to initialize payment");
      }
    } catch (error: any) {
      console.error("Payment initialization error:", error);

      const status = error.response?.status;
      const errorData = error.response?.data;

      // Handle specific HTTP status codes per API spec
      if (status === 400) {
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
      digitizationAmount={DIGITIZATION_AMOUNT}
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
