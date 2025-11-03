// src/pages/AdminOnboarding/AdminOnboardingDesign.tsx
import React from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { UserCheck, Settings, Shield, CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { Logo, StepProgress, PageContainer } from '../../DesignSystem/designSyetem';
import type { OnboardingFormData, OnboardingStepProps } from '../../Types/types';

// Main Design Component
interface AdminOnboardingDesignProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  formData: OnboardingFormData;
  setFormData: (data: OnboardingFormData) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  onCancel: () => void;
}

export function AdminOnboardingDesign({
  currentStep,
  totalSteps,
  progress,
  formData,
  setFormData,
  handleNext,
  handleBack,
  handleSubmit,
  isSubmitting,
  onCancel
}: AdminOnboardingDesignProps) {
  const steps = ['Personal Info', 'LG Assignment', 'Permissions'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white py-8 px-4">
      <PageContainer maxWidth="lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Logo size="lg" />
          </div>
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        {/* Progress Bar */}
        <StepProgress 
          currentStep={currentStep}
          totalSteps={totalSteps}
          steps={steps}
        />

        {/* Form Card */}
        <Card className="rounded-xl shadow-lg">
          {currentStep === 1 && (
            <PersonalInfoStep formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 2 && (
            <LocalGovernmentStep formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 3 && (
            <PermissionsStep formData={formData} setFormData={setFormData} />
          )}

          {/* Navigation Buttons */}
          <CardContent className="pt-0">
            <div className="flex gap-4 justify-between">
              {currentStep > 1 && (
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="rounded-lg"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              {currentStep < totalSteps ? (
                <Button 
                  onClick={handleNext}
                  className="ml-auto rounded-lg bg-teal-600 hover:bg-teal-700"
                  disabled={isSubmitting}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  className="ml-auto rounded-lg bg-teal-600 hover:bg-teal-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Completing..." : "Finish Setup"}
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cancel Link */}
        <div className="mt-6 text-center">
          <button 
            onClick={onCancel}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Cancel setup
          </button>
        </div>
      </PageContainer>
    </div>
  );
}

// Step 1: Personal Info
function PersonalInfoStep({ formData, setFormData }: OnboardingStepProps) {
  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-teal-600" />
          Personal Information
        </CardTitle>
        <CardDescription>
          Enter your personal details to set up your admin profile
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name *</Label>
          <Input 
            id="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            className="rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email"
            type="email"
            value={formData.email}
            className="rounded-lg bg-gray-50"
            disabled
          />
          <p className="text-xs text-gray-500">Email assigned by Super Admin</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input 
            id="phone"
            type="tel"
            placeholder="080XXXXXXXX"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            className="rounded-lg"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="password">Create Password *</Label>
            <Input 
              id="password"
              type="password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <Input 
              id="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <strong>Password Requirements:</strong>
          <ul className="mt-1 text-xs space-y-1">
            <li>• At least 8 characters long</li>
            <li>• Mix of letters, numbers, and symbols recommended</li>
          </ul>
        </div>
      </CardContent>
    </>
  );
}

// Step 2: Local Government Assignment
function LocalGovernmentStep({ formData, setFormData }: OnboardingStepProps) {
  // Mock data - in real app, fetch from API
  const states = [
    { value: "lagos", label: "Lagos" },
    { value: "kano", label: "Kano" },
    { value: "rivers", label: "Rivers" },
  ];

  const localGovernments: Record<string, { value: string; label: string }[]> = {
    lagos: [
      { value: "ikeja", label: "Ikeja" },
      { value: "lagos-island", label: "Lagos Island" },
      { value: "surulere", label: "Surulere" },
    ],
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-teal-600" />
          Local Government Assignment
        </CardTitle>
        <CardDescription>
          Select the state and local government you will be administering
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <Select 
            value={formData.state} 
            onValueChange={(value) => setFormData({
              ...formData, 
              state: value,
              localGovernment: ""
            })}
          >
            <SelectTrigger className="rounded-lg">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state.value} value={state.value}>
                  {state.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="localGovernment">Local Government *</Label>
          <Select 
            value={formData.localGovernment} 
            onValueChange={(value) => setFormData({...formData, localGovernment: value})}
            disabled={!formData.state}
          >
            <SelectTrigger className="rounded-lg">
              <SelectValue placeholder={formData.state ? "Select local government" : "Select state first"} />
            </SelectTrigger>
            <SelectContent>
              {formData.state && localGovernments[formData.state]?.map((lg) => (
                <SelectItem key={lg.value} value={lg.value}>
                  {lg.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-teal-800 mb-2">Assignment Summary</h4>
          <div className="text-sm text-teal-700">
            <p><strong>State:</strong> {formData.state || "Not selected"}</p>
            <p><strong>Local Government:</strong> {formData.localGovernment || "Not selected"}</p>
          </div>
        </div>
      </CardContent>
    </>
  );
}

// Step 3: Permissions
function PermissionsStep({ formData, setFormData }: OnboardingStepProps) {
  const permissionsList = [
    {
      key: 'approveApplications' as const,
      label: 'Approve Applications',
      description: 'Review and approve/reject certificate applications'
    },
    {
      key: 'manageFees' as const,
      label: 'Manage Fees',
      description: 'Set and modify application and processing fees'
    },
    {
      key: 'manageRequirements' as const,
      label: 'Manage Requirements',
      description: 'Configure required documents and application fields'
    },
    {
      key: 'viewAnalytics' as const,
      label: 'View Analytics',
      description: 'Access reports and analytics dashboard'
    },
    {
      key: 'exportData' as const,
      label: 'Export Data',
      description: 'Download reports and application data'
    }
  ];

  const handlePermissionChange = (permission: keyof typeof formData.permissions, checked: boolean) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [permission]: checked
      }
    });
  };

  return (
    <>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-teal-600" />
          Admin Permissions
        </CardTitle>
        <CardDescription>
          Select the permissions for this admin account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {permissionsList.map((permission) => (
            <div key={permission.key} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Checkbox
                id={permission.key}
                checked={formData.permissions[permission.key]}
                onCheckedChange={(checked) => handlePermissionChange(permission.key, checked as boolean)}
                className="mt-1"
              />
              <div className="flex-1">
                <Label htmlFor={permission.key} className="text-sm font-medium cursor-pointer">
                  {permission.label}
                </Label>
                <p className="text-xs text-gray-600 mt-1">{permission.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </>
  );
}