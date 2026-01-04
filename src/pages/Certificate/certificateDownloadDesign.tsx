import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Shield,
  Download,
  CheckCircle,
  Calendar,
  MapPin,
  User,
  BadgeCheck,
} from "lucide-react";

interface CertificateDownloadDesignProps {
  onNavigate: (page: string) => void; // Temporary
  isDigitized?: boolean;
  handleDownload: () => void;
  isDownloading: boolean;
}

export function CertificateDownloadDesign({
  onNavigate,
  isDigitized = false,
  handleDownload,
  isDownloading,
}: CertificateDownloadDesignProps) {
  const navigate = useNavigate(); // ✅ Use hook for new navigation

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 to-white">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-foreground">LGCIVS</div>
              <div className="text-xs text-muted-foreground">
                Certificate Download
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="mb-2">
            Certificate {isDigitized ? "Digitized" : "Approved"}!
          </h1>
          <p className="text-muted-foreground">
            {isDigitized
              ? "Your digitized certificate is ready for download"
              : "Your certificate is ready for download"}
          </p>
          {isDigitized && (
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg">
              <BadgeCheck className="w-4 h-4" />
              <span className="text-sm">Digitized Certificate</span>
            </div>
          )}
        </div>

        {/* Certificate Preview */}
        <Card className="rounded-xl shadow-lg mb-8">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-secondary/20 to-white p-12 rounded-t-xl border-b-4 border-primary">
              <div className="text-center space-y-6">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center">
                    <Shield className="w-12 h-12 text-primary" />
                  </div>
                </div>

                <div className="relative">
                  <p className="text-sm text-muted-foreground mb-2">
                    FEDERAL REPUBLIC OF NIGERIA
                  </p>
                  <h2 className="text-primary mb-1">
                    Local Government Indigene Certificate
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Certificate of Origin
                  </p>
                  {isDigitized && (
                    <div className="absolute -right-8 -top-4 rotate-12">
                      <div className="bg-purple-100 border-2 border-purple-300 text-purple-700 px-3 py-1 rounded text-xs opacity-80">
                        DIGITIZED
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-8 shadow-sm max-w-2xl mx-auto">
                  <p className="text-sm text-muted-foreground mb-4">
                    This is to certify that
                  </p>
                  <h3 className="text-primary mb-6">JOHN OLUWASEUN DOE</h3>

                  <p className="text-sm leading-relaxed text-muted-foreground mb-6">
                    is an indigene of{" "}
                    <span className="text-foreground">
                      Ikeja Local Government Area
                    </span>{" "}
                    in <span className="text-foreground">Lagos State</span>,
                    Federal Republic of Nigeria. This certificate is issued upon
                    satisfactory verification of the applicant's claim to
                    indigeneship.
                  </p>

                  <div className="grid md:grid-cols-2 gap-6 text-left mt-8">
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Full Name
                        </p>
                        <p className="text-sm">John Oluwaseun Doe</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Date of Birth
                        </p>
                        <p className="text-sm">January 15, 1995</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Local Government
                        </p>
                        <p className="text-sm">Ikeja LGA, Lagos State</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Certificate ID
                        </p>
                        <p className="text-sm">CERT-IKJ-2025-001</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-border">
                    <div className="flex justify-between items-end">
                      <div className="text-left">
                        <div className="w-32 h-0.5 bg-foreground mb-2"></div>
                        <p className="text-xs text-muted-foreground">
                          Authorized Signature
                        </p>
                        <p className="text-sm">LG Chairman</p>
                      </div>
                      <div className="w-24 h-24 border-2 border-border rounded-lg flex items-center justify-center">
                        <div className="text-xs text-center text-muted-foreground">
                          QR Code
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-xs text-muted-foreground">
                      Issue Date: October 15, 2025
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download Actions */}
        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg">
              <div>
                <p>Certificate Document</p>
                <p className="text-sm text-muted-foreground">
                  PDF Format • 1.2 MB
                </p>
              </div>
              <Button onClick={handleDownload} disabled={isDownloading}>
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? "Downloading..." : "Download PDF"}
              </Button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm">
                <span className="text-yellow-800">Note:</span> This certificate
                is valid for 7 days from the approval date. Please download and
                save your certificate within this period.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/verify")} // ✅ Direct navigation
              >
                Verify Certificate
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/applicant-dashboard")} // ✅ Direct navigation
              >
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
