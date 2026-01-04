import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import {
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  Shield,
  Loader2,
} from "lucide-react";
import {
  Logo,
  StepProgress,
  PageContainer,
} from "../../DesignSystem/designSyetem";
import type { ApplicationFormData } from "../../Types/types";
import { FileUploadZone } from "../../components/FileUploadZone";

// ============================================================================
// PROPS INTERFACES
// ============================================================================

interface ApplicationFormDesignProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  formData: ApplicationFormData;
  setFormData: (data: ApplicationFormData) => void;

  states: any[];
  availableLGAs: any[];
  loadingStates: boolean;

  photoPreview: string | null;
  photoFile: File | null;
  photoUploading: boolean;
  photoProgress: number;
  photoError: string | null;
  handlePhotoUpload: (file: File) => void;
  removePhoto: () => void;

  ninSlipPreview: string | null;
  ninSlipFile: File | null;
  ninSlipUploading: boolean;
  ninSlipProgress: number;
  ninSlipError: string | null;
  handleNinSlipUpload: (file: File) => void;
  removeNinSlip: () => void;

  certificateAmount: number;
  paymentReference: string;
  isInitializingPayment: boolean;
  handleProceedToPayment: () => void;

  handleNext: () => void;
  handleBack: () => void;
  handleSubmit: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface Step1Props {
  formData: ApplicationFormData;
  setFormData: (data: ApplicationFormData) => void;
  states: any[];
  availableLGAs: any[];
  loadingStates: boolean;
  photoPreview: string | null;
  photoFile: File | null;
  photoUploading: boolean;
  photoProgress: number;
  photoError: string | null;
  handlePhotoUpload: (file: File) => void;
  removePhoto: () => void;
  ninSlipPreview: string | null;
  ninSlipFile: File | null;
  ninSlipUploading: boolean;
  ninSlipProgress: number;
  ninSlipError: string | null;
  handleNinSlipUpload: (file: File) => void;
  removeNinSlip: () => void;
}

interface Step2Props {
  formData: ApplicationFormData;
  setFormData: (data: ApplicationFormData) => void;
}

interface Step3Props {
  certificateAmount: number;
  paymentReference: string;
  isInitializingPayment: boolean;
  handleProceedToPayment: () => void;
}

interface Step4Props {
  formData: ApplicationFormData;
  paymentReference: string;
}

// ============================================================================
// MAIN DESIGN COMPONENT
// ============================================================================

