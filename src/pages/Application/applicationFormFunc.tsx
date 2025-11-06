import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ApplicationFormDesign } from "./applicationFormDesign";
import { toast } from "sonner";
import type { ApplicationFormData } from "../../Types/types";
import { validateApplicationForm } from "../../utils/validation";
import { applicationService, paymentService } from "../../services";
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

  // Fixed amount for new certificate
  const CERTIFICATE_AMOUNT = 5500;

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

  // Initialize payment when clicking "Proceed to Payment"
  const handleProceedToPayment = async () => {
    if (!validateCurrentStep()) return;

    setIsInitializingPayment(true);

    try {
      // Call backend to initialize payment
      const result = await paymentService.initializePayment({
        email: formData.email,
        amount: CERTIFICATE_AMOUNT,
        metadata: {
          applicantName: formData.fullName,
          nin: formData.nin,
          lga: formData.lga,
          state: formData.state,
          serviceType: "application",
        },
      });

      if (result.status) {
        setPaymentReference(result.data.reference);

        // Open Paystack in new window
        const paymentWindow = window.open(
          result.data.authorization_url,
          "Paystack Payment",
          "width=500,height=700,left=200,top=100"
        );

        toast.success("Payment window opened! Complete payment to continue.");

        // Move to review step
        setCurrentStep(4);

        // Optional: Poll for payment verification
        if (paymentWindow) {
          const pollTimer = setInterval(() => {
            if (paymentWindow.closed) {
              clearInterval(pollTimer);
              toast.info(
                "Payment window closed. Please verify your payment status."
              );
            }
          }, 1000);
        }
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

  // Verify payment before submission
  const handleSubmit = async () => {
    if (!paymentReference) {
      toast.error("Please complete payment first");
      return;
    }

    setIsSubmitting(true);

    try {
      // Verify payment first
      const verification = await paymentService.verifyPayment(paymentReference);

      if (verification.status !== "success") {
        toast.error("Payment not verified. Please complete payment first.");
        setIsSubmitting(false);
        return;
      }

      toast.success("Payment verified!");

      // Submit application
      const submissionData = {
        ...formData,
        paymentReference,
      };

      const result = await applicationService.submitApplication(submissionData);

      console.log("Application submitted:", result);

      toast.success("Application submitted successfully!");

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
          toast.error(errors.message || "Failed to submit application");
        }
      } else {
        toast.error("Failed to submit application. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
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
      certificateAmount={CERTIFICATE_AMOUNT}
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
