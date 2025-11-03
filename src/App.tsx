import { Landing } from "./pages/LandingPage/landingPageFunc";
import { Login } from "./pages/Login/loginFunc";
import { Register } from "./pages/Register/registerFunc";
import { ApplicationForm } from "./pages/ApplicationForm";
import { ApplicantDashboard } from "./pages/ApplicantDashboard";
import { CertificateDownload } from "./pages/CertificateDownload";
import { CertificateVerification } from "./pages/CertificateVerification";
import { LGAdminDashboard } from "./pages/LGAdminDashboard";
import { SuperAdminDashboard } from "./pages/SuperAdminDashboard";
import { DigitizationFlow } from "./pages/DigitizationFlow";
import { AdminOnboarding } from "./pages/Admin/adminOnboardFunc";
import { Toaster } from "./components/ui/sonner";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import type { ComponentType } from "react";

export default function App() {
  // route name -> path mapping (keeps existing onNavigate string API working)
  const routeMap: Record<string, string> = {
    landing: "/",
    login: "/login",
    register: "/register",
    "application-form": "/application-form",
    "applicant-dashboard": "/applicant-dashboard",
    "digitization-flow": "/digitization-flow",
    "certificate-download": "/certificate-download",
    verify: "/verify",
    "lg-admin-dashboard": "/lg-admin-dashboard",
    "super-admin-dashboard": "/super-admin-dashboard",
    "admin-onboarding": "/admin-onboarding",
  };

  // wrapper to inject onNavigate prop (using react-router navigation)
  function WithNavigate({ Component }: { Component: ComponentType<any> }) {
    const navigate = useNavigate();
    const handleNavigate = (page: string) => {
      const path = routeMap[page] ?? "/";
      navigate(path);
      window.scrollTo(0, 0);
    };
    return <Component onNavigate={handleNavigate} />;
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WithNavigate Component={Landing} />} />
          <Route path="/login" element={<WithNavigate Component={Login} />} />
          <Route
            path="/register"
            element={<WithNavigate Component={Register} />}
          />
          <Route
            path="/application-form"
            element={<WithNavigate Component={ApplicationForm} />}
          />
          <Route
            path="/applicant-dashboard"
            element={<WithNavigate Component={ApplicantDashboard} />}
          />
          <Route
            path="/digitization-flow"
            element={<WithNavigate Component={DigitizationFlow} />}
          />
          <Route
            path="/certificate-download"
            element={<WithNavigate Component={CertificateDownload} />}
          />
          <Route
            path="/verify"
            element={<WithNavigate Component={CertificateVerification} />}
          />
          <Route
            path="/lg-admin-dashboard"
            element={<WithNavigate Component={LGAdminDashboard} />}
          />
          <Route
            path="/super-admin-dashboard"
            element={<WithNavigate Component={SuperAdminDashboard} />}
          />
          <Route
            path="/admin-onboarding"
            element={<WithNavigate Component={AdminOnboarding} />}
          />
          <Route path="*" element={<WithNavigate Component={Landing} />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </>
  );
}
