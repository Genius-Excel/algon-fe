import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Shield,
  Building2,
  DollarSign,
  FileCheck,
  LogOut,
  Search,
  Menu,
  UserPlus,
  Edit,
  Power,
} from "lucide-react";
import { StatsCard } from "../../components/StatsCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import type { LocalGovernment, AuditLog, MonthlyData } from "../../Types/types";

interface SuperAdminDashboardDesignProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  dashboardStats: any;
  monthlyData: MonthlyData[];
  monthlyRevenueData: any[];
  lgas: LocalGovernment[];
  filteredLGAs: LocalGovernment[];
  auditLog: AuditLog[];
  auditLogPage: number;
  auditLogPageSize: number;
  auditLogTotalCount: number;
  auditLogFilters: {
    action_type?: string;
    table_name?: string;
    user?: string;
  };
  onAuditLogPageChange: (page: number) => void;
  onAuditLogFiltersChange: (filters: {
    action_type?: string;
    table_name?: string;
    user?: string;
  }) => void;
  handleLogout: () => void;
  onNavigate: (page: string) => void;
  onReloadLGAs?: () => void;
}

export function SuperAdminDashboardDesign({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  sidebarOpen,
  setSidebarOpen,
  dashboardStats,
  monthlyData,
  monthlyRevenueData,
  lgas,
  filteredLGAs,
  auditLog,
  auditLogPage,
  auditLogPageSize,
  auditLogTotalCount,
  auditLogFilters,
  onAuditLogPageChange,
  onAuditLogFiltersChange,
  handleLogout,
  onNavigate,
  onReloadLGAs,
}: SuperAdminDashboardDesignProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 to-white flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } bg-white border-r border-border transition-all duration-300 overflow-hidden flex-shrink-0`}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-foreground">LGCIVS</div>
              <div className="text-xs text-muted-foreground">Super Admin</div>
            </div>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "dashboard"
                  ? "bg-primary text-white"
                  : "hover:bg-secondary/20"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("lgas")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "lgas"
                  ? "bg-primary text-white"
                  : "hover:bg-secondary/20"
              }`}
            >
              Local Governments
            </button>
            <button
              onClick={() => setActiveTab("audit")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "audit"
                  ? "bg-primary text-white"
                  : "hover:bg-secondary/20"
              }`}
            >
              Audit Log
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="bg-white border-b border-border sticky top-0 z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                  <Menu className="w-5 h-5" />
                </Button>
                <div>
                  <div className="text-foreground">LGCIVS National Portal</div>
                  <div className="text-xs text-muted-foreground">
                    Federal Republic of Nigeria
                  </div>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === "dashboard" && (
            <DashboardTab
              monthlyData={monthlyData}
              monthlyRevenueData={monthlyRevenueData}
              lgas={lgas}
              dashboardStats={dashboardStats}
            />
          )}

          {activeTab === "lgas" && (
            <LGAsTab
              filteredLGAs={filteredLGAs}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onReloadLGAs={onReloadLGAs}
            />
          )}

          {activeTab === "audit" && (
            <AuditLogTab
              auditLog={auditLog}
              currentPage={auditLogPage}
              pageSize={auditLogPageSize}
              totalCount={auditLogTotalCount}
              filters={auditLogFilters}
              onPageChange={onAuditLogPageChange}
              onFiltersChange={onAuditLogFiltersChange}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// TAB COMPONENTS
// ============================================================================

interface DashboardTabProps {
  monthlyData: MonthlyData[];
  monthlyRevenueData: any[];
  lgas: LocalGovernment[];
  dashboardStats: any;
}

function DashboardTab({
  monthlyData,
  monthlyRevenueData,
  lgas,
  dashboardStats,
}: DashboardTabProps) {
  // Extract stats from API response with safe defaults
  const metricCards = dashboardStats?.metric_cards || {};

  const totalApplications = metricCards.total_applications || {
    value: 0,
    trend: "up",
    percent_change: 0,
  };
  const totalRevenue = metricCards.total_revenue || {
    value: 0,
    trend: "up",
    percent_change: 0,
  };
  const activeLGs = metricCards.active_lgs || { value: 0 };
  const certificatesIssued = metricCards.certificates_issued || {
    value: 0,
    trend: "up",
    percent_change: 0,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>National Overview</h2>
        <p className="text-muted-foreground">
          Monitor certificate issuance across Nigeria
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Applications"
          value={totalApplications.value?.toLocaleString() || "0"}
          icon={FileCheck}
          trend={`${totalApplications.percent_change > 0 ? "+" : ""}${
            totalApplications.percent_change?.toFixed(1) || 0
          }% from last month`}
          trendUp={totalApplications.trend === "up"}
        />
        <StatsCard
          title="Total Revenue"
          value={
            totalRevenue.value
              ? `₦${(totalRevenue.value / 1000000).toFixed(1)}M`
              : "₦0"
          }
          icon={DollarSign}
          trend={`${totalRevenue.percent_change > 0 ? "+" : ""}${
            totalRevenue.percent_change?.toFixed(1) || 0
          }% this month`}
          trendUp={totalRevenue.trend === "up"}
        />
        <StatsCard
          title="Active LGAs"
          value={activeLGs.value?.toLocaleString() || "0"}
          icon={Building2}
          trend={`${((activeLGs.value / 774) * 100).toFixed(0)}% coverage`}
          trendUp={true}
        />
        <StatsCard
          title="Certificates Issued"
          value={certificatesIssued.value?.toLocaleString() || "0"}
          icon={Shield}
          trend={`${certificatesIssued.percent_change > 0 ? "+" : ""}${
            certificatesIssued.percent_change?.toFixed(1) || 0
          }% this month`}
          trendUp={certificatesIssued.trend === "up"}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Monthly Applications</CardTitle>
            <CardDescription>
              Application trends over the past 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#00796B"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Revenue Analytics</CardTitle>
            <CardDescription>Monthly revenue in Naira</CardDescription>
          </CardHeader>
          <CardContent>
            {monthlyRevenueData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                <div className="text-center">
                  <DollarSign className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">
                    No revenue data available yet
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Revenue data will appear as payments are processed
                  </p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    formatter={(value: number) =>
                      `₦${(value / 1000000).toFixed(2)}M`
                    }
                  />
                  <Bar dataKey="revenue" fill="#A3D9A5" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface LGAsTabProps {
  filteredLGAs: LocalGovernment[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onReloadLGAs?: () => void;
}

function LGAsTab({
  filteredLGAs,
  searchTerm,
  setSearchTerm,
  onReloadLGAs,
}: LGAsTabProps) {
  const [selectedLGA, setSelectedLGA] = useState<LocalGovernment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEditClick = async (lga: LocalGovernment) => {
    console.log("Edit clicked for LGA:", lga);
    console.log("Assigned admin:", lga.assigned_admin);

    if (!lga.assigned_admin) {
      const { toast } = await import("sonner");
      toast.error(
        "No administrator assigned to this local government. Please invite an admin first."
      );
      return;
    }

    setSelectedLGA(lga);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2>Local Government Management</h2>
          <p className="text-muted-foreground">
            Manage all 774 LGAs across Nigeria
          </p>
        </div>
        <AddLGADialog />
      </div>

      {/* Search */}
      <Card className="rounded-xl">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by LGA name, state, or admin..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerm(e.target.value)
              }
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* LGAs Table */}
      <Card className="rounded-xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center align-middle">
                  LG Name
                </TableHead>
                <TableHead className="text-center align-middle">
                  State
                </TableHead>
                <TableHead className="text-center align-middle">
                  Assigned Admin
                </TableHead>
                <TableHead className="text-center align-middle">
                  Certificates
                </TableHead>
                <TableHead className="text-center align-middle">
                  Digitization
                </TableHead>
                <TableHead className="text-center align-middle">
                  Revenue
                </TableHead>
                <TableHead className="text-center align-middle">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLGAs.map((lga) => (
                <TableRow key={lga.id}>
                  <TableCell className="text-center align-middle">
                    {lga.name}
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    {lga.state?.name || "N/A"}
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    {lga.assigned_admin?.name || "Unassigned"}
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    {lga.certificates?.certificates || 0}
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    {lga.certificates?.digitization || 0}
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    ₦{lga.revenue?.toLocaleString() || 0}
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditClick(lga)}
                        disabled={!lga.assigned_admin}
                        title={
                          !lga.assigned_admin
                            ? "No admin assigned"
                            : "Edit admin details"
                        }
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit LG Admin Dialog */}
      <EditLGADialog
        lga={selectedLGA}
        isOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false);
          setSelectedLGA(null);
        }}
        onReloadLGAs={onReloadLGAs}
      />
    </div>
  );
}

interface EditLGADialogProps {
  lga: LocalGovernment | null;
  isOpen: boolean;
  onClose: () => void;
  onReloadLGAs?: () => void;
}

function EditLGADialog({
  lga,
  isOpen,
  onClose,
  onReloadLGAs,
}: EditLGADialogProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Update form when LGA changes
  useEffect(() => {
    if (lga && lga.assigned_admin) {
      const nameParts = lga.assigned_admin.name.split(" ");
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || "");
      setEmail(lga.assigned_admin.email || "");
    } else {
      setFirstName("");
      setLastName("");
      setEmail("");
    }
  }, [lga]);

  const handleSubmit = async () => {
    console.log("Submit clicked");
    console.log("LGA:", lga);
    console.log("Assigned admin:", lga?.assigned_admin);

    if (!lga || !lga.assigned_admin) {
      console.log("No LGA or assigned admin found");
      const { toast } = await import("sonner");
      toast.error("No administrator assigned to this local government");
      return;
    }

    if (!firstName || !lastName || !email) {
      console.log("Missing fields:", { firstName, lastName, email });
      const { toast } = await import("sonner");
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { adminService } = await import("../../services");
      const { toast } = await import("sonner");

      console.log("Calling updateLGAdmin with:", {
        adminId: lga.assigned_admin.id,
        data: { first_name: firstName, last_name: lastName, email },
      });

      // Call the update service with admin ID
      const result = await adminService.updateLGAdmin(lga.assigned_admin.id, {
        first_name: firstName,
        last_name: lastName,
        email: email,
      });

      console.log("Update result:", result);

      toast.success("LG Admin updated successfully!");

      // Reload LGA data to reflect changes
      if (onReloadLGAs) {
        console.log("Calling onReloadLGAs to refresh data");
        onReloadLGAs();
      } else {
        console.warn("onReloadLGAs callback not provided");
      }

      // Reset and close
      onClose();
    } catch (error: any) {
      const { toast } = await import("sonner");
      console.error("Failed to update LG admin:", error);

      // Handle specific errors from the service
      if (error.message) {
        if (error.message.includes("Authentication failed")) {
          toast.error("Session expired. Please log in again.");
        } else if (error.message.includes("Access denied")) {
          toast.error("You do not have permission to update LG admins.");
        } else if (error.message.includes("not found")) {
          toast.error("LG admin not found.");
        } else if (error.message.includes("Validation error")) {
          toast.error(error.message);
        } else if (error.message.includes("Server error")) {
          toast.error("Server error. Please try again later.");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to update LG admin");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit LG Administrator</DialogTitle>
          <DialogDescription>
            Update administrator details for {lga?.name}, {lga?.state?.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              className="!bg-green-600 hover:!bg-green-700 !text-white"
              onClick={handleSubmit}
              disabled={isLoading || !firstName || !lastName || !email}
            >
              {isLoading ? "Updating..." : "Update Admin"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface AuditLogTabProps {
  auditLog: AuditLog[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  filters: {
    action_type?: string;
    table_name?: string;
    user?: string;
  };
  onPageChange: (page: number) => void;
  onFiltersChange: (filters: {
    action_type?: string;
    table_name?: string;
    user?: string;
  }) => void;
}

function AuditLogTab({
  auditLog,
  currentPage,
  pageSize,
  totalCount,
  filters,
  onPageChange,
  onFiltersChange,
}: AuditLogTabProps) {
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleLogClick = async (log: AuditLog) => {
    setIsDialogOpen(true);
    setIsLoadingDetails(true);
    setSelectedLog(null);

    try {
      const { adminService } = await import("../../services");
      const details = await adminService.getAuditLogById(log.id);
      setSelectedLog(details.data || details);
    } catch (error: any) {
      console.error("Failed to load audit log details:", error);
      const { toast } = await import("sonner");

      const status = error.response?.status;
      const errorData = error.response?.data;

      // Handle specific HTTP status codes per API spec
      if (status === 401 || status === 403) {
        toast.error("Authentication failed. You may need to log in again.");
      } else if (status === 404) {
        toast.error("Audit log entry not found.");
      } else {
        toast.error(errorData?.message || "Failed to load audit log details");
      }
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleClearFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6">
      <div>
        <h2>System Audit Log</h2>
        <p className="text-muted-foreground">
          Track all administrative actions and system activities
        </p>
      </div>

      {/* Filters Card */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>
            Filter audit logs by specific criteria
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="action_type">Action Type</Label>
              <Select
                value={localFilters.action_type || "all"}
                onValueChange={(value) =>
                  setLocalFilters({
                    ...localFilters,
                    action_type: value === "all" ? undefined : value,
                  })
                }
              >
                <SelectTrigger id="action_type">
                  <SelectValue placeholder="All actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="approve">Approve</SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="table_name">Table/Resource</Label>
              <Input
                id="table_name"
                placeholder="e.g., User, Application"
                value={localFilters.table_name || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    table_name: e.target.value || undefined,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user">User ID</Label>
              <Input
                id="user"
                placeholder="Filter by user"
                value={localFilters.user || ""}
                onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    user: e.target.value || undefined,
                  })
                }
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleApplyFilters} size="sm">
              Apply Filters
            </Button>
            <Button onClick={handleClearFilters} variant="outline" size="sm">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card className="rounded-xl">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Audit Log Entries</CardTitle>
              <CardDescription>
                Showing {auditLog.length} of {totalCount} total entries
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditLog.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No audit log entries found
              </p>
            ) : (
              auditLog.map((log) => (
                <div
                  key={log.id}
                  onClick={() => handleLogClick(log)}
                  className="flex gap-4 pb-4 border-b border-border last:border-0 cursor-pointer hover:bg-secondary/50 p-3 rounded-lg transition-colors"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{log.description}</p>
                      <Badge variant="outline" className="text-xs">
                        {log.action_type}
                      </Badge>
                    </div>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span>User: {log.user}</span>
                      {log.table_name && <span>Table: {log.table_name}</span>}
                      <span>{new Date(log.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Log Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>
              Detailed information about this audit log entry
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : selectedLog ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">ID</Label>
                  <p className="text-sm font-mono break-all">
                    {selectedLog.id}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Action Type
                  </Label>
                  <p className="text-sm">
                    <Badge variant="outline">{selectedLog.action_type}</Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Table Name
                  </Label>
                  <p className="text-sm">{selectedLog.table_name || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Record ID
                  </Label>
                  <p className="text-sm font-mono break-all">
                    {selectedLog.record_id || "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    User ID
                  </Label>
                  <p className="text-sm font-mono break-all">
                    {selectedLog.user}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Timestamp
                  </Label>
                  <p className="text-sm">
                    {selectedLog.created_at
                      ? new Date(selectedLog.created_at).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    IP Address
                  </Label>
                  <p className="text-sm">{selectedLog.ip_address || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">
                    User Agent
                  </Label>
                  <p className="text-sm text-xs break-all">
                    {selectedLog.user_agent || "N/A"}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">
                  Description
                </Label>
                <p className="text-sm mt-1">
                  {selectedLog.description || "No description"}
                </p>
              </div>

              {selectedLog.changes && (
                <div>
                  <Label className="text-xs text-muted-foreground">
                    Changes
                  </Label>
                  <pre className="text-xs bg-secondary p-3 rounded-lg mt-1 overflow-x-auto">
                    {typeof selectedLog.changes === "string"
                      ? selectedLog.changes
                      : JSON.stringify(selectedLog.changes, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              No details available
            </p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AddLGADialog() {
  const [states, setStates] = useState<any[]>([]);
  const [availableLGAs, setAvailableLGAs] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedLGA, setSelectedLGA] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState(true);

  useEffect(() => {
    loadStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      const state = states.find((s) => s.id === selectedState);
      setAvailableLGAs(state?.local_governtments || []);
      setSelectedLGA(""); // Reset LGA when state changes
    } else {
      setAvailableLGAs([]);
    }
  }, [selectedState, states]);

  const loadStates = async () => {
    setLoadingStates(true);
    try {
      const { adminService } = await import("../../services");
      const response = await adminService.getAllStatesAndLGs();
      const statesData = Array.isArray(response)
        ? response
        : response?.data?.results || response?.data || [];
      setStates(statesData);
    } catch (error) {
      console.error("Failed to load states:", error);
    } finally {
      setLoadingStates(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedState || !selectedLGA || !firstName || !lastName || !email) {
      const { toast } = await import("sonner");
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const { adminService } = await import("../../services");
      const { toast } = await import("sonner");
      const { tokenManager } = await import("../../utils/tokenManager");

      // Check authentication
      const currentUser = tokenManager.getUserData();
      const currentToken = tokenManager.getAccessToken();

      const response = await adminService.createLGAdmin({
        state: selectedState,
        lga: selectedLGA,
        first_name: firstName,
        last_name: lastName,
        email: email,
      });

      // Show success message with email status from response
      const successMessage = response.email_status
        ? `${response.message} ${response.email_status}`
        : response.message || "LG Admin invited successfully!";

      toast.success(successMessage, { duration: 8000 });

      // Reset form
      setSelectedState("");
      setSelectedLGA("");
      setFirstName("");
      setLastName("");
      setEmail("");
    } catch (error: any) {
      const { toast } = await import("sonner");
      console.error("Failed to create LG admin - Full error:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error response status:", error.response?.status);

      // Handle specific errors from the service
      if (error.message) {
        // Check for authentication errors
        if (error.message.includes("Authentication failed")) {
          toast.error("Session expired. Please log in again.");
          return;
        }
        // Check for permission errors
        if (error.message.includes("Access denied")) {
          toast.error("You do not have permission to invite LG admins.");
          return;
        }
        // Check for duplicate email errors
        if (error.message.includes("already exists")) {
          toast.error(error.message);
          return;
        }
        // Check for validation errors
        if (error.message.includes("Validation error")) {
          toast.error(error.message);
          return;
        }
        // Check for server errors
        if (error.message.includes("Server error")) {
          toast.error("Server error. Please try again later.");
          return;
        }
        // Show the service error message
        toast.error(error.message);
        return;
      }

      // Fallback for unexpected errors
      toast.error("Failed to invite LG admin. Please try again.", {
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="!bg-green-600 hover:!bg-green-700 !text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Add LG Admin
        </Button>
      </DialogTrigger>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>Add New LG Administrator</DialogTitle>
          <DialogDescription>
            Assign an administrator to a Local Government
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>State</Label>
            <Select
              value={selectedState}
              onValueChange={setSelectedState}
              disabled={loadingStates}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loadingStates ? "Loading states..." : "Select state"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(states) && states.length > 0 ? (
                  states.map((state) => (
                    <SelectItem key={state.id} value={state.id}>
                      {state.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-states" disabled>
                    {loadingStates ? "Loading..." : "No states available"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Local Government</Label>
            <Select
              value={selectedLGA}
              onValueChange={setSelectedLGA}
              disabled={!selectedState || loadingStates}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    selectedState ? "Select LGA" : "Select state first"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {Array.isArray(availableLGAs) && availableLGAs.length > 0 ? (
                  availableLGAs.map((lga) => (
                    <SelectItem key={lga.id} value={lga.id}>
                      {lga.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-lgas" disabled>
                    {selectedState
                      ? "No LGAs available"
                      : "Select a state first"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input
                placeholder="John"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <p className="text-xs text-muted-foreground mt-1">
              An invitation email will be sent to this address with login
              credentials.
            </p>
          </div>
          <Button
            className="w-full !bg-green-600 hover:!bg-green-700 !text-white"
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !selectedState ||
              !selectedLGA ||
              !firstName ||
              !lastName ||
              !email
            }
          >
            {isLoading ? "Creating..." : "Create Administrator"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
