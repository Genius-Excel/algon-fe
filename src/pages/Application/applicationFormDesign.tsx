// src/pages/ApplicationForm/ApplicationFormDesign.tsx
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
import { Textarea } from "../../components/ui/textarea";
import { Upload, CheckCircle } from "lucide-react";
import {
  Logo,
  StepProgress,
  PageContainer,
} from "../../DesignSystem/designSyetem";
import type { ApplicationFormData } from "../../Types/types";

interface ApplicationFormDesignProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  formData: ApplicationFormData;
  setFormData: (data: ApplicationFormData) => void;
  photoPreview: string | null;
  ninSlipPreview: string | null;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: () => void;
  handleNinSlipUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeNinSlip: () => void;
  handleNext: () => void;
  handleBack: () => void;
  handleSubmit: () => void;
  onCancel: () => void;
}

export function ApplicationFormDesign({
  currentStep,
  totalSteps,
  progress,
  formData,
  setFormData,
  photoPreview,
  ninSlipPreview,
  handlePhotoUpload,
  removePhoto,
  handleNinSlipUpload,
  removeNinSlip,
  handleNext,
  handleBack,
  handleSubmit,
  onCancel,
}: ApplicationFormDesignProps) {
  const steps = ["Personal Details", "Requirements", "Payment", "Review"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 to-white py-8 px-4">
      <PageContainer maxWidth="lg">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <Logo size="lg" />
          </div>
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        <StepProgress
          currentStep={currentStep}
          totalSteps={totalSteps}
          steps={steps}
        />

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
            <Step2 formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 3 && (
            <Step3 formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 4 && <Step4 formData={formData} />}

          <CardContent className="pt-0">
            <div className="flex gap-4 justify-between">
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="rounded-lg"
                >
                  Back
                </Button>
              )}
              {currentStep < totalSteps ? (
                <Button onClick={handleNext} className="ml-auto rounded-lg">
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="ml-auto rounded-lg">
                  Submit Application
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <button
            onClick={onCancel}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Cancel application
          </button>
        </div>
      </PageContainer>
    </div>
  );
}

// Step 1: Personal Details
interface StepProps {
  formData: ApplicationFormData;
  setFormData: (data: ApplicationFormData) => void;
}

interface Step1Props extends StepProps {
  photoPreview: string | null;
  ninSlipPreview: string | null;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: () => void;
  handleNinSlipUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeNinSlip: () => void;
}

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
        <CardTitle>Personal Details</CardTitle>
        <CardDescription>Enter your personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Document Uploads Row */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Profile Photo Upload */}
          <div className="space-y-2">
            <Label>Upload Profile Photo</Label>
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
            <Label>Upload NIN Slip</Label>
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

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              placeholder="As shown on NIN"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label>National Identification Number</Label>
            <Input
              placeholder="11-digit NIN"
              value={formData.nin}
              onChange={(e) =>
                setFormData({ ...formData, nin: e.target.value })
              }
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Input
              type="date"
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
              }
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
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
          <Label>Email Address</Label>
          <Input
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="rounded-lg"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>State</Label>
            <Select
              value={formData.state}
              onValueChange={(value) =>
                setFormData({ ...formData, state: value })
              }
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lagos">Lagos</SelectItem>
                <SelectItem value="kano">Kano</SelectItem>
                <SelectItem value="rivers">Rivers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Local Government</Label>
            <Select
              value={formData.lga}
              onValueChange={(value) =>
                setFormData({ ...formData, lga: value })
              }
            >
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Select LGA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ikeja">Ikeja</SelectItem>
                <SelectItem value="lagos-island">Lagos Island</SelectItem>
                <SelectItem value="surulere">Surulere</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Village/Community</Label>
          <Input
            placeholder="Enter your village or community name"
            value={formData.village}
            onChange={(e) =>
              setFormData({ ...formData, village: e.target.value })
            }
            className="rounded-lg"
          />
        </div>
      </CardContent>
    </>
  );
}

// Step 2: Requirements
function Step2({ formData, setFormData }: StepProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Additional Requirements</CardTitle>
        <CardDescription>
          Upload required documents and provide additional information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Letter from Traditional Ruler</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground mt-1">
              PDF, PNG, JPG (MAX. 5MB)
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Residential Address</Label>
          <Textarea
            placeholder="Enter your full residential address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="rounded-lg min-h-24"
          />
        </div>

        <div className="space-y-2">
          <Label>Notable Landmark</Label>
          <Textarea
            placeholder="Describe a notable landmark near your residence"
            value={formData.landmark}
            onChange={(e) =>
              setFormData({ ...formData, landmark: e.target.value })
            }
            className="rounded-lg min-h-24"
          />
        </div>
      </CardContent>
    </>
  );
}

// Step 3: Payment
function Step3({ formData, setFormData }: StepProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>
          Complete payment to process your application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-secondary/20 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-muted-foreground">Application Fee</span>
            <span className="text-2xl">₦5,000</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Processing Fee</span>
            <span>₦500</span>
          </div>
          <div className="border-t border-border mt-4 pt-4 flex justify-between items-center">
            <span>Total Amount</span>
            <span className="text-2xl text-primary">₦5,500</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Select
            value={formData.paymentMethod}
            onValueChange={(value) =>
              setFormData({ ...formData, paymentMethod: value })
            }
          >
            <SelectTrigger className="rounded-lg">
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

// Step 4: Review
function Step4({ formData }: { formData: ApplicationFormData }) {
  return (
    <>
      <CardHeader>
        <CardTitle>Review & Submit</CardTitle>
        <CardDescription>
          Review your application before submission
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-secondary/10 rounded-xl p-6 space-y-4">
          <h4 className="font-semibold">Personal Information</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Full Name</p>
              <p>{formData.fullName || "Not provided"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">NIN</p>
              <p>{formData.nin || "Not provided"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date of Birth</p>
              <p>{formData.dob || "Not provided"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Phone</p>
              <p>{formData.phone || "Not provided"}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <p className="text-sm text-green-900">Payment Confirmed</p>
            <p className="text-xs text-muted-foreground">
              Transaction ID: PAY-2025-12345
            </p>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          By submitting this application, you confirm that all information
          provided is accurate and complete.
        </div>
      </CardContent>
    </>
  );
}
