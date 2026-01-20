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
  const [digitizationOverview, setDigitizationOverview] = useState<any>(null);
  const [reportAnalytics, setReportAnalytics] = useState<any>(null);
  const [lgaFees, setLgaFees] = useState<any>(null);
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
          adminService.getAllApplications({
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
        const data = await adminService.getAllApplications({
          limit: pageSize,
          page: currentPage,
          status: statusFilter !== "all" ? statusFilter : undefined,
        });
        setApplications(data.results || []);
        setTotalItems(data.count || 0);
        setHasNext(!!data.next);
        setHasPrevious(!!data.previous);
      } else if (activeTab === "digitization") {
        const [digitizationData, overviewData] = await Promise.all([
          adminService.getAllApplications({
            application_type: "digitization",
            limit: pageSize,
            page: currentPage,
          }),
          adminService.getDigitizationOverview(),
        ]);

        setDigitizationOverview(overviewData.data || null);
        setDigitizationRequests(digitizationData.results || []);
        setTotalItems(digitizationData.count || 0);
        setHasNext(!!digitizationData.next);
        setHasPrevious(!!digitizationData.previous);
      } else if (activeTab === "reports") {
        const analytics = await adminService.getReportAnalytics();
        setReportAnalytics(analytics?.data || analytics);
      } else if (activeTab === "settings") {
        const [fields, fees] = await Promise.all([
          adminService.getDynamicFields(),
          adminService.getLGAFee(),
        ]);
        setDynamicFields(fields || []);
        setLgaFees(fees?.data?.[0] || null);
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

  // ✅ Real handler for updating dynamic field
  const handleUpdateDynamicField = async (
    fieldId: string,
    fieldData: {
      field_label: string;
      field_name: string;
      is_required: boolean;
      field_type: string;
    },
  ) => {
    try {
      const updatedField = await adminService.updateDynamicField(
        fieldId,
        fieldData,
      );
      setDynamicFields(
        dynamicFields.map((field) =>
          field.id === fieldId ? updatedField : field,
        ),
      );
      toast.success("Field updated successfully");
    } catch (error: any) {
      console.error("Failed to update field:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update field",
      );
    }
  };

  // ✅ Real handler for deleting dynamic field
  const handleDeleteDynamicField = async (
    fieldId: string,
    fieldLabel: string,
  ) => {
    toast(`Are you sure you want to delete "${fieldLabel}"?`, {
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            await adminService.deleteDynamicField(fieldId);
            setDynamicFields(
              dynamicFields.filter((field) => field.id !== fieldId),
            );
            toast.success(`Field "${fieldLabel}" deleted successfully`);
          } catch (error: any) {
            console.error("Failed to delete field:", error);
            toast.error(
              error.response?.data?.message || "Failed to delete field",
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

  // ✅ Handler for creating/updating LGA fees
  const handleSaveFees = async (feeData: {
    application_fee: number;
    digitization_fee: number;
    regeneration_fee: number;
  }) => {
    const loadingToast = toast.loading(
      lgaFees ? "Updating fees..." : "Creating fees...",
    );
    try {
      let result;
      if (lgaFees) {
        result = await adminService.updateLGAFee(feeData);
        toast.success("Fees updated successfully", { id: loadingToast });
      } else {
        result = await adminService.createLGAFee(feeData);
        toast.success("Fees created successfully", { id: loadingToast });
      }
      // Extract fee data from response and update state
      const feeDataFromResponse = result?.data?.[0] || result?.data || null;
      setLgaFees(feeDataFromResponse);
    } catch (error: any) {
      console.error("Failed to save fees:", error);
      toast.error(error.message || "Failed to save fees", { id: loadingToast });
    }
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
        },
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
        },
      );
    } catch (error: any) {
      console.error("Export failed:", error);
    }
  };

  // ✅ Download report analytics
  const handleDownloadReport = async (reportType: string) => {
    const loadingToast = toast.loading("Generating report...");
    try {
      const analyticsResponse = await adminService.getReportAnalytics();

      // Extract data from response
      const analyticsData = analyticsResponse?.data || analyticsResponse;

      // Convert analytics data to CSV format
      const csvContent = generateReportCSV(analyticsData, reportType);
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

      // Use downloadFile helper
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `analytics-report-${reportType}-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Report downloaded successfully", { id: loadingToast });
    } catch (error: any) {
      console.error("Report download failed:", error);
      toast.error(error.message || "Failed to download report", {
        id: loadingToast,
      });
    }
  };

  // Helper function to generate CSV from analytics data
  const generateReportCSV = (data: any, reportType: string): string => {
    let csv = "";

    // Add header
    csv += `Analytics Report - ${reportType}\n`;
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;

    // Metric Cards Section
    csv += "KEY METRICS\n";
    csv += "Metric,Value\n";
    csv += `Total Revenue,₦${
      data.metric_cards?.total_revenue?.toLocaleString() || 0
    }\n`;
    csv += `Total Requests,${data.metric_cards?.total_requests || 0}\n`;
    csv += `Approval Rate,${(
      (data.metric_cards?.approval_rate || 0) * 100
    ).toFixed(1)}%\n`;
    csv += `Average Processing Days,${
      data.metric_cards?.average_processing_days || 0
    }\n\n`;

    // Status Distribution Section
    csv += "STATUS DISTRIBUTION\n";
    csv += "Status,Count\n";
    csv += `Approved,${data.status_distribution?.approved || 0}\n`;
    csv += `Pending,${data.status_distribution?.pending || 0}\n`;
    csv += `Rejected,${data.status_distribution?.rejected || 0}\n\n`;

    // Monthly Breakdown - Certificates
    csv += "MONTHLY BREAKDOWN - CERTIFICATES\n";
    csv += "Month,Total\n";
    data.monthly_breakdown?.certificate?.forEach((item: any) => {
      const month = new Date(item.month).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      csv += `${month},${item.total}\n`;
    });
    csv += "\n";

    // Monthly Breakdown - Digitizations
    csv += "MONTHLY BREAKDOWN - DIGITIZATIONS\n";
    csv += "Month,Total\n";
    data.monthly_breakdown?.digitizations?.forEach((item: any) => {
      const month = new Date(item.month).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      });
      csv += `${month},${item.total}\n`;
    });

    return csv;
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
      digitizationOverview={digitizationOverview}
      reportAnalytics={reportAnalytics}
      dynamicFields={dynamicFields}
      lgaFees={lgaFees}
      weeklyData={weeklyData}
      approvalData={approvalData}
      handleLogout={handleLogout}
      handleAddDynamicField={handleAddDynamicField}
      handleUpdateDynamicField={handleUpdateDynamicField}
      handleDeleteDynamicField={handleDeleteDynamicField}
      handleSaveFees={handleSaveFees}
      handleExportApplications={handleExportApplications}
      handleExportDigitization={handleExportDigitization}
      handleDownloadReport={handleDownloadReport}
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
