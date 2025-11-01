import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Shield, UserCheck, Settings, CheckCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface AdminOnboardingProps {
  onNavigate: (page: string) => void;
}

interface OnboardingFormData {
  // Step 1: Personal Info
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  
  // Step 2: Local Government Assignment
  state: string;
  localGovernment: string;
  
  // Step 3: Permissions
  permissions: {
    approveApplications: boolean;
    manageFees: boolean;
    manageRequirements: boolean;
    viewAnalytics: boolean;
    exportData: boolean;
  };
}

export function AdminOnboarding({ onNavigate }: AdminOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const [formData, setFormData] = useState<OnboardingFormData>({
    fullName: "",
    email: "admin@example.com", // Read-only email from backend
    phone: "",
    password: "",
    confirmPassword: "",
    state: "",
    localGovernment: "",
    permissions: {
      approveApplications: false,
      manageFees: false,
      manageRequirements: false,
      viewAnalytics: false,
      exportData: false
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!formData.fullName || !formData.phone || !formData.password || !formData.confirmPassword) {
          toast.error("Please fill in all required fields");
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return false;
        }
        if (formData.password.length < 8) {
          toast.error("Password must be at least 8 characters");
          return false;
        }
        return true;
      case 2:
        if (!formData.state || !formData.localGovernment) {
          toast.error("Please select both state and local government");
          return false;
        }
        return true;
      case 3:
        const hasPermissions = Object.values(formData.permissions).some(p => p);
        if (!hasPermissions) {
          toast.error("Please select at least one permission");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    
    try {
      // Mock API call - replace with actual endpoint
      const response = await fetch('/api/admin/onboarding/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Admin Onboarding Completed Successfully");
        // Redirect to admin dashboard
        setTimeout(() => {
          onNavigate('lg-admin-dashboard');
        }, 1500);
      } else {
        throw new Error('Failed to complete onboarding');
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error("Failed to complete onboarding. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return UserCheck;
      case 2: return Settings;
      case 3: return Shield;
      default: return UserCheck;
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return "Personal Information";
      case 2: return "Local Government Assignment";
      case 3: return "Permissions Setup";
      default: return "Setup";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-teal-600 flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xl text-gray-800">Admin Onboarding</div>
              <div className="text-xs text-gray-600">Step {currentStep} of {totalSteps}</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-3">
            {[1, 2, 3].map((step) => {
              const StepIcon = getStepIcon(step);
              return (
                <div key={step} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    step <= currentStep ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step < currentStep ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-xs text-gray-600 text-center max-w-20">
                    {getStepTitle(step)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

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
            onClick={() => onNavigate('landing')}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            ← Cancel setup
          </button>
        </div>
      </div>
    </div>
  );
}

function PersonalInfoStep({ formData, setFormData }: {
  formData: OnboardingFormData;
  setFormData: (data: OnboardingFormData) => void;
}) {
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

function LocalGovernmentStep({ formData, setFormData }: {
  formData: OnboardingFormData;
  setFormData: (data: OnboardingFormData) => void;
}) {
  // Mock data - in real app, fetch from /api/states and /api/lgs
  const states = [
    { value: "lagos", label: "Lagos" },
    { value: "kano", label: "Kano" },
    { value: "rivers", label: "Rivers" },
    { value: "kaduna", label: "Kaduna" },
    { value: "oyo", label: "Oyo" }
  ];

  const localGovernments: Record<string, { value: string; label: string }[]> = {
    lagos: [
      { value: "ikeja", label: "Ikeja" },
      { value: "lagos-island", label: "Lagos Island" },
      { value: "surulere", label: "Surulere" },
      { value: "alimosho", label: "Alimosho" },
      { value: "oshodi", label: "Oshodi-Isolo" }
    ],
    kano: [
      { value: "kano-municipal", label: "Kano Municipal" },
      { value: "nassarawa", label: "Nassarawa" },
      { value: "fagge", label: "Fagge" }
    ],
    rivers: [
      { value: "port-harcourt", label: "Port Harcourt" },
      { value: "obio-akpor", label: "Obio-Akpor" },
      { value: "eleme", label: "Eleme" }
    ],
    kaduna: [
      { value: "kaduna-north", label: "Kaduna North" },
      { value: "kaduna-south", label: "Kaduna South" },
      { value: "chikun", label: "Chikun" }
    ],
    oyo: [
      { value: "ibadan-north", label: "Ibadan North" },
      { value: "ibadan-south-west", label: "Ibadan South-West" },
      { value: "oyo-west", label: "Oyo West" }
    ]
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
              localGovernment: "" // Reset LG when state changes
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
              <SelectValue placeholder={
                formData.state ? "Select local government" : "Select state first"
              } />
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
            <p><strong>State:</strong> {formData.state ? states.find(s => s.value === formData.state)?.label : "Not selected"}</p>
            <p><strong>Local Government:</strong> {
              formData.localGovernment && formData.state 
                ? localGovernments[formData.state]?.find(lg => lg.value === formData.localGovernment)?.label
                : "Not selected"
            }</p>
          </div>
          <p className="text-xs text-teal-600 mt-2">
            You will have administrative access to certificate applications from this local government area.
          </p>
        </div>
      </CardContent>
    </>
  );
}

function PermissionsStep({ formData, setFormData }: {
  formData: OnboardingFormData;
  setFormData: (data: OnboardingFormData) => void;
}) {
  const handlePermissionChange = (permission: keyof typeof formData.permissions, checked: boolean) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [permission]: checked
      }
    });
  };

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
                onCheckedChange={(checked) => 
                  handlePermissionChange(permission.key, checked as boolean)
                }
                className="mt-1"
              />
              <div className="flex-1">
                <Label 
                  htmlFor={permission.key}
                  className="text-sm font-medium cursor-pointer"
                >
                  {permission.label}
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  {permission.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> These permissions can be modified later by the Super Admin. 
            Select at least one permission to proceed.
          </p>
        </div>

        {/* Selected Permissions Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-800 mb-2">Selected Permissions</h4>
          <div className="text-sm text-gray-600">
            {Object.entries(formData.permissions).filter(([_, enabled]) => enabled).length > 0 ? (
              <ul className="space-y-1">
                {Object.entries(formData.permissions)
                  .filter(([_, enabled]) => enabled)
                  .map(([key, _]) => {
                    const permission = permissionsList.find(p => p.key === key);
                    return permission ? (
                      <li key={key} className="flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        {permission.label}
                      </li>
                    ) : null;
                  })}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No permissions selected</p>
            )}
          </div>
        </div>
      </CardContent>
    </>
  );
}