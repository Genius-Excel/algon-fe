// src/pages/Digitization/digitizationFlowDesign.tsx
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Upload,
  CheckCircle,
  FileText,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import {
  Logo,
  StepProgress,
  PageContainer,
} from "../../DesignSystem/designSyetem";
import type { DigitizationFormData } from "../../Types/types";

// ============================================================================
// PROPS INTERFACES
// ============================================================================

interface DigitizationFlowDesignProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  formData: DigitizationFormData;
  setFormData: (data: DigitizationFormData) => void;
  photoPreview: string | null;
  ninSlipPreview: string | null;
  uploadedFile: string | null;
  setUploadedFile: (file: string | null) => void;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: () => void;
  handleNinSlipUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeNinSlip: () => void;
  handleNext: () => void;
  handleBack: () => void;
  handleSubmit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface Step1Props {
  formData: DigitizationFormData;
  setFormData: (data: DigitizationFormData) => void;
  photoPreview: string | null;
  ninSlipPreview: string | null;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: () => void;
  handleNinSlipUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeNinSlip: () => void;
}

interface Step2Props {
  uploadedFile: string | null;
  setUploadedFile: (file: string | null) => void;
  formData: DigitizationFormData;
  setFormData: (data: DigitizationFormData) => void;
}

interface Step3Props {
  formData: DigitizationFormData;
  setFormData: (data: DigitizationFormData) => void;
}

interface Step4Props {
  formData: DigitizationFormData;
}

// ============================================================================
// MAIN DESIGN COMPONENT
// ============================================================================

