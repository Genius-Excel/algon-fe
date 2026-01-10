import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CertificateVerificationDesign } from "./certificateVerificationDesign";
import { toast } from "sonner";
import { certificateService } from "../../services";
import type { CertificateVerificationResponse } from "../../Types/types";

type VerificationResult = "valid" | "invalid" | null;

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

export function CertificateVerification() {
  const navigate = useNavigate();
  const [certificateId, setCertificateId] = useState("");
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult>(null);
  const [certificateData, setCertificateData] =
    useState<CertificateData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!certificateId.trim()) {
      toast.error("Please enter a certificate ID");
      return;
    }

    setIsLoading(true);
    setVerificationResult(null);
    setCertificateData(null);

    try {
      const response: CertificateVerificationResponse =
        await certificateService.verifyCertificate(certificateId);

      // Check if certificate is valid based on status
      if (
        response.data.status === "approved" ||
        response.data.status === "valid"
      ) {
        setVerificationResult("valid");

        // Map API response to local CertificateData format
        setCertificateData({
          holderName: response.data.certificate_type || "Certificate Holder",
          certificateId: response.data.certificate_number,
          lga: "N/A", // May need to be added to API response
          state: "N/A", // May need to be added to API response
          issueDate: new Date(response.data.issued_at).toLocaleDateString(),
          status: response.data.status,
          expiryDate: response.data.expiry_date
            ? new Date(response.data.expiry_date).toLocaleDateString()
            : undefined,
        });

        toast.success(response.message || "Certificate verified successfully!");
      } else {
        setVerificationResult("invalid");
        toast.error("Certificate is not valid or has been revoked");
      }
    } catch (error: any) {
      console.error("Verification error:", error);
      setVerificationResult("invalid");

      const status = error.response?.status;
      const errorData = error.response?.data;

      // Handle specific HTTP status codes per API spec
      if (status === 400) {
        toast.error(errorData?.message || "Invalid or missing certificate ID");
      } else if (status === 401 || status === 403) {
        toast.error(
          "Authentication failed. Please log in to verify certificates."
        );
      } else if (status === 404) {
        toast.error(
          errorData?.message ||
            "Certificate not found. Please check the certificate ID."
        );
      } else if (status === 500) {
        toast.error(
          "Server error occurred. Please try again later or contact support."
        );
      } else {
        toast.error(
          errorData?.message ||
            "Failed to verify certificate. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CertificateVerificationDesign
      certificateId={certificateId}
      setCertificateId={setCertificateId}
      verificationResult={verificationResult}
      certificateData={certificateData} // ✅ Pass real data
      isLoading={isLoading}
      handleVerify={handleVerify}
      onNavigate={(page: string) =>
        navigate(page === "landing" ? "/" : `/${page}`)
      }
    />
  );
}
