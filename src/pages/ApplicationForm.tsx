import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";
import { Shield, Upload, CheckCircle } from "lucide-react";

interface ApplicationFormProps {
  onNavigate: (page: string) => void;
}

export function ApplicationForm({ onNavigate }: ApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const [formData, setFormData] = useState({
    // Step 1
    fullName: "",
    nin: "",
    dob: "",
    state: "",
    lga: "",
    village: "",
    phone: "",
    email: "",
    // Step 2
    landmark: "",
    address: "",
    // Step 3
    paymentMethod: ""
  });

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
              <div className="text-xl text-foreground">Certificate Application</div>
              <div className="text-xs text-muted-foreground">Step {currentStep} of {totalSteps}</div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Personal Details</span>
            <span>Requirements</span>
            <span>Payment</span>
            <span>Review</span>
          </div>
        </div>

        <Card className="rounded-xl shadow-lg">
          {currentStep === 1 && (
            <Step1 formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 2 && (
            <Step2 formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 3 && (
            <Step3 formData={formData} setFormData={setFormData} />
          )}
          {currentStep === 4 && (
            <Step4 formData={formData} onSubmit={handleSubmit} />
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
                  Submit Application
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <button 
            onClick={() => onNavigate('landing')}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Cancel application
          </button>
        </div>
      </div>
    </div>
  );
}

function Step1({ formData, setFormData }: any) {
  return (
    <>
      <CardHeader>
        <CardTitle>Personal Details</CardTitle>
        <CardDescription>Enter your personal information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input 
              placeholder="As shown on NIN"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className="rounded-lg"
            />
          </div>
          <div className="space-y-2">
            <Label>National Identification Number</Label>
            <Input 
              placeholder="11-digit NIN"
              value={formData.nin}
              onChange={(e) => setFormData({...formData, nin: e.target.value})}
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
              onChange={(e) => setFormData({...formData, dob: e.target.value})}
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
          <Label>Email Address</Label>
          <Input 
            type="email"
            placeholder="your.email@example.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            className="rounded-lg"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>State</Label>
            <Select value={formData.state} onValueChange={(value) => setFormData({...formData, state: value})}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lagos">Lagos</SelectItem>
                <SelectItem value="kano">Kano</SelectItem>
                <SelectItem value="rivers">Rivers</SelectItem>
                <SelectItem value="kaduna">Kaduna</SelectItem>
                <SelectItem value="oyo">Oyo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Local Government</Label>
            <Select value={formData.lga} onValueChange={(value) => setFormData({...formData, lga: value})}>
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
            onChange={(e) => setFormData({...formData, village: e.target.value})}
            className="rounded-lg"
          />
        </div>
      </CardContent>
    </>
  );
}

function Step2({ formData, setFormData }: any) {
  return (
    <>
      <CardHeader>
        <CardTitle>Additional Requirements</CardTitle>
        <CardDescription>Upload required documents and provide additional information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Letter from Traditional Ruler</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground mt-1">PDF, PNG, JPG (MAX. 5MB)</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Residential Address</Label>
          <Textarea 
            placeholder="Enter your full residential address"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            className="rounded-lg min-h-24"
          />
        </div>

        <div className="space-y-2">
          <Label>Notable Landmark</Label>
          <Textarea 
            placeholder="Describe a notable landmark near your residence"
            value={formData.landmark}
            onChange={(e) => setFormData({...formData, landmark: e.target.value})}
            className="rounded-lg min-h-24"
          />
        </div>
      </CardContent>
    </>
  );
}

function Step3({ formData, setFormData }: any) {
  return (
    <>
      <CardHeader>
        <CardTitle>Payment</CardTitle>
        <CardDescription>Complete payment to process your application</CardDescription>
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
          <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
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

function Step4({ formData, onSubmit }: any) {
  return (
    <>
      <CardHeader>
        <CardTitle>Review & Submit</CardTitle>
        <CardDescription>Review your application before submission</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-secondary/10 rounded-xl p-6 space-y-4">
          <h4>Personal Information</h4>
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
              <p className="text-muted-foreground">State</p>
              <p>{formData.state || "Not provided"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Local Government</p>
              <p>{formData.lga || "Not provided"}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <p className="text-sm">Payment Confirmed</p>
            <p className="text-xs text-muted-foreground">Transaction ID: PAY-2025-12345</p>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          By submitting this application, you confirm that all information provided is accurate and complete.
        </div>
      </CardContent>
    </>
  );
}
