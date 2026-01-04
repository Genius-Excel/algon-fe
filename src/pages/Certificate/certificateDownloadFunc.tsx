import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CertificateDownloadDesign } from "./certificateDownloadDesign";
import { toast } from 'sonner';
import { certificateService } from '../../services'; // ✅ Import service

interface CertificateDownloadProps {
  isDigitized?: boolean;
}

export function CertificateDownload({ isDigitized = false }: CertificateDownloadProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const certificateId = searchParams.get('id'); // ✅ Get ID from URL
  const [isDownloading, setIsDownloading] = useState(false);

  // ✅ Real download handler
  const handleDownload = async () => {
    if (!certificateId) {
      toast.error('Certificate ID not found');
      return;
    }

    setIsDownloading(true);

    try {
      // ✅ Call API service
      const blob = await certificateService.downloadCertificate(certificateId);
      
      // ✅ Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Certificate downloaded successfully!');
    } catch (error: any) {
      console.error('Download error:', error);
      toast.error(error.response?.data?.message || 'Failed to download certificate');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <CertificateDownloadDesign
      onNavigate={(page: string) => {
        const routes: Record<string, string> = {
          'verify': '/verify',
          'applicant-dashboard': '/applicant-dashboard',
        };
        navigate(routes[page] || '/');
      }}
      isDigitized={isDigitized}
      handleDownload={handleDownload}
      isDownloading={isDownloading} // ✅ Pass loading state
    />
  );
}