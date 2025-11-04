import { CertificateDownloadDesign } from "./certificateDownloadDesign";
import type { CertificateDownloadProps } from "../../Types/types";

export function CertificateDownload({ onNavigate, isDigitized = false }: CertificateDownloadProps) {
  const handleDownload = () => {
    // Mock download - replace with actual API call
    console.log("Downloading certificate...");
    // In production: trigger actual file download
  };

  return (
    <CertificateDownloadDesign
      onNavigate={onNavigate}
      isDigitized={isDigitized}
      handleDownload={handleDownload}
    />
  );
}