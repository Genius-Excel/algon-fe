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

      // ✅ Handle specific validation errors from backend
      const errors = error.response?.data;

      if (errors?.nin) {
        toast.error(`NIN: ${errors.nin[0]}`);
      } else if (errors?.email) {
        toast.error(`Email: ${errors.email[0]}`);
      } else if (errors?.phone) {
        toast.error(`Phone: ${errors.phone[0]}`);
      } else {
        toast.error(
          errors?.message || "Registration failed. Please try again."
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
