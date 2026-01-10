import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SuperAdminDashboardDesign } from "./superAdminDashboardDesign";
import type { LocalGovernment, AuditLog, MonthlyData } from "../../Types/types";
import { adminService } from "../../services";
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
  const [auditLog, setAuditLog] = useState<AuditLog[]>([]);
  const [auditLogPage, setAuditLogPage] = useState(1);
  const [auditLogPageSize, setAuditLogPageSize] = useState(50);
  const [auditLogTotalCount, setAuditLogTotalCount] = useState(0);
  const [auditLogFilters, setAuditLogFilters] = useState<{
    action_type?: string;
    table_name?: string;
    user?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Load data on mount and tab change
  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);

    try {
      if (activeTab === "lgas") {
        // Load local governments
        try {
          const response = await adminService.getAllLGAs();
          console.log("🏛️ Local governments response:", response);
          // API returns { message: "...", data: [...] }
          setLgas(response.data || []);
        } catch (lgaError: any) {
          console.error("Local governments error:", lgaError);

          // Handle structured errors from the service
          if (lgaError.message) {
            if (lgaError.message.includes("Authentication failed")) {
              toast.error("Session expired. Please log in again.");
              navigate("/login");
              return;
            } else if (lgaError.message.includes("Access denied")) {
              toast.error(
                "You do not have permission to view local governments."
              );
            } else if (lgaError.message.includes("Too many requests")) {
              toast.error("Too many requests. Please wait a moment.");
            } else if (lgaError.message.includes("Server error")) {
              toast.error("Server error. Please try again later.");
            } else {
              toast.error(lgaError.message);
            }
          } else {
            toast.error("Failed to load local governments");
          }
          setLgas([]);
        }
      } else if (activeTab === "audit") {
        // Load audit logs with pagination and filters
        try {
          const data = await adminService.getAuditLogs({
            page: auditLogPage,
            page_size: auditLogPageSize,
            ...auditLogFilters,
          });
          console.log("📋 Audit logs response:", data);

          // Handle both response structures
          const results = data.data?.results || data.results || [];
          const count = data.data?.count || data.count || 0;

          setAuditLog(results);
          setAuditLogTotalCount(count);
        } catch (auditError: any) {
          console.error("Audit logs error:", auditError);

          const status = auditError.response?.status;
          const errorData = auditError.response?.data;

          // Handle specific HTTP status codes per API spec
          if (status === 400) {
            toast.error(
              errorData?.message || "Invalid query parameters for audit logs"
            );
          } else if (status === 401) {
            toast.error("Session expired. Please log in again.");
            setTimeout(() => navigate("/login"), 1500);
            return;
          } else if (status === 403) {
            toast.error(
              "You are not authorized to access audit logs. Super admin access required."
            );
          } else if (status === 404) {
            console.warn("Audit logs endpoint not available yet");
            setAuditLog([]);
          } else if (status === 429) {
            toast.error(
              "Too many requests. Please wait a moment before trying again."
            );
          } else if (status >= 500) {
            toast.error(
              "Server error occurred while loading audit logs. Please try again later."
            );
          } else {
            toast.error(errorData?.message || "Failed to load audit logs");
          }

          setAuditLog([]);
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

      // Handle specific error cases
      if (error.message?.includes("Authentication failed")) {
        toast.error("Session expired. Please log in again.");
        navigate("/login");
      } else if (error.message?.includes("Access denied")) {
        toast.error("You do not have permission to access this dashboard.");
      } else if (error.message?.includes("Too many requests")) {
        toast.error("Too many requests. Please wait a moment and try again.");
      } else if (error.message?.includes("Server error")) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(error.message || "Failed to load dashboard data");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLGAs = lgas.filter(
    (lga) =>
      lga.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lga.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    toast("Are you sure you want to logout?", {
      action: {
        label: "Logout",
        onClick: () => {
          tokenManager.clearTokens();
          navigate("/");
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  const handleAuditLogPageChange = (page: number) => {
    setAuditLogPage(page);
    // Re-fetch will happen via useEffect when page changes
  };

  const handleAuditLogFiltersChange = (filters: {
    action_type?: string;
    table_name?: string;
    user?: string;
  }) => {
    setAuditLogFilters(filters);
    setAuditLogPage(1); // Reset to page 1 when filters change
  };

  // Re-fetch audit logs when page or filters change
  useEffect(() => {
    if (activeTab === "audit") {
      loadData();
    }
  }, [auditLogPage, auditLogFilters]);

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
      auditLogPage={auditLogPage}
      auditLogPageSize={auditLogPageSize}
      auditLogTotalCount={auditLogTotalCount}
      auditLogFilters={auditLogFilters}
      onAuditLogPageChange={handleAuditLogPageChange}
      onAuditLogFiltersChange={handleAuditLogFiltersChange}
      handleLogout={handleLogout}
      onNavigate={(page: string) => navigate(`/${page}`)}
    />
  );
}
