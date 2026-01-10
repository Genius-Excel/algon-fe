import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegisterDesign } from "./registerDesign";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  nin: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export function Register() {
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
    // ✅ Client-side validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.nin ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate NIN format (must be 11 digits)
    if (formData.nin.length !== 11 || !/^\d{11}$/.test(formData.nin)) {
      toast.error("NIN must be exactly 11 digits");
      return;
    }

    // Validate phone number format (must be 11 digits)
    if (formData.phone.length !== 11 || !/^\d{11}$/.test(formData.phone)) {
      toast.error("Phone number must be exactly 11 digits (e.g., 09085561218)");
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
      // ✅ Call API service with correct field name
      await register({
        first_name: formData.firstName,
        last_name: formData.lastName,
        nin: formData.nin,
        email: formData.email,
        phone_number: formData.phone,
        password: formData.password,
        role: "applicant",
      });

      toast.success("Registration successful! Please login to continue.");

      // ✅ Navigate to login page (API doesn't auto-login)
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error: any) {
      console.error("Registration error:", error);

      // ✅ Handle specific error messages from backend
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
          toast.error(`NIN: ${errors.nin[0]}`);
        } else if (errors?.email) {
          toast.error(`Email: ${errors.email[0]}`);
        } else if (errors?.phone_number) {
          toast.error(`Phone: ${errors.phone_number[0]}`);
        } else if (errors?.first_name) {
          toast.error(`First Name: ${errors.first_name[0]}`);
        } else if (errors?.last_name) {
          toast.error(`Last Name: ${errors.last_name[0]}`);
        } else if (errors?.password) {
          toast.error(`Password: ${errors.password[0]}`);
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
    <RegisterDesign
      formData={formData}
      setFormData={setFormData}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
}
