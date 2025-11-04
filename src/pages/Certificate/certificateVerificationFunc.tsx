// src/pages/Certificate/certificateVerificationFunc.tsx
import { useState } from "react";
import { CertificateVerificationDesign } from "./certificateVerificationDesign";
import type { NavigationProps } from "../../Types/types";

type VerificationResult = 'valid' | 'invalid' | null;

export function CertificateVerification({ onNavigate }: NavigationProps) {
  const [certificateId, setCertificateId] = useState("");
  const [verificationResult, setVerificationResult] = useState<VerificationResult>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock verification - replace with actual API call
    setTimeout(() => {
      if (certificateId === "CERT-IKJ-2025-001" || certificateId.startsWith("CERT-")) {
        setVerificationResult('valid');
      } else {
        setVerificationResult('invalid');
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <CertificateVerificationDesign
      certificateId={certificateId}
      setCertificateId={setCertificateId}
      verificationResult={verificationResult}
      isLoading={isLoading}
      handleVerify={handleVerify}
      onNavigate={onNavigate}
    />
  );
}