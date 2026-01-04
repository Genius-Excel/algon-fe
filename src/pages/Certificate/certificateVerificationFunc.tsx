import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CertificateVerificationDesign } from "./certificateVerificationDesign";
import { toast } from "sonner";
import { certificateService } from "../../services"; // ✅ Import service

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

export function CertificateVerification() {
  const navigate = useNavigate();
  const [certificateId, setCertificateId] = useState("");
  const [verificationResult, setVerificationResult] = useState<VerificationResult>(null);
  const [certificateData, setCertificateData] = useState<CertificateData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!certificateId.trim()) {
      toast.error('Please enter a certificate ID');
      return;
    }

    setIsLoading(true);
    setVerificationResult(null);
    setCertificateData(null);

    try {
      // ✅ Call API service
      const data = await certificateService.verifyCertificate(certificateId);
      
      if (data.valid) {
        setVerificationResult('valid');
        setCertificateData(data.certificate);
        toast.success('Certificate verified successfully!');
      } else {
        setVerificationResult('invalid');
        toast.error('Certificate verification failed');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      setVerificationResult('invalid');
      
      const errorMessage = error.response?.data?.message 
        || 'Failed to verify certificate. Please try again.';
      toast.error(errorMessage);
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
      onNavigate={(page: string) => navigate(page === 'landing' ? '/' : `/${page}`)}
    />
  );
}