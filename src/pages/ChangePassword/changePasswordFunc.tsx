import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChangePasswordDesign } from "./changePasswordDesign";
import { toast } from "sonner";
import authService from "../../services/auth.service";

export function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [changeSuccess, setChangeSuccess] = useState(false);

  const handleSubmit = async () => {
    // Client-side validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    // Validate new password and confirm password match
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    // Validate new password length
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }

    // Validate password complexity
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "New password must include uppercase, lowercase, numbers, and special characters"
      );
      return;
    }

    // Check if new password is different from current
    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.changePassword(
        currentPassword,
        newPassword,
        confirmPassword
      );

      toast.success(response.message || "Password changed successfully!");
      setChangeSuccess(true);

      // Clear form
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate(-1); // Go back to previous page
      }, 2000);
    } catch (error: any) {
      console.error("Password change error:", error);

      const status = error.response?.status;
      const errorData = error.response?.data;
      let errorMessage = "Failed to change password. Please try again.";

      // Handle specific error status codes based on API documentation
      if (status === 400) {
        if (errorData?.error === "Current password is incorrect") {
          errorMessage = "Current password is incorrect";
        } else if (errorData?.error === "New passwords do not match") {
          errorMessage = "New passwords do not match";
        } else if (errorData?.error) {
          errorMessage = errorData.error;
        } else if (errorData?.message) {
          errorMessage = errorData.message;
        } else {
          errorMessage = "Invalid input. Please check your passwords.";
        }
      } else if (status === 401) {
        errorMessage = "Session expired. Please login again.";
        toast.error(errorMessage);
        setTimeout(() => navigate("/login"), 2000);
        return;
      } else if (status === 403) {
        errorMessage = "You do not have permission to change password.";
      } else if (status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (errorData?.detail) {
        errorMessage = errorData.detail;
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
    <ChangePasswordDesign
      currentPassword={currentPassword}
      setCurrentPassword={setCurrentPassword}
      newPassword={newPassword}
      setNewPassword={setNewPassword}
      confirmPassword={confirmPassword}
      setConfirmPassword={setConfirmPassword}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      changeSuccess={changeSuccess}
    />
  );
}
