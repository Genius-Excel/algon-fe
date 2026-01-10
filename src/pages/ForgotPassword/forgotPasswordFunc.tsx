import { useState } from "react";
import { ForgotPasswordDesign } from "./forgotPasswordDesign";
import { toast } from "sonner";
import authService from "../../services/auth.service";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.sendPasswordResetEmail(email, "web");

      // Display success message from API
      toast.success(response.message || "Password reset email sent!");

      // Show success state
      setEmailSent(true);
    } catch (error: any) {
      console.error("Password reset error:", error);

      const status = error.response?.status;
      const errorData = error.response?.data;
      let errorMessage = "Failed to send reset email. Please try again.";

      // Handle specific error status codes based on API documentation
      if (status === 400) {
        errorMessage =
          errorData?.message ||
          "Invalid email address or missing required fields.";
      } else if (status === 404) {
        errorMessage = "Email address not found. Please check and try again.";
      } else if (status === 429) {
        errorMessage = "Too many reset attempts. Please try again later.";
      } else if (status === 500) {
        errorMessage = "Server error. Please try again in a few moments.";
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ForgotPasswordDesign
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      emailSent={emailSent}
    />
  );
}
