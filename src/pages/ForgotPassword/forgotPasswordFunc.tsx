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

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.sendPasswordResetEmail(email, "web");

      toast.success(response.message || "Password reset email sent!");
      setEmailSent(true);
    } catch (error: any) {
      console.error("Password reset error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to send reset email. Please try again.";

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
