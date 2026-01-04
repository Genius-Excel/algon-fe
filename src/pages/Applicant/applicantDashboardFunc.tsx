import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ApplicantDashboardDesign } from "./applicantDashboardDesign";
import { ApplicationDetailsModal } from "../../components/ApplicationDetailsModal";
import { toast } from "sonner";
import type { Application } from "../../Types/types";
import { applicationService } from "../../services"; // ✅ Import service
import { useAuth } from "../../hooks/useAuth"; // ✅ Import auth hook
import { tokenManager } from "../../utils/tokenManager"; // ✅ Import tokenManager

export function ApplicantDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth(); // ✅ Get logout from auth
  const [activeTab, setActiveTab] = useState<
    "overview" | "applications" | "certificates"
  >("overview");

  // ✅ Get user name from stored data
  const userData = tokenManager.getUserData();
  const userName = userData?.name || "User";

  // ✅ State for API data
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // ✅ Fetch data on component mount
  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Call API service with pagination
      const response = await applicationService.getMyApplications({
        application_type: "certificate",
        limit: 50,
        offset: 0,
      });

      // Handle the new paginated response structure
      const applications = response.data.results || response.data || [];

      // Transform API response to match Application type
      const transformedApplications: Application[] = applications.map(
        (app: any) => ({
          id: app.id,
          name: app.full_name || app.name,
          nin: app.nin,
          status: app.application_status || app.status,
          payment: app.payment_status || app.payment,
          dateProcessed: app.approved_at || app.dateProcessed || app.updated_at,
          dateApplied: app.created_at || app.dateApplied,
          village: app.village,
          lga:
            typeof app.local_government === "object"
              ? app.local_government?.name
              : app.local_government || app.lga,
          state: typeof app.state === "object" ? app.state?.name : app.state,
          email: app.email,
          phone: app.phone_number || app.phone,
        })
      );

      setApplications(transformedApplications);
    } catch (error: any) {
      console.error("Failed to load applications:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to load applications";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Calculate stats from real data
  const currentApplication =
    applications.find(
      (app) => app.status === "under-review" || app.status === "pending"
    ) ||
    applications[0] ||
    null;

  const stats = {
    total: applications.length,
    approved: applications.filter((app) => app.status === "approved").length,
    pending: applications.filter(
      (app) => app.status === "under-review" || app.status === "pending"
    ).length,
  };

  const handleLogout = async () => {
    toast("Are you sure you want to logout?", {
      action: {
        label: "Logout",
        onClick: async () => {
          try {
            await logout(); // ✅ Use auth service
            navigate("/");
          } catch (error) {
            console.error("Logout error:", error);
            // Clear local data even if API call fails
            navigate("/");
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  // ✅ Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your applications...</p>
        </div>
      </div>
    );
  }

  // ✅ Show error state
  if (error && applications.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadApplications}
            className="text-primary hover:underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const handleViewDetails = (application: Application) => {
    setSelectedApplication(application);
    setIsDetailsModalOpen(true);
  };

  return (
    <>
      <ApplicantDashboardDesign
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        applications={applications}
        currentApplication={currentApplication}
        stats={stats}
        onNavigate={(page: string) => {
          const routes: Record<string, string> = {
            "application-form": "/application-form",
            "digitization-flow": "/digitization-flow",
            verify: "/verify",
            "certificate-download": "/certificate-download",
          };
          navigate(routes[page] || "/");
        }}
        handleLogout={handleLogout}
        onViewDetails={handleViewDetails}
      />
      <ApplicationDetailsModal
        application={selectedApplication}
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </>
  );
}
