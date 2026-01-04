import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Logo } from "../../DesignSystem/designSyetem";
import { CheckCircle, Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";

interface ResetPasswordDesignProps {
  email: string;
  setEmail: (email: string) => void;
  password1: string;
  setPassword1: (password: string) => void;
  password2: string;
  setPassword2: (password: string) => void;
  handleSubmit: () => void;
  isLoading: boolean;
  resetSuccess: boolean;
}

export function ResetPasswordDesign({
  email,
  setEmail,
  password1,
  setPassword1,
  password2,
  setPassword2,
  handleSubmit,
  isLoading,
  resetSuccess,
}: ResetPasswordDesignProps) {
  const navigate = useNavigate();
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  // Password strength indicator
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "" };
    if (password.length < 8)
      return { strength: 1, label: "Weak", color: "bg-red-500" };

    let strength = 1;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2)
      return { strength: 2, label: "Fair", color: "bg-yellow-500" };
    if (strength === 3)
      return { strength: 3, label: "Good", color: "bg-blue-500" };
    return { strength: 4, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength(password1);
  const passwordsMatch = password1 && password2 && password1 === password2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold">Reset Your Password</h1>
          <p className="text-muted-foreground mt-1">
            Create a new password for your account
          </p>
        </div>

        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle>New Password</CardTitle>
            <CardDescription>
              {resetSuccess
                ? "Your password has been reset successfully"
                : "Enter your email and choose a strong password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resetSuccess ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-900 font-medium">
                      Password reset successful!
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      Your password has been updated. You can now login with
                      your new password.
                    </p>
                  </div>
                </div>

                <Button
                  className="w-full rounded-lg"
                  onClick={() => navigate("/login")}
                >
                  Continue to Login
                </Button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password1">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password1"
                      type={showPassword1 ? "text" : "password"}
                      placeholder="Enter new password"
                      value={password1}
                      onChange={(e) => setPassword1(e.target.value)}
                      required
                      disabled={isLoading}
                      className="rounded-lg pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword1(!showPassword1)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword1 ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Password strength indicator */}
                  {password1 && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full ${
                              level <= passwordStrength.strength
                                ? passwordStrength.color
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p
                        className={`text-xs ${
                          passwordStrength.strength >= 3
                            ? "text-green-600"
                            : passwordStrength.strength === 2
                            ? "text-blue-600"
                            : "text-red-600"
                        }`}
                      >
                        Password strength: {passwordStrength.label}
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password2">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="password2"
                      type={showPassword2 ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                      required
                      disabled={isLoading}
                      className="rounded-lg pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword2(!showPassword2)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword2 ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Password match indicator */}
                  {password2 && (
                    <p
                      className={`text-xs ${
                        passwordsMatch ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {passwordsMatch
                        ? "✓ Passwords match"
                        : "✗ Passwords don't match"}
                    </p>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800 font-medium mb-1">
                    <Lock className="w-3 h-3 inline mr-1" />
                    Password requirements:
                  </p>
                  <ul className="text-xs text-blue-700 space-y-0.5 ml-4 list-disc">
                    <li>At least 8 characters long</li>
                    <li>Include uppercase and lowercase letters</li>
                    <li>Include numbers and special characters</li>
                  </ul>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-lg"
                  disabled={
                    isLoading ||
                    !passwordsMatch ||
                    passwordStrength.strength < 2
                  }
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Help Text */}
        {!resetSuccess && (
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Remember your password?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-primary hover:underline"
              >
                Login here
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
