import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SuperAdminRegisterDesign } from "./superAdminRegisterDesign";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";

interface RegisterFormData {
  nin: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export function SuperAdminRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    nin: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // ✅ Client-side validation
    if (
      !formData.nin ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.nin.length !== 11) {
      toast.error("NIN must be 11 digits");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      // Call the register function from useAuth with correct field name
      await register({
        nin: formData.nin,
        email: formData.email,
        phone_number: formData.phone,
        password: formData.password,
        role: "super-admin", // Specify super admin role
      });

      toast.success("Super Admin account created! Please login to continue.");

      // Navigate to login page (API doesn't auto-login)
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      console.error("Registration error:", error);

      // Handle specific validation errors from backend
      const errors = error.response?.data;

      if (errors?.nin) {
        toast.error(
          `NIN: ${Array.isArray(errors.nin) ? errors.nin[0] : errors.nin}`
        );
      } else if (errors?.email) {
        toast.error(
          `Email: ${
            Array.isArray(errors.email) ? errors.email[0] : errors.email
          }`
        );
      } else if (errors?.phone_number) {
        toast.error(
          `Phone: ${
            Array.isArray(errors.phone_number)
              ? errors.phone_number[0]
              : errors.phone_number
          }`
        );
      } else if (errors?.password) {
        toast.error(
          `Password: ${
            Array.isArray(errors.password)
              ? errors.password[0]
              : errors.password
          }`
        );
      } else {
        toast.error(
          errors?.message ||
            error.message ||
            "Registration failed. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SuperAdminRegisterDesign
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
}
