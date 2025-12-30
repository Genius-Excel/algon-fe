import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SuperAdminDashboardDesign } from "./superAdminDashboardDesign";
import type {
  LocalGovernment,
  AuditLogEntry,
  MonthlyData,
} from "../../Types/types";
import { adminService } from "../../services"; // ✅ Use service
import { toast } from "sonner";
import { tokenManager } from "../../utils/tokenManager";

export function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // ✅ State for data
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [monthlyRevenueData, setMonthlyRevenueData] = useState<any[]>([]);
  const [lgas, setLgas] = useState<LocalGovernment[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Load data on mount and tab change
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);

    try {
      if (activeTab === "lgas") {
        // Skip loading LGAs for now - endpoint not ready
        console.log("Skipping LGAs load - endpoint not implemented yet");
        setLgas([]);
      } else if (activeTab === "audit") {
        // Load audit logs
        try {
          const data = await adminService.getAuditLogs({
            page: 1,
            page_size: 50,
          });
          console.log("📋 Audit logs response:", data);
          setAuditLog(data.data?.results || data.results || []);
        } catch (auditError: any) {
          console.error("Audit logs error:", auditError);
          if (auditError.response?.status === 404) {
            console.warn("Audit logs endpoint not available yet");
            setAuditLog([]);
          } else {
            throw auditError;
          }
        }
      } else if (activeTab === "dashboard") {
        const response = await adminService.getSuperAdminDashboard();

        console.log("Super Admin Dashboard (full response):", response);

        // Check if response is HTML (backend doesn't support JWT authentication)
        if (
          typeof response === "string" &&
          response.includes("<!DOCTYPE html>")
        ) {
          console.error(
            "Backend returned HTML - endpoint doesn't support JWT authentication"
          );
          toast.error(
            "Dashboard endpoint not configured for JWT authentication. Contact backend team.",
            { duration: 5000 }
          );
          // Don't redirect - let user stay on dashboard with empty data
          setDashboardStats(null);
          setMonthlyData([]);
          setMonthlyRevenueData([]);
          return;
        }

        // Handle both response structures: with or without 'data' wrapper
        const dashboardData = response.data || response;

        // Check again if dashboardData is HTML
        if (
          typeof dashboardData === "string" &&
          dashboardData.includes("<!DOCTYPE html>")
        ) {
          console.error(
            "❌ Backend returned HTML - endpoint doesn't support JWT authentication"
          );
          toast.error(
            "Dashboard endpoint not configured for JWT authentication. Contact backend team.",
            { duration: 5000 }
          );
          // Don't redirect - let user stay on dashboard with empty data
          setDashboardStats(null);
          setMonthlyData([]);
          setMonthlyRevenueData([]);
          return;
        }

        console.log("Extracted dashboard data:", dashboardData);
        console.log("metric_cards:", dashboardData.metric_cards);
        console.log(
          "monthly_applications:",
          dashboardData.monthly_applications
        );
        console.log("monthly_revenue:", dashboardData.monthly_revenue);

        // Store the full dashboard stats
        setDashboardStats(dashboardData);

        // Map monthly applications for chart
        const applications =
          dashboardData.monthly_applications?.map((item: any) => ({
            month: new Date(item.month).toLocaleDateString("en-US", {
              month: "short",
            }),
            applications: item.total,
          })) || [];

        console.log("Mapped applications data:", applications);
        setMonthlyData(applications);

        // Map monthly revenue for chart
        const revenue =
          dashboardData.monthly_revenue?.map((item: any) => ({
            month: new Date(item.month).toLocaleDateString("en-US", {
              month: "short",
            }),
            revenue: item.total || 0,
          })) || [];

        console.log("Mapped revenue data:", revenue);
        setMonthlyRevenueData(revenue);
      }
    } catch (error: any) {
      console.error("Failed to load data:", error);
      console.error("Error response:", error.response);

      // Check if we got HTML instead of JSON (auth error)
      if (
        typeof error.response?.data === "string" &&
        error.response.data.includes("<!DOCTYPE html>")
      ) {
        toast.error("Authentication failed. Please login again.");
        navigate("/login");
      } else {
        toast.error(
          `Failed to load data: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLGAs = lgas.filter(
    (lga) =>
      lga.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lga.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lga.admin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      navigate("/");
    }
  };

  // Show loading
  if (
    isLoading &&
    !dashboardStats &&
    lgas.length === 0 &&
    auditLog.length === 0
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <SuperAdminDashboardDesign
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      dashboardStats={dashboardStats}
      monthlyData={monthlyData}
      monthlyRevenueData={monthlyRevenueData}
      lgas={lgas}
      filteredLGAs={filteredLGAs}
      auditLog={auditLog}
      handleLogout={handleLogout}
      onNavigate={(page: string) => navigate(`/${page}`)}
    />
  );
}
