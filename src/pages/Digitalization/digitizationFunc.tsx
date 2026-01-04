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
import { digitizationService, paymentService } from "../../services";
import { useFileUploadEnhanced } from "../../hooks/useFileUploadEnhanced";

export function DigitizationFlow() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const [formData, setFormData] = useState<DigitizationFormData>({
    nin: "",
    email: "",
    phone: "",
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
      const result = await paymentService.initializePayment({
        email: formData.email,
        amount: DIGITIZATION_AMOUNT,
        metadata: {
          nin: formData.nin,
          lga: formData.lga,
          serviceType: "digitization",
        },
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
        toast.error("Failed to initialize payment");
      }
    } catch (error: any) {
      console.error("Payment initialization error:", error);
      toast.error("Failed to initialize payment. Please try again.");
    } finally {
      setIsInitializingPayment(false);
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
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

      toast.success("Payment verified!");

      const result = await digitizationService.submitDigitization({
        ...formData,
        certificateFile: certificateUpload.file as File,
        paymentReference,
      });

      console.log("Digitization submitted:", result);

      toast.success("Digitization request submitted successfully!");

      setTimeout(() => {
        navigate("/applicant-dashboard");
      }, 1500);
    } catch (error: any) {
      console.error("Submission error:", error);

      const errors = error.response?.data;

      if (typeof errors === "object" && errors !== null) {
        const firstError = Object.values(errors)[0];
        if (Array.isArray(firstError)) {
          toast.error(firstError[0]);
        } else {
          toast.error(errors.message || "Failed to submit request");
        }
      } else {
        toast.error("Failed to submit request. Please try again.");
      }
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
