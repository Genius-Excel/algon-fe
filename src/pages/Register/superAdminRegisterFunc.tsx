import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SuperAdminRegisterDesign } from "./superAdminRegisterDesign";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  nin?: string; // Optional for super-admin
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export function SuperAdminRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    nin: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // ✅ Client-side validation - NIN is optional for super-admin
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate NIN format if provided (optional for super-admin)
    if (
      formData.nin &&
      (formData.nin.length !== 11 || !/^\d{11}$/.test(formData.nin))
    ) {
      toast.error("NIN must be exactly 11 digits");
      return;
    }

    // Validate phone number format (must be 11 digits)
    if (formData.phone.length !== 11 || !/^\d{11}$/.test(formData.phone)) {
      toast.error("Phone number must be exactly 11 digits (e.g., 07099494949)");
      return;
    }

    // Validate password complexity
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error(
        "Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters"
      );
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Call the register function with super-admin role
      const registerData: any = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phone,
        password: formData.password,
        role: "super-admin",
      };

      // Only include NIN if provided (it's optional for super-admin)
      if (formData.nin) {
        registerData.nin = formData.nin;
      }

      await register(registerData);

      toast.success(
        "Super Admin account created successfully! Please login to continue."
      );

      // Navigate to login page
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      console.error("Registration error:", error);

      // Handle specific error messages from backend
      const errorMessage =
        error.message ||
        error.response?.data?.error ||
        error.response?.data?.message;

      if (errorMessage) {
        toast.error(errorMessage);
      } else if (error.response?.data) {
        // Handle field-specific validation errors
        const errors = error.response.data;

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
        } else if (errors?.first_name) {
          toast.error(
            `First Name: ${
              Array.isArray(errors.first_name)
                ? errors.first_name[0]
                : errors.first_name
            }`
          );
        } else if (errors?.last_name) {
          toast.error(
            `Last Name: ${
              Array.isArray(errors.last_name)
                ? errors.last_name[0]
                : errors.last_name
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
          toast.error("Registration failed. Please try again.");
        }
      } else {
        toast.error(
          "Registration failed. Please check your connection and try again."
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