export function ApplicationFormDesign({
  currentStep,
  totalSteps,
  progress,
  formData,
  setFormData,
  states,
  availableLGAs,
  loadingStates,
  photoPreview,
  photoFile,
  photoUploading,
  photoProgress,
  photoError,
  handlePhotoUpload,
  removePhoto,
  ninSlipPreview,
  ninSlipFile,
  ninSlipUploading,
  ninSlipProgress,
  ninSlipError,
  handleNinSlipUpload,
  removeNinSlip,
  certificateAmount,
  paymentReference,
  isInitializingPayment,
  handleProceedToPayment,
  handleNext,
  handleBack,
  handleSubmit,
  onCancel,
  isSubmitting = false,
}: ApplicationFormDesignProps) {
  const steps = ["Personal Details", "Requirements", "Payment", "Review"];
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleCancelClick = () => {
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    onCancel();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 to-white py-8 px-4">
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
            <Step1
              formData={formData}
              setFormData={setFormData}
              states={states}
              availableLGAs={availableLGAs}
              loadingStates={loadingStates}
              photoPreview={photoPreview}
              photoFile={photoFile}
              photoUploading={photoUploading}
              photoProgress={photoProgress}
              photoError={photoError}
              handlePhotoUpload={handlePhotoUpload}
              removePhoto={removePhoto}
              ninSlipPreview={ninSlipPreview}
              ninSlipFile={ninSlipFile}
              ninSlipUploading={ninSlipUploading}
              ninSlipProgress={ninSlipProgress}
              ninSlipError={ninSlipError}
              handleNinSlipUpload={handleNinSlipUpload}
              removeNinSlip={removeNinSlip}
            />
          )}
          {currentStep === 2 && (
            <Step2 formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 3 && (
            <Step3
              certificateAmount={certificateAmount}
              paymentReference={paymentReference}
              isInitializingPayment={isInitializingPayment}
              handleProceedToPayment={handleProceedToPayment}
            />
          )}
          {currentStep === 4 && (
            <Step4 formData={formData} paymentReference={paymentReference} />
          )}

          {/* Navigation Buttons */}
          <CardContent className="pt-0">
            <div className="flex gap-4 justify-between">
              {/* Back Button - Show on steps 2-4 (but not on step 4 if it's review) */}
              {currentStep > 1 && currentStep !== 4 && (
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="rounded-lg"
                  disabled={isSubmitting || isInitializingPayment}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}

              {/* For Steps 1-2: Show Next */}
              {currentStep < 3 && (
                <Button
                  onClick={handleNext}
                  className="ml-auto rounded-lg bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}

              {/* For Step 3 (Payment): Show different buttons based on payment status */}
              {currentStep === 3 && (
                <>
                  {!paymentReference ? (
                    // Show "Proceed to Payment" if payment not initialized
                    <Button
                      onClick={handleProceedToPayment}
                      className="ml-auto rounded-lg bg-primary hover:bg-primary/90"
                      disabled={isInitializingPayment}
                    >
                      {isInitializingPayment ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Initializing...
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Proceed to Payment
                        </>
                      )}
                    </Button>
                  ) : (
                    // Show "Next" if payment already initialized
                    <Button
                      onClick={handleNext}
                      className="ml-auto rounded-lg bg-primary hover:bg-primary/90"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </>
              )}

              {/* For Step 4 (Review): Show Submit */}
              {currentStep === 4 && (
                <Button
                  onClick={handleSubmit}
                  className="ml-auto rounded-lg bg-primary hover:bg-primary/90"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Cancel Link */}
        <div className="mt-6 text-center">
          <button
            onClick={handleCancelClick}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            disabled={isSubmitting || isInitializingPayment}
          >
            ← Cancel application
          </button>
        </div>

        {/* Minimal Cancel Confirmation Modal */}
        <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Cancel Application?</DialogTitle>
              <DialogDescription>Your progress will be lost.</DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(false)}
              >
                Continue Application
              </Button>
              <Button variant="destructive" onClick={handleConfirmCancel}>
                Yes, Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </div>
  );
}

// ============================================================================
// STEP COMPONENTS
// ============================================================================

// Step 1: Personal Details
function Step1({
  formData,
  setFormData,
  states,
  availableLGAs,
  loadingStates,
  photoPreview,
  photoFile,
  photoUploading,
  photoProgress,
  photoError,
  handlePhotoUpload,
  removePhoto,
  ninSlipPreview,
  ninSlipFile,
  ninSlipUploading,
  ninSlipProgress,
  ninSlipError,
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
            <Label>Profile Photo *</Label>
            <FileUploadZone
              onFileSelect={handlePhotoUpload}
              preview={photoPreview}
              fileName={photoFile?.name}
              fileSize={photoFile?.size}
              isUploading={photoUploading}
              uploadProgress={photoProgress}
              error={photoError}
              onRemove={removePhoto}
              accept={{
                "image/jpeg": [".jpg", ".jpeg"],
                "image/png": [".png"],
              }}
              maxSizeMB={2}
              label="Upload Profile Photo"
              description="Passport-style photo"
            />
          </div>

          {/* NIN Slip Upload */}
          <div className="space-y-2">
            <Label>NIN Slip *</Label>
            <FileUploadZone
              onFileSelect={handleNinSlipUpload}
              preview={ninSlipPreview}
              fileName={ninSlipFile?.name}
              fileSize={ninSlipFile?.size}
              isUploading={ninSlipUploading}
              uploadProgress={ninSlipProgress}
              error={ninSlipError}
              onRemove={removeNinSlip}
              accept={{
                "image/jpeg": [".jpg", ".jpeg"],
                "image/png": [".png"],
                "application/pdf": [".pdf"],
              }}
              maxSizeMB={5}
              label="Upload NIN Slip"
              description="PDF or image"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="As shown on NIN"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nin">National Identification Number *</Label>
            <Input
              id="nin"
              placeholder="11-digit NIN"
              value={formData.nin}
              onChange={(e) =>
                setFormData({ ...formData, nin: e.target.value })
              }
              className="rounded-lg"
              maxLength={11}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth *</Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={(e) =>
                setFormData({ ...formData, dob: e.target.value })
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

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Select
              value={formData.state}
              onValueChange={(value) =>
                setFormData({ ...formData, state: value, lga: "" })
              }
              disabled={loadingStates}
            >
              <SelectTrigger id="state" className="rounded-lg">
                <SelectValue
                  placeholder={
                    loadingStates ? "Loading states..." : "Select state"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(states) && states.length > 0 ? (
                  states.map((state) => (
                    <SelectItem key={state.id} value={state.id}>
                      {state.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-states" disabled>
                    {loadingStates ? "Loading..." : "No states available"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lga">Local Government *</Label>
            <Select
              value={formData.lga}
              onValueChange={(value) =>
                setFormData({ ...formData, lga: value })
              }
              disabled={!formData.state || loadingStates}
            >
              <SelectTrigger id="lga" className="rounded-lg">
                <SelectValue
                  placeholder={
                    formData.state ? "Select LGA" : "Select state first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(availableLGAs) && availableLGAs.length > 0 ? (
                  availableLGAs.map((lga) => (
                    <SelectItem key={lga.id} value={lga.id}>
                      {lga.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-lgas" disabled>
                    {formData.state
                      ? "No LGAs available"
                      : "Select a state first"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="village">Village/Community *</Label>
          <Input
            id="village"
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
function Step2({ formData, setFormData }: Step2Props) {
  return (
    <>
      <CardHeader>
        <CardTitle>Additional Requirements</CardTitle>
        <CardDescription>
          Provide additional information for your application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Residential Address *</Label>
          <Textarea
            id="address"
            placeholder="Enter your full residential address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="rounded-lg min-h-24"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="landmark">Notable Landmark *</Label>
          <Textarea
            id="landmark"
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
function Step3({
  certificateAmount,
  paymentReference,
  isInitializingPayment,
  handleProceedToPayment,
}: Step3Props) {
  const processingFee = 500;
  const applicationFee = certificateAmount - processingFee;

  return (
    <>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>
          Complete payment to process your certificate application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Breakdown */}
        <div className="bg-secondary/20 rounded-xl p-6">
          <h4 className="font-semibold mb-4">Payment Summary</h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Certificate Application Fee
              </span>
              <span className="text-lg">
                ₦{applicationFee.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Processing Fee</span>
              <span>₦{processingFee.toLocaleString()}</span>
            </div>

            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="font-semibold">Total Amount</span>
              <span className="text-3xl font-bold text-primary">
                ₦{certificateAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Reference - Show after initialization */}
        {paymentReference && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">
                  Payment Initialized
                </p>
                <p className="text-xs text-green-700 mt-1 font-mono">
                  Reference: {paymentReference}
                </p>
                <p className="text-xs text-green-600 mt-2">
                  ✓ Complete payment in the popup window, then submit your
                  application.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Payment Instructions */}
        {!paymentReference && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 mb-2">
                  How Payment Works
                </p>
                <ol className="text-xs text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Click "Proceed to Payment" button below</li>
                  <li>Paystack payment window will open in a new tab</li>
                  <li>Choose your payment method (Card/Bank/USSD)</li>
                  <li>Complete the payment securely</li>
                  <li>Return here to submit your application</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Payment Features */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-secondary/10 rounded-lg">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-sm font-medium">Secure Payment</p>
            <p className="text-xs text-muted-foreground mt-1">
              256-bit SSL encryption
            </p>
          </div>

          <div className="text-center p-4 bg-secondary/10 rounded-lg">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-sm font-medium">Multiple Options</p>
            <p className="text-xs text-muted-foreground mt-1">
              Card, Bank, USSD
            </p>
          </div>

          <div className="text-center p-4 bg-secondary/10 rounded-lg">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-sm font-medium">PCI Compliant</p>
            <p className="text-xs text-muted-foreground mt-1">
              Powered by Paystack
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>Your payment information is secure and encrypted</span>
        </div>
      </CardContent>
    </>
  );
}

// Step 4: Review
function Step4({ formData, paymentReference }: Step4Props) {
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
            <div>
              <p className="text-muted-foreground">Email</p>
              <p>{formData.email || "Not provided"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Local Government</p>
              <p>{formData.lga || "Not provided"}</p>
            </div>
          </div>
        </div>

        {/* Payment Confirmation */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-green-900 font-medium">
              Payment Reference
            </p>
            <p className="text-xs text-green-700 mt-1 font-mono">
              {paymentReference || "Awaiting payment"}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Your payment will be verified when you submit this application
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
