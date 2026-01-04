import { Landing } from "./pages/LandingPage/landingPageFunc";
import { Login } from "./pages/Login/loginFunc";
import { Register } from "./pages/Register/registerFunc";
import { SuperAdminRegister } from "./pages/Register/superAdminRegisterFunc";
import { ForgotPassword } from "./pages/ForgotPassword/forgotPasswordFunc";
import { ResetPassword } from "./pages/ResetPassword/resetPasswordFunc";
import { ApplicationForm } from "./pages/Application/applicationFormFunc";
import { ApplicantDashboard } from "./pages/Applicant/applicantDashboardFunc";
import { CertificateDownload } from "./pages/Certificate/certificateDownloadFunc";
import { CertificateVerification } from "./pages/Certificate/certificateVerificationFunc";
import { LGAdminDashboard } from "./pages/LGADashboard/lgAdminDashboardFunc";
import { SuperAdminDashboard } from "./pages/SuperAdmin/superAdminDashboardFunc";
import { DigitizationFlow } from "./pages/Digitalization/digitizationFunc";
import { AdminOnboarding } from "./pages/Admin/adminOnboardFunc";
import { Toaster } from "./components/ui/sonner";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./Context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/super-admin-register"
            element={<SuperAdminRegister />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify" element={<CertificateVerification />} />

          {/* Applicant Routes */}
          <Route
            path="/application-form"
            element={
              <ProtectedRoute allowedRoles={["applicant"]}>
                <ApplicationForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applicant-dashboard"
            element={
              <ProtectedRoute allowedRoles={["applicant"]}>
                <ApplicantDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/digitization-flow"
            element={
              <ProtectedRoute allowedRoles={["applicant"]}>
                <DigitizationFlow />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificate-download"
            element={
              <ProtectedRoute allowedRoles={["applicant"]}>
                <CertificateDownload />
              </ProtectedRoute>
            }
          />

          {/* LG Admin Routes */}
          <Route
            path="/lg-admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <LGAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-onboarding"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminOnboarding />
              </ProtectedRoute>
            }
          />

          {/* Super Admin Routes */}
          <Route
            path="/super-admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["superAdmin"]}>
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}
