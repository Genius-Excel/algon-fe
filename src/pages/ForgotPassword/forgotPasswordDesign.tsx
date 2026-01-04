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
import { ArrowLeft, Mail } from "lucide-react";

interface ForgotPasswordDesignProps {
  email: string;
  setEmail: (email: string) => void;
  handleSubmit: () => void;
  isLoading: boolean;
  emailSent: boolean;
}

export function ForgotPasswordDesign({
  email,
  setEmail,
  handleSubmit,
  isLoading,
  emailSent,
}: ForgotPasswordDesignProps) {
  const navigate = useNavigate();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-2">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-bold">Password Reset</h1>
          <p className="text-muted-foreground mt-1">
            Enter your email to receive a password reset link
          </p>
        </div>

        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>
              {emailSent
                ? "Check your email for the reset link"
                : "We'll send you a password reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailSent ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
                  <Mail className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-green-900 font-medium">
                      Email sent successfully!
                    </p>
                    <p className="text-xs text-green-700 mt-1">
                      We've sent a password reset link to{" "}
                      <strong>{email}</strong>
                    </p>
                    <p className="text-xs text-green-600 mt-2">
                      Please check your inbox and follow the instructions to
                      reset your password.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full rounded-lg"
                    onClick={() => navigate("/login")}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full rounded-lg"
                    onClick={() => window.location.reload()}
                  >
                    Send Another Email
                  </Button>
                </div>
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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-blue-800">
                    <strong>Note:</strong> The reset link will be valid for 1
                    hour. If you don't receive the email within a few minutes,
                    please check your spam folder.
                  </p>
                </div>

                <div className="space-y-2">
                  <Button
                    type="submit"
                    className="w-full rounded-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send Reset Link"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full rounded-lg"
                    onClick={() => navigate("/login")}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Help Text */}
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
      </div>
    </div>
  );
}
