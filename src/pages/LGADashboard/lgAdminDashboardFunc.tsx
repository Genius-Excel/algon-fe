import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LGAdminDashboardDesign } from "./lgAdminDashboardDesign";
import { toast } from "sonner";
import type {
  Application,
  DigitizationRequest,
  DynamicField,
} from "../../Types/types";
import {
  applicationService,
  digitizationService,
  adminService,
} from "../../services"; // ✅ Import services
import { useAuth } from "../../hooks/useAuth";
import { downloadCSV } from "../../utils/downloadHelpers";

export function LGAdminDashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "applications" | "digitization" | "reports" | "settings"
  >("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalItems, setTotalItems] = useState(0);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrevious, setHasPrevious] = useState(false);

  // ✅ State for API data
  const [applications, setApplications] = useState<Application[]>([]);
  const [digitizationRequests, setDigitizationRequests] = useState<
    DigitizationRequest[]
  >([]);
  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [approvalData, setApprovalData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Fetch data on mount and when pagination changes
  useEffect(() => {
    loadDashboardData();
  }, [activeTab, currentPage, pageSize]);

  const loadDashboardData = async () => {
    setIsLoading(true);

    try {
      // ✅ Load different data based on active tab
      if (activeTab === "dashboard") {
        const [appsData, dashboardData] = await Promise.all([
          applicationService.getAllApplications({
            limit: pageSize,
            page: currentPage,
          }),
          adminService.getLGAdminDashboard(),
        ]);

        setApplications(appsData.results || []);
        setTotalItems(appsData.count || 0);
        setHasNext(!!appsData.next);
        setHasPrevious(!!appsData.previous);

        // Extract chart data from dashboard response
        setWeeklyData(dashboardData.charts?.weeklyApplications || []);
        setApprovalData(dashboardData.charts?.approvalStats || []);
      } else if (activeTab === "applications") {
        const data = await applicationService.getAllApplications({
          limit: pageSize,
          page: currentPage,
          status: statusFilter !== "all" ? statusFilter : undefined,
        });
        setApplications(data.results || []);
        setTotalItems(data.count || 0);
        setHasNext(!!data.next);
        setHasPrevious(!!data.previous);
      } else if (activeTab === "digitization") {
        const data = await digitizationService.getAllDigitizationRequests({
          limit: pageSize,
          page: currentPage,
        });
        setDigitizationRequests(data.results || []);
        setTotalItems(data.count || 0);
        setHasNext(!!data.next);
        setHasPrevious(!!data.previous);
      } else if (activeTab === "settings") {
        const fields = await adminService.getDynamicFields();
        setDynamicFields(fields || []);
      }
    } catch (error: any) {
      console.error("Failed to load dashboard data:", error);
      toast.error(error.response?.data?.message || "Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.nin.includes(searchTerm) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesDate =
      !dateFilter ||
      (app.dateApplied && app.dateApplied.startsWith(dateFilter));
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleLogout = async () => {
    toast("Are you sure you want to logout?", {
      action: {
        label: "Logout",
        onClick: async () => {
          try {
            await logout();
            navigate("/");
          } catch (error) {
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

  // ✅ Real handler for adding dynamic field
  const handleAddDynamicField = async (field: Omit<DynamicField, "id">) => {
    try {
      const newField = await adminService.createDynamicField(field);
      setDynamicFields([...dynamicFields, newField]);
      toast.success("Field added successfully");
    } catch (error: any) {
      console.error("Failed to add field:", error);
      toast.error(error.response?.data?.message || "Failed to add field");
    }
  };

  // ✅ Real handler for deleting dynamic field
  const handleDeleteDynamicField = async (
    fieldId: string,
    fieldLabel: string
  ) => {
    toast(`Are you sure you want to delete "${fieldLabel}"?`, {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await adminService.deleteDynamicField(fieldId);
            setDynamicFields(
              dynamicFields.filter((field) => field.id !== fieldId)
            );
            toast.success(`Field "${fieldLabel}" deleted successfully`);
          } catch (error: any) {
            console.error("Failed to delete field:", error);
            toast.error(
              error.response?.data?.message || "Failed to delete field"
            );
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  // ✅ Export applications as CSV
  const handleExportApplications = async () => {
    try {
      await toast.promise(
        adminService.exportCSV("applications").then((blob) => {
          downloadCSV(blob, "certificate-applications");
        }),
        {
          loading: "Exporting applications...",
          success: "Applications exported successfully",
          error: "Failed to export applications",
        }
      );
    } catch (error: any) {
      console.error("Export failed:", error);
    }
  };

  // ✅ Export digitization requests as CSV
  const handleExportDigitization = async () => {
    try {
      await toast.promise(
        adminService.exportCSV("digitization").then((blob) => {
          downloadCSV(blob, "digitization-requests");
        }),
        {
          loading: "Exporting digitization requests...",
          success: "Digitization requests exported successfully",
          error: "Failed to export digitization requests",
        }
      );
    } catch (error: any) {
      console.error("Export failed:", error);
    }
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / pageSize);

  // ✅ Show loading state
  if (isLoading && applications.length === 0) {
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
    <LGAdminDashboardDesign
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
      dateFilter={dateFilter}
      setDateFilter={setDateFilter}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      applications={applications}
      filteredApplications={filteredApplications}
      digitizationRequests={digitizationRequests}
      dynamicFields={dynamicFields}
      weeklyData={weeklyData}
      approvalData={approvalData}
      handleLogout={handleLogout}
      handleAddDynamicField={handleAddDynamicField}
      handleDeleteDynamicField={handleDeleteDynamicField}
      handleExportApplications={handleExportApplications}
      handleExportDigitization={handleExportDigitization}
      currentPage={currentPage}
      pageSize={pageSize}
      totalItems={totalItems}
      totalPages={totalPages}
      hasNext={hasNext}
      hasPrevious={hasPrevious}
      onPageChange={handlePageChange}
      onPageSizeChange={handlePageSizeChange}
      onNavigate={(page: string) => navigate(`/${page}`)}
    />
  );
}
