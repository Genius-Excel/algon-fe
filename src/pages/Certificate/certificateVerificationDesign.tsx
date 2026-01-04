import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Shield,
  Search,
  CheckCircle,
  XCircle,
  Calendar,
  MapPin,
  User,
} from "lucide-react";

type VerificationResult = 'valid' | 'invalid' | null;

interface CertificateData {
  holderName: string;
  certificateId: string;
  lga: string;
  state: string;
  issueDate: string;
  status: string;
  nin?: string;
  expiryDate?: string;
}


interface CertificateVerificationDesignProps {
  certificateId: string;
  setCertificateId: (id: string) => void;
  verificationResult: VerificationResult;
  certificateData: CertificateData | null; // ✅ Add this
  isLoading: boolean;
  handleVerify: (e: React.FormEvent) => void;
  onNavigate: (page: string) => void;
}


export function CertificateVerificationDesign({
  certificateId,
  setCertificateId,
  verificationResult,
  certificateData,
  isLoading,
  handleVerify,
  onNavigate,
}: CertificateVerificationDesignProps) {
  const navigate = useNavigate(); // ✅ Use hook for new navigation

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 to-white">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-foreground">LGCIVS</div>
                <div className="text-xs text-muted-foreground">
                  Certificate Verification
                </div>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}> {/* ✅ Direct navigation */}
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="mb-4">Verify Certificate</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Enter the certificate ID to verify the authenticity of a Local
            Government Indigene Certificate
          </p>
        </div>

        {/* Verification Form */}
        <Card className="rounded-xl shadow-lg mb-8">
          <CardHeader>
            <CardTitle>Enter Certificate Details</CardTitle>
            <CardDescription>
              The certificate ID can be found on the certificate document
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="flex gap-4">
                <Input
                  placeholder="Enter Certificate ID (e.g., CERT-IKJ-2025-001)"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  className="rounded-lg flex-1"
                />
                <Button
                  type="submit"
                  className="rounded-lg"
                  disabled={isLoading}
                >
                  <Search className="w-4 h-4 mr-2" />
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Verification Result - Valid */}
        {verificationResult === "valid" && certificateData && (
          <Card className="rounded-xl shadow-lg border-2 border-green-200 bg-green-50">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-green-800 mb-2">Certificate Verified</h2>
                <p className="text-green-700">
                  This certificate is authentic and valid
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Certificate Holder
                      </p>
                      <p className="text-sm">{certificateData.holderName}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Certificate ID
                      </p>
                      <p className="text-sm">{certificateData.certificateId}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Local Government
                      </p>
                      <p className="text-sm">{certificateData.lga}, {certificateData.state}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Issue Date
                      </p>
                      <p className="text-sm">{new Date(certificateData.issueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="text-sm text-green-600">{certificateData.status}</p>
                    </div>
                    <div className="w-20 h-20 border-2 border-border rounded-lg flex items-center justify-center">
                      <div className="text-xs text-center text-muted-foreground">
                        QR Code
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center text-sm text-green-700">
                This certificate was verified on {new Date().toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verification Result - Invalid */}
        {verificationResult === "invalid" && (
          <Card className="rounded-xl shadow-lg border-2 border-red-200 bg-red-50">
            <CardContent className="p-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-red-800 mb-2">Invalid Certificate</h2>
                <p className="text-red-700 mb-6">
                  The certificate ID you entered could not be verified. Please
                  check and try again.
                </p>
                <div className="bg-white rounded-xl p-6 text-left space-y-3">
                  <p className="text-sm">Possible reasons:</p>
                  <ul className="text-sm text-muted-foreground space-y-2 ml-4">
                    <li>• Incorrect certificate ID</li>
                    <li>• Certificate has been revoked</li>
                    <li>• Certificate has expired</li>
                    <li>• Fraudulent certificate</li>
                  </ul>
                </div>
                <p className="text-sm text-red-700 mt-6">
                  If you believe this is an error, please contact your Local
                  Government office.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        {!verificationResult && (
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle>How to Verify</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p>Locate the Certificate ID</p>
                    <p className="text-sm text-muted-foreground">
                      Find the unique certificate ID on the certificate document
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p>Enter the ID</p>
                    <p className="text-sm text-muted-foreground">
                      Type or paste the certificate ID in the search box above
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p>Verify Instantly</p>
                    <p className="text-sm text-muted-foreground">
                      Click verify to check the certificate's authenticity
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}