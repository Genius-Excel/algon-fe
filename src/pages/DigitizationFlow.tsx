import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Shield, Upload, CheckCircle, FileText, AlertCircle } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface DigitizationFlowProps {
  onNavigate: (page: string) => void;
}

export function DigitizationFlow({ onNavigate }: DigitizationFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const [formData, setFormData] = useState({
    nin: "",
    email: "",
    phone: "",
    lga: "",
    certificateRef: "",
    paymentMethod: ""
  });

  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Mock submission - redirect to applicant dashboard
    onNavigate('applicant-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/20 to-white py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <div className="text-xl text-foreground">Certificate Digitization</div>
              <div className="text-xs text-muted-foreground">Step {currentStep} of {totalSteps}</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Convert your existing hard copy certificate to a digital version with QR code verification
          </p>
        </div>

        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Verify Identity</span>
            <span>Upload</span>
            <span>Payment</span>
            <span>Confirmation</span>
          </div>
        </div>

        <Card className="rounded-xl shadow-lg">
          {currentStep === 1 && (
            <DigitizationStep1 formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 2 && (
            <DigitizationStep2 
              formData={formData} 
              setFormData={setFormData}
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
            />
          )}
          {currentStep === 3 && (
            <DigitizationStep3 formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 4 && (
            <DigitizationStep4 formData={formData} onSubmit={handleSubmit} />
          )}

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
                <Button 
                  onClick={handleNext}
                  className="ml-auto rounded-lg"
                >
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  className="ml-auto rounded-lg"
                >
                  Submit Request
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <button 
            onClick={() => onNavigate('applicant-dashboard')}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Cancel and return to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function DigitizationStep1({ formData, setFormData }: any) {
  return (
    <>
      <CardHeader>
        <CardTitle>Verify Your Identity</CardTitle>
        <CardDescription>Enter your identification details to begin the digitization process</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-blue-900">
              You must already possess a valid hard copy certificate issued by your Local Government to use this service.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>National Identification Number (NIN)</Label>
          <Input 
            placeholder="Enter your 11-digit NIN"
            value={formData.nin}
            onChange={(e) => setFormData({...formData, nin: e.target.value})}
            className="rounded-lg"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Email Address</Label>
            <Input 
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input 
              type="tel"
              placeholder="080XXXXXXXX"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="rounded-lg"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Local Government</Label>
          <Select value={formData.lga} onValueChange={(value) => setFormData({...formData, lga: value})}>
            <SelectTrigger className="rounded-lg">
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

function DigitizationStep2({ formData, setFormData, uploadedFile, setUploadedFile }: any) {
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
        <CardDescription>Upload a clear scan or photo of your existing hard copy certificate</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Certificate Document</Label>
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
              <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG (MAX. 10MB)</p>
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
          <Label>Certificate Reference Number (Optional)</Label>
          <Input 
            placeholder="e.g., CERT-IKJ-2020-045"
            value={formData.certificateRef}
            onChange={(e) => setFormData({...formData, certificateRef: e.target.value})}
            className="rounded-lg"
          />
          <p className="text-xs text-muted-foreground">If available, enter the reference number from your hard copy certificate</p>
        </div>

        <div className="bg-secondary/20 rounded-lg p-4">
          <p className="text-sm mb-2">Example of acceptable certificate image:</p>
          <div className="border border-border rounded-lg overflow-hidden bg-white">
            <div className="p-6 text-center">
              <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">Sample Certificate Document</p>
              <p className="text-xs text-muted-foreground mt-1">Clear, legible, all text visible</p>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
}

function DigitizationStep3({ formData, setFormData }: any) {
  return (
    <>
      <CardHeader>
        <CardTitle>Payment - Reduced Fee</CardTitle>
        <CardDescription>Complete payment to process your certificate digitization</CardDescription>
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
            <span className="text-green-800">💡 Reduced Fee:</span> This is a one-time fee to convert your hard copy certificate to a digital version. 
            This is significantly lower than applying for a new certificate (₦5,500).
          </p>
        </div>

        <div className="space-y-2">
          <Label>Payment Method</Label>
          <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
            <SelectTrigger className="rounded-lg">
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="card">Debit/Credit Card (Paystack)</SelectItem>
              <SelectItem value="bank">Bank Transfer</SelectItem>
              <SelectItem value="ussd">USSD</SelectItem>
              <SelectItem value="flutterwave">Flutterwave</SelectItem>
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

function DigitizationStep4({ formData, onSubmit }: any) {
  return (
    <>
      <CardHeader>
        <CardTitle>Confirmation & Review</CardTitle>
        <CardDescription>Your digitization request is being processed</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <p className="text-sm text-green-900">Payment Confirmed</p>
            <p className="text-xs text-muted-foreground">Transaction ID: DIGI-PAY-2025-45678</p>
          </div>
        </div>

        <div className="bg-secondary/10 rounded-xl p-6 space-y-4">
          <h4>Digitization Request Summary</h4>
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
              <p className="text-sm text-muted-foreground">Certificate Reference</p>
              <p className="text-sm">{formData.certificateRef}</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm">Document Uploaded</p>
              <p className="text-xs text-muted-foreground">Your certificate has been received</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm">Payment Confirmed</p>
              <p className="text-xs text-muted-foreground">₦2,300 payment successful</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs">
              <span>3</span>
            </div>
            <div>
              <p className="text-sm">Digitization in Review</p>
              <p className="text-xs text-muted-foreground">Your request is being reviewed by LG Admin</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-muted-foreground text-xs">
              <span>4</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Digital Certificate Ready</p>
              <p className="text-xs text-muted-foreground">Available for download after approval</p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            Your request will be reviewed within 2-3 business days. You will receive an email notification 
            when your digital certificate is ready for download.
          </p>
        </div>
      </CardContent>
    </>
  );
}
