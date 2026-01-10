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

      const status = error.response?.status;
      const errorData = error.response?.data;
      let errorMessage = "Failed to reset password. Please try again.";

      // Handle specific error status codes based on API documentation
      if (status === 400) {
        // Validation error - check for field-specific errors
        if (errorData?.email) {
          errorMessage = `Email: ${
            Array.isArray(errorData.email)
              ? errorData.email[0]
              : errorData.email
          }`;
        } else if (errorData?.password1) {
          errorMessage = `Password: ${
            Array.isArray(errorData.password1)
              ? errorData.password1[0]
              : errorData.password1
          }`;
        } else if (errorData?.password2) {
          errorMessage = `Confirm Password: ${
            Array.isArray(errorData.password2)
              ? errorData.password2[0]
              : errorData.password2
          }`;
        } else {
          errorMessage =
            errorData?.message || "Validation error. Please check your input.";
        }
      } else if (status === 401) {
        // Invalid or expired token
        errorMessage =
          "Invalid or expired reset token. Please request a new password reset.";
        toast.error(errorMessage);
        setTimeout(() => navigate("/forgot-password"), 2000);
        return;
      } else if (status === 404) {
        // Email not found
        errorMessage = "Email address not found. Please check and try again.";
      } else if (status === 429) {
        // Rate limited
        errorMessage = "Too many reset attempts. Please try again later.";
      } else if (status === 500) {
        // Server error
        errorMessage = "Server error. Please try again in a few moments.";
      } else if (errorData?.token) {
        // Token-specific error
        errorMessage =
          "Invalid or expired reset token. Please request a new password reset.";
        toast.error(errorMessage);
        setTimeout(() => navigate("/forgot-password"), 2000);
        return;
      } else if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
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
