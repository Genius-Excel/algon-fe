import { useState } from "react";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { ApplicationForm } from "./pages/ApplicationForm";
import { ApplicantDashboard } from "./pages/ApplicantDashboard";
import { CertificateDownload } from "./pages/CertificateDownload";
import { CertificateVerification } from "./pages/CertificateVerification";
import { LGAdminDashboard } from "./pages/LGAdminDashboard";
import { SuperAdminDashboard } from "./pages/SuperAdminDashboard";
import { DigitizationFlow } from "./pages/DigitizationFlow";
import { AdminOnboarding } from "./pages/AdminOnboarding";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onNavigate={handleNavigate} />;
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'register':
        return <Register onNavigate={handleNavigate} />;
      case 'application-form':
        return <ApplicationForm onNavigate={handleNavigate} />;
      case 'applicant-dashboard':
        return <ApplicantDashboard onNavigate={handleNavigate} />;
      case 'digitization-flow':
        return <DigitizationFlow onNavigate={handleNavigate} />;
      case 'certificate-download':
        return <CertificateDownload onNavigate={handleNavigate} />;
      case 'verify':
        return <CertificateVerification onNavigate={handleNavigate} />;
      case 'lg-admin-dashboard':
        return <LGAdminDashboard onNavigate={handleNavigate} />;
      case 'super-admin-dashboard':
        return <SuperAdminDashboard onNavigate={handleNavigate} />;
      case 'admin-onboarding':
        return <AdminOnboarding onNavigate={handleNavigate} />;
      default:
        return <Landing onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      {renderPage()}
      <Toaster />
    </>
  );
}