export function DigitizationFlowDesign({
  currentStep,
  totalSteps,
  progress,
  formData,
  setFormData,
  photoPreview,
  ninSlipPreview,
  uploadedFile,
  setUploadedFile,
  handlePhotoUpload,
  removePhoto,
  handleNinSlipUpload,
  removeNinSlip,
  handleNext,
  handleBack,
  handleSubmit,
  onCancel,
  isSubmitting = false
}: DigitizationFlowDesignProps) {
  const steps = ["Verify Identity", "Upload", "Payment", "Confirmation"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 to-white py-8 px-4">
      <PageContainer maxWidth="lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Logo size="lg" />
          </div>
          <h2 className="text-xl mb-2">Certificate Digitization</h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Convert your existing hard copy certificate to a digital version with QR code verification
          </p>
          <p className="text-sm text-muted-foreground mt-2">
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
            <Step1
              formData={formData}
              setFormData={setFormData}
              photoPreview={photoPreview}
              ninSlipPreview={ninSlipPreview}
              handlePhotoUpload={handlePhotoUpload}
              removePhoto={removePhoto}
              handleNinSlipUpload={handleNinSlipUpload}
              removeNinSlip={removeNinSlip}
            />
          )}
          {currentStep === 2 && (
            <Step2
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {currentStep === 3 && (
            <Step3 formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 4 && <Step4 formData={formData} />}

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
                  className="ml-auto rounded-lg bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="ml-auto rounded-lg bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
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
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            disabled={isSubmitting}
          >
            ← Cancel and return to dashboard
          </button>
        </div>
      </PageContainer>
    </div>
  );
}

// ============================================================================
// STEP COMPONENTS
// ============================================================================

// Step 1: Verify Identity
function Step1({
  formData,
  setFormData,
  photoPreview,
  ninSlipPreview,
  handlePhotoUpload,
  removePhoto,
  handleNinSlipUpload,
  removeNinSlip,
}: Step1Props) {
  return (
    <>
      <CardHeader>
        <CardTitle>Verify Your Identity</CardTitle>
        <CardDescription>
          Enter your identification details to begin the digitization process
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900">
              You must already possess a valid hard copy certificate issued by
              your Local Government to use this service.
            </p>
          </div>
        </div>

        {/* Document Uploads Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Photo Upload */}
          <div className="space-y-2">
            <Label htmlFor="profile-photo">Upload Profile Photo *</Label>
            <div className="space-y-3">
              <input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handlePhotoUpload}
                className="hidden"
                id="profile-photo"
              />
              <label
                htmlFor="profile-photo"
                className="border-2 border-dashed border-border rounded-lg p-3 text-center hover:border-primary transition-colors cursor-pointer block"
              >
                <Upload className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs">Click to upload photo</p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG (MAX. 2MB)
                </p>
              </label>

              {photoPreview && (
                <div className="flex justify-center">
                  <div className="relative">
                    <img
                      src={photoPreview}
                      alt="Profile preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-border"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* NIN Slip Upload */}
          <div className="space-y-2">
            <Label htmlFor="nin-slip">Upload NIN Slip *</Label>
            <div className="space-y-3">
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={handleNinSlipUpload}
                className="hidden"
                id="nin-slip"
              />
              <label
                htmlFor="nin-slip"
                className="border-2 border-dashed border-border rounded-lg p-3 text-center hover:border-primary transition-colors cursor-pointer block"
              >
                <Upload className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs">Click to upload NIN slip</p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG, PDF (MAX. 5MB)
                </p>
              </label>

              {ninSlipPreview && (
                <div className="flex justify-center">
                  <div className="relative">
                    {ninSlipPreview === "pdf" ? (
                      <div className="w-16 h-16 bg-red-100 border-2 border-red-200 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-red-600 font-medium">
                          PDF
                        </span>
                      </div>
                    ) : (
                      <img
                        src={ninSlipPreview}
                        alt="NIN slip preview"
                        className="w-16 h-16 rounded-lg object-cover border-2 border-border"
                      />
                    )}
                    <button
                      type="button"
                      onClick={removeNinSlip}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nin">National Identification Number (NIN) *</Label>
          <Input
            id="nin"
            placeholder="Enter your 11-digit NIN"
            value={formData.nin}
            onChange={(e) => setFormData({ ...formData, nin: e.target.value })}
            className="rounded-lg"
            maxLength={11}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
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
            <Label htmlFor="phone">Phone Number *</Label>
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="lga">Local Government *</Label>
          <Select
            value={formData.lga}
            onValueChange={(value) =>
              setFormData({ ...formData, lga: value })
            }
          >
            <SelectTrigger id="lga" className="rounded-lg">
              <SelectValue placeholder="Select your LGA" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ikeja">Ikeja</SelectItem>
              <SelectItem value="lagos-island">Lagos Island</SelectItem>
              <SelectItem value="surulere">Surulere</SelectItem>
              <SelectItem value="eti-osa">Eti-Osa</SelectItem>
              <SelectItem value="alimosho">Alimosho</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </>
  );
}

// Step 2: Upload Certificate
function Step2({
  uploadedFile,
  setUploadedFile,
  formData,
  setFormData,
}: Step2Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
    }
  };

  return (
    <>
      <CardHeader>
        <CardTitle>Upload Certificate</CardTitle>
        <CardDescription>
          Upload a clear scan or photo of your existing hard copy certificate
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="certificate-upload">Certificate Document *</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="hidden"
              id="certificate-upload"
            />
            <label htmlFor="certificate-upload" className="cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, PNG, JPG (MAX. 10MB)
              </p>
              {uploadedFile && (
                <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">{uploadedFile}</span>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="certificateRef">
            Certificate Reference Number (Optional)
          </Label>
          <Input
            id="certificateRef"
            placeholder="e.g., CERT-IKJ-2020-045"
            value={formData.certificateRef}
            onChange={(e) =>
              setFormData({ ...formData, certificateRef: e.target.value })
            }
            className="rounded-lg"
          />
          <p className="text-xs text-muted-foreground">
            If available, enter the reference number from your hard copy
            certificate
          </p>
        </div>

        <div className="bg-secondary/20 rounded-lg p-4">
          <p className="text-sm mb-2">Example of acceptable certificate image:</p>
          <div className="border border-border rounded-lg overflow-hidden bg-white">
            <div className="p-6 text-center">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">
                Sample Certificate Document
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Clear, legible, all text visible
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
}

// Step 3: Payment
function Step3({ formData, setFormData }: Step3Props) {
  return (
    <>
      <CardHeader>
        <CardTitle>Payment - Reduced Fee</CardTitle>
        <CardDescription>
          Complete payment to process your certificate digitization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-secondary/20 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted-foreground">Digitization Fee</span>
            <span className="text-2xl">₦2,000</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Processing Fee</span>
            <span>₦300</span>
          </div>
          <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
            <span>Total Amount</span>
            <span className="text-2xl text-primary">₦2,300</span>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-900">
            <span className="text-green-800">💡 Reduced Fee:</span> This is a
            one-time fee to convert your hard copy certificate to a digital
            version. This is significantly lower than applying for a new
            certificate (₦5,500).
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentMethod">Payment Method *</Label>
          <Select
            value={formData.paymentMethod}
            onValueChange={(value) =>
              setFormData({ ...formData, paymentMethod: value })
            }
          >
            <SelectTrigger id="paymentMethod" className="rounded-lg">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Debit/Credit Card</SelectItem>
              <SelectItem value="bank">Bank Transfer</SelectItem>
              <SelectItem value="ussd">USSD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full rounded-lg" variant="outline">
          Proceed to Payment Gateway
        </Button>
      </CardContent>
    </>
  );
}

// Step 4: Confirmation
function Step4({ formData }: Step4Props) {
  return (
    <>
      <CardHeader>
        <CardTitle>Confirmation & Review</CardTitle>
        <CardDescription>
          Your digitization request is being processed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <p className="text-sm text-green-900">Payment Confirmed</p>
            <p className="text-xs text-muted-foreground">
              Transaction ID: DIGI-PAY-2025-45678
            </p>
          </div>
        </div>

        <div className="bg-secondary/10 rounded-xl p-6 space-y-4">
          <h4 className="font-semibold">Digitization Request Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">NIN</p>
              <p>{formData.nin || "Not provided"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p>{formData.email || "Not provided"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p>{formData.phone || "Not provided"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Local Government</p>
              <p>{formData.lga || "Not provided"}</p>
            </div>
          </div>
          {formData.certificateRef && (
            <div>
              <p className="text-sm text-muted-foreground">
                Certificate Reference
              </p>
              <p className="text-sm">{formData.certificateRef}</p>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            Your request will be reviewed within 2-3 business days. You will
            receive an email notification when your digital certificate is ready
            for download.
          </p>
        </div>
      </CardContent>
    </>
  );
}