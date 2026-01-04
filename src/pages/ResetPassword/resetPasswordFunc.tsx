import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ResetPasswordDesign } from "./resetPasswordDesign";
import { toast } from "sonner";
import authService from "../../services/auth.service";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  useEffect(() => {
    // Check if token exists in URL
    if (!token) {
      toast.error("Invalid or missing reset token");
      setTimeout(() => navigate("/forgot-password"), 2000);
    }
  }, [token, navigate]);

  const handleSubmit = async () => {
    // Validation
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    if (!password1 || !password2) {
      toast.error("Please fill in both password fields");
      return;
    }

    if (password1 !== password2) {
      toast.error("Passwords do not match");
      return;
    }

    if (password1.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    // Check password complexity
    const hasUpperCase = /[A-Z]/.test(password1);
    const hasLowerCase = /[a-z]/.test(password1);
    const hasNumber = /[0-9]/.test(password1);
    const hasSpecialChar = /[^a-zA-Z0-9]/.test(password1);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      toast.error(
        "Password must include uppercase, lowercase, numbers, and special characters"
      );
      return;
    }

    if (!token) {
      toast.error("Reset token is missing");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword(
        email,
        password1,
        password2,
        token
      );

      toast.success(response.message || "Password reset successful!");
      setResetSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      console.error("Password reset error:", error);

      const errorData = error.response?.data;

      // Handle specific field errors
      if (errorData?.email) {
        toast.error(
          `Email: ${
            Array.isArray(errorData.email)
              ? errorData.email[0]
              : errorData.email
          }`
        );
      } else if (errorData?.password1) {
        toast.error(
          `Password: ${
            Array.isArray(errorData.password1)
              ? errorData.password1[0]
              : errorData.password1
          }`
        );
      } else if (errorData?.password2) {
        toast.error(
          `Confirm Password: ${
            Array.isArray(errorData.password2)
              ? errorData.password2[0]
              : errorData.password2
          }`
        );
      } else if (errorData?.token || error.response?.status === 401) {
        toast.error(
          "Invalid or expired reset token. Please request a new password reset."
        );
        setTimeout(() => navigate("/forgot-password"), 2000);
      } else {
        toast.error(
          errorData?.message ||
            error.message ||
            "Failed to reset password. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ResetPasswordDesign
      email={email}
      setEmail={setEmail}
      password1={password1}
      setPassword1={setPassword1}
      password2={password2}
      setPassword2={setPassword2}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      resetSuccess={resetSuccess}
    />
  );
}
