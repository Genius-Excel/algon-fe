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
import {
  Upload,
  CheckCircle,
  FileText,
  AlertCircle,
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
import type { DigitizationFormData, StateWithLGAs } from "../../Types/types";

// ============================================================================
// PROPS INTERFACES
// ============================================================================

interface DigitizationFlowDesignProps {
  currentStep: number;
  totalSteps: number;
  progress: number;
  formData: DigitizationFormData;
  setFormData: (data: DigitizationFormData) => void;
  states: StateWithLGAs[];
  availableLGAs: any[];
  loadingStates: boolean;

  photoPreview: string | null;
  photoFile: File | null;
  photoUploading: boolean;
  photoProgress: number;
  photoError: string | null;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: () => void;

  ninSlipPreview: string | null;
  ninSlipFile: File | null;
  ninSlipUploading: boolean;
  ninSlipProgress: number;
  ninSlipError: string | null;
  handleNinSlipUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeNinSlip: () => void;

  certificatePreview: string | null;
  certificateFile: File | null;
  certificateUploading: boolean;
  certificateProgress: number;
  certificateError: string | null;
  handleCertificateUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeCertificate: () => void;

  digitizationAmount: number;
  paymentReference: string;
  isInitializingPayment: boolean;
  handleProceedToPayment: () => void;

  handleNext: () => void;
  handleBack: () => void;
  handleSubmit: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

interface Step1Props {
  formData: DigitizationFormData;
  setFormData: (data: DigitizationFormData) => void;
  states: StateWithLGAs[];
  availableLGAs: any[];
  loadingStates: boolean;
  photoPreview: string | null;
  ninSlipPreview: string | null;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: () => void;
  handleNinSlipUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeNinSlip: () => void;
}

interface Step2Props {
  certificatePreview: string | null;
  handleCertificateUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeCertificate: () => void;
  formData: DigitizationFormData;
  setFormData: (data: DigitizationFormData) => void;
}

interface Step3Props {
  digitizationAmount: number;
  paymentReference: string;
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
  states,
  availableLGAs,
  loadingStates,
  photoPreview,
  ninSlipPreview,
  certificatePreview,
  handlePhotoUpload,
  removePhoto,
  handleNinSlipUpload,
  removeNinSlip,
  handleCertificateUpload,
  removeCertificate,
  digitizationAmount,
  paymentReference,
  isInitializingPayment,
  handleProceedToPayment,
  handleNext,
  handleBack,
  handleSubmit,
  onCancel,
  isSubmitting = false,
}: DigitizationFlowDesignProps) {
  const steps = ["Verify Identity", "Upload", "Payment", "Confirmation"];
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
          <h2 className="text-xl mb-2">Certificate Digitization</h2>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Convert your existing hard copy certificate to a digital version
            with QR code verification
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
              states={states}
              availableLGAs={availableLGAs}
              loadingStates={loadingStates}
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
              certificatePreview={certificatePreview}
              handleCertificateUpload={handleCertificateUpload}
              removeCertificate={removeCertificate}
              formData={formData}
              setFormData={setFormData}
            />
          )}
          {currentStep === 3 && (
            <Step3
              digitizationAmount={digitizationAmount}
              paymentReference={paymentReference}
            />
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
                  disabled={isSubmitting || isInitializingPayment}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              )}
              {currentStep < totalSteps ? (
                currentStep === 3 && !paymentReference ? (
                  <Button
                    onClick={handleProceedToPayment}
                    className="ml-auto rounded-lg bg-primary hover:bg-primary/90"
                    disabled={isInitializingPayment}
                  >
                    {isInitializingPayment ? (
                      "Initializing..."
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 mr-2" />
                        Proceed to Payment
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="ml-auto rounded-lg bg-primary hover:bg-primary/90"
                    disabled={isSubmitting}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )
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
            onClick={handleCancelClick}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            disabled={isSubmitting}
          >
            ← Cancel and return to dashboard
          </button>
        </div>

        {/* Minimal Cancel Confirmation Modal */}
        <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>Cancel Digitization?</DialogTitle>
              <DialogDescription>Your progress will be lost.</DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setShowCancelModal(false)}
              >
                Continue
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

// Step 1: Verify Identity
function Step1({
  formData,
  setFormData,
  states,
  availableLGAs,
  loadingStates,
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
                  JPG, PNG (MAX. 1MB)
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
                  JPG, PNG, PDF (MAX. 2MB)
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

        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            placeholder="Enter your full name"
            value={formData.full_name}
            onChange={(e) =>
              setFormData({ ...formData, full_name: e.target.value })
            }
            className="rounded-lg"
          />
          <p className="text-xs text-muted-foreground">
            Enter your full name as it appears on your certificate
          </p>
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
              maxLength={11}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="state">State *</Label>
            <Select
              value={formData.state}
              onValueChange={(value) => {
                setFormData({ ...formData, state: value, lga: "" });
              }}
              disabled={loadingStates}
            >
              <SelectTrigger id="state" className="rounded-lg">
                <SelectValue
                  placeholder={
                    loadingStates ? "Loading states..." : "Select your State"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.id} value={state.id}>
                    {state.name}
                  </SelectItem>
                ))}
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
              disabled={!formData.state || availableLGAs.length === 0}
            >
              <SelectTrigger id="lga" className="rounded-lg">
                <SelectValue
                  placeholder={
                    !formData.state ? "Select state first" : "Select your LGA"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableLGAs.map((lga: any) => (
                  <SelectItem key={lga.id} value={lga.id}>
                    {lga.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </>
  );
}

// Step 2: Upload Certificate
function Step2({
  certificatePreview,
  handleCertificateUpload,
  removeCertificate,
  formData,
  setFormData,
}: Step2Props) {
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
          <div className="space-y-3">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleCertificateUpload}
              className="hidden"
              id="certificate-upload"
            />
            <label
              htmlFor="certificate-upload"
              className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer block"
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, PNG, JPG (MAX. 3MB)
              </p>
            </label>

            {certificatePreview && (
              <div className="flex justify-center">
                <div className="relative">
                  {certificatePreview === "pdf" ? (
                    <div className="w-32 h-32 bg-red-100 border-2 border-red-200 rounded-lg flex items-center justify-center">
                      <FileText className="w-12 h-12 text-red-600" />
                    </div>
                  ) : (
                    <img
                      src={certificatePreview}
                      alt="Certificate preview"
                      className="w-32 h-32 rounded-lg object-cover border-2 border-border"
                    />
                  )}
                  <button
                    type="button"
                    onClick={removeCertificate}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
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
          <p className="text-sm mb-2">
            Example of acceptable certificate image:
          </p>
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
function Step3({ digitizationAmount, paymentReference }: Step3Props) {
  const processingFee = 500;
  // digitizationAmount already includes the total, so calculate the base fee
  const baseFee = digitizationAmount > 0 ? digitizationAmount : 0;
  const totalAmount = baseFee + processingFee;

  return (
    <>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>
          Complete payment to digitize your certificate
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Breakdown */}
        <div className="bg-secondary/20 rounded-xl p-6">
          <h4 className="font-semibold mb-4">Payment Summary</h4>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Certificate Digitization Fee
              </span>
              <span className="text-lg">₦{baseFee.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Processing Fee</span>
              <span>₦{processingFee.toLocaleString()}</span>
            </div>

            <div className="border-t border-border pt-3 flex justify-between items-center">
              <span className="font-semibold">Total Amount</span>
              <span className="text-3xl font-bold text-primary">
                ₦{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Reference */}
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
                  request.
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
                  Digitization Payment
                </p>
                <p className="text-xs text-blue-700">
                  This payment is for digitizing your existing certificate. Your
                  old certificate will be converted to a secure digital format
                  with QR verification.
                </p>
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
