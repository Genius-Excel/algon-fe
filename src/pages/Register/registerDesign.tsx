// src/pages/Register/RegisterDesign.tsx
import React from "react";
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
import { Logo, PageContainer } from "../../DesignSystem/designSyetem";

interface RegisterFormData {
  nin: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface RegisterDesignProps {
  formData: RegisterFormData;
  setFormData: (data: RegisterFormData) => void;
  handleSubmit: () => void;
  onNavigate: (page: string) => void;
}

export function RegisterDesign({
  formData,
  setFormData,
  handleSubmit,
  onNavigate,
}: RegisterDesignProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 to-white flex items-center justify-center p-4">
      <PageContainer maxWidth="sm" className="w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Logo size="lg" />
          </div>
        </div>

        <Card className="rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Create an account to apply for your certificate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nin">
                  National Identification Number (NIN)
                </Label>
                <Input
                  id="nin"
                  type="text"
                  placeholder="Enter your 11-digit NIN"
                  value={formData.nin}
                  onChange={(e) =>
                    setFormData({ ...formData, nin: e.target.value })
                  }
                  className="rounded-lg"
                  maxLength={11}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="080XXXXXXXX"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="rounded-lg"
                />
              </div>

              <div className="flex items-start gap-2">
                <input
                  aria-label="privacy-policy"
                  type="checkbox"
                  className="mt-1 rounded"
                  required
                />
                <span className="text-xs text-muted-foreground">
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </div>

              <Button onClick={handleSubmit} className="w-full rounded-lg">
                Create Account
              </Button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={() => onNavigate("login")}
                className="text-sm text-primary hover:underline"
              >
                Already have an account? Sign in
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <button
            onClick={() => onNavigate("landing")}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to home
          </button>
        </div>
      </PageContainer>
    </div>
  );
}
