import { useState } from "react";
import { LoginDesign } from "./loginDesign";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";

export function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Validate required fields
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // ✅ AuthContext handles ALL navigation
      await login(email, password);

      toast.success("Login successful!");

      // ❌ REMOVED: No manual navigation - AuthContext does it
    } catch (error: any) {
      console.error("Login error:", error);

      // Enhanced error handling
      const errorData = error.response?.data;
      let errorMessage = "Login failed. Please check your credentials.";

      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.detail) {
        errorMessage = errorData.detail;
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Handle specific error cases
      if (errorMessage.toLowerCase().includes("credential")) {
        errorMessage = "Invalid email or password";
      } else if (errorMessage.toLowerCase().includes("not found")) {
        errorMessage = "Account not found. Please register first.";
      } else if (
        errorMessage.toLowerCase().includes("inactive") ||
        errorMessage.toLowerCase().includes("disabled")
      ) {
        errorMessage =
          "Your account has been disabled. Please contact support.";
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginDesign
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      handleLogin={handleLogin}
      isLoading={isLoading}
    />
  );
}
