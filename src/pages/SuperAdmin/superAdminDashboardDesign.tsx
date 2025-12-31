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
import type {
  LocalGovernment,
  AuditLogEntry,
  MonthlyData,
} from "../../Types/types";

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
  auditLog: AuditLogEntry[];
  handleLogout: () => void;
  onNavigate: (page: string) => void; // Temporary
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
  handleLogout,
  onNavigate,
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
              onClick={() => setActiveTab("system")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "system"
                  ? "bg-primary text-white"
                  : "hover:bg-secondary/20"
              }`}
            >
              System Settings
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
            />
          )}

          {activeTab === "system" && <SystemSettingsTab />}

          {activeTab === "audit" && <AuditLogTab auditLog={auditLog} />}
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
  console.log("🎨 DashboardTab received props:");
  console.log("  - monthlyData:", monthlyData);
  console.log("  - monthlyRevenueData:", monthlyRevenueData);
  console.log("  - dashboardStats:", dashboardStats);
  console.log(
    "  - dashboardStats?.metric_cards:",
    dashboardStats?.metric_cards
  );

  // Extract stats from API response with safe defaults
  const metricCards = dashboardStats?.metric_cards || {};
  console.log("  - metricCards:", metricCards);

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

      {/* Map Placeholder */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Active Local Governments Map</CardTitle>
          <CardDescription>
            Geographic distribution of active LGAs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-br from-secondary/20 to-white rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-border">
            <div className="text-center">
              <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Interactive Nigeria Map</p>
              <p className="text-sm text-muted-foreground mt-2">
                Showing 742 active LGAs across 36 states
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing LGAs */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Top Performing LGAs</CardTitle>
          <CardDescription>
            Highest certificate issuance this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Local Government</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Certificates</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lgas.slice(0, 5).map((lga, idx) => (
                <TableRow key={lga.id}>
                  <TableCell>#{idx + 1}</TableCell>
                  <TableCell>{lga.name}</TableCell>
                  <TableCell>{lga.state}</TableCell>
                  <TableCell>{lga.certificates}</TableCell>
                  <TableCell>{lga.revenue}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

interface LGAsTabProps {
  filteredLGAs: LocalGovernment[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

function LGAsTab({ filteredLGAs, searchTerm, setSearchTerm }: LGAsTabProps) {
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
                <TableHead>LG Name</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Assigned Admin</TableHead>
                <TableHead>Certificates</TableHead>
                <TableHead>Digitization</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLGAs.map((lga) => (
                <TableRow key={lga.id}>
                  <TableCell>{lga.name}</TableCell>
                  <TableCell>{lga.state?.name || "N/A"}</TableCell>
                  <TableCell>
                    {lga.assigned_admin?.name || "Unassigned"}
                  </TableCell>
                  <TableCell>{lga.certificates?.certificates || 0}</TableCell>
                  <TableCell>{lga.certificates?.digitization || 0}</TableCell>
                  <TableCell>₦{lga.revenue?.toLocaleString() || 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
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
    </div>
  );
}

function SystemSettingsTab() {
  return (
    <div className="space-y-6">
      <h2>System Settings</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Payment Configuration</CardTitle>
            <CardDescription>Manage payment gateway settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Application Fee (₦)</Label>
              <Input type="number" defaultValue="5000" />
            </div>
            <div className="space-y-2">
              <Label>Processing Fee (₦)</Label>
              <Input type="number" defaultValue="500" />
            </div>
            <div className="space-y-2">
              <Label>Payment Gateway</Label>
              <Select defaultValue="paystack">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paystack">Paystack</SelectItem>
                  <SelectItem value="flutterwave">Flutterwave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button>Update Settings</Button>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Certificate Template</CardTitle>
            <CardDescription>Configure certificate design</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Certificate Format</Label>
              <Select defaultValue="standard">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Format</SelectItem>
                  <SelectItem value="enhanced">Enhanced Format</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Validity Period (days)</Label>
              <Input type="number" defaultValue="7" />
            </div>
            <Button>Save Template</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface AuditLogTabProps {
  auditLog: AuditLogEntry[];
}

function AuditLogTab({ auditLog }: AuditLogTabProps) {
  const [selectedLog, setSelectedLog] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const handleLogClick = async (log: AuditLogEntry) => {
    setIsDialogOpen(true);
    setIsLoadingDetails(true);
    setSelectedLog(null);

    try {
      const { adminService } = await import("../../services");
      const details = await adminService.getAuditLogById(log.id);
      console.log("Audit log details:", details);
      setSelectedLog(details.data || details);
    } catch (error) {
      console.error("Failed to load audit log details:", error);
      const { toast } = await import("sonner");
      toast.error("Failed to load audit log details");
    } finally {
      setIsLoadingDetails(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2>System Audit Log</h2>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>Track all major system activities</CardDescription>
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
                    <p className="text-sm font-medium">{log.action}</p>
                    <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                      <span>{log.user}</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
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
  const [password, setPassword] = useState("TempPassword@123"); // Default temporary password
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

      console.log("Current user data:", currentUser);
      console.log("Current token exists:", !!currentToken);
      console.log("User role:", currentUser?.role);

      console.log("Submitting LG Admin invite:", {
        state: selectedState,
        lga: selectedLGA,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      });

      const response = await adminService.createLGAdmin({
        state: selectedState,
        lga: selectedLGA,
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      });

      console.log("LG Admin invite response:", response);
      toast.success(
        `LG Admin invited successfully! Temporary password: ${password}`,
        { duration: 8000 }
      );

      // Reset form
      setSelectedState("");
      setSelectedLGA("");
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("TempPassword@123"); // Reset to default
    } catch (error: any) {
      const { toast } = await import("sonner");
      console.error("Failed to create LG admin - Full error:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error response status:", error.response?.status);
      console.error("Error code:", error.code);

      // Handle timeout errors
      if (error.code === "ECONNABORTED") {
        toast.error(
          "Request timed out. The server is taking too long to respond. Please try again or contact support.",
          { duration: 5000 }
        );
        return;
      }

      // Handle specific backend errors
      if (error.response?.data) {
        const errorData = error.response.data;

        // Handle field-specific errors (like validation errors)
        if (
          typeof errorData === "object" &&
          !errorData.message &&
          !errorData.detail
        ) {
          const fieldErrors = Object.entries(errorData)
            .map(([field, errors]) => {
              const errorList = Array.isArray(errors) ? errors : [errors];
              return `${field}: ${errorList.join(", ")}`;
            })
            .join("; ");
          toast.error(`Validation errors: ${fieldErrors}`, { duration: 5000 });
          return;
        }
      }

      // Show detailed error message
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        (error.response?.status === 403
          ? "Access forbidden. Please ensure you are logged in as a super admin and your session hasn't expired."
          : "Failed to invite LG admin. Please check the network tab for details.");

      toast.error(errorMessage, { duration: 5000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          Add LG Admin
        </Button>
      </DialogTrigger>
      <DialogContent>
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
              />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input
                placeholder="Doe"
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
          <div className="space-y-2">
            <Label>Temporary Password</Label>
            <Input
              type="text"
              placeholder="TempPassword@123"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This temporary password will be sent to the LG admin. They should
              change it after first login.
            </p>
          </div>
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !selectedState ||
              !selectedLGA ||
              !firstName ||
              !lastName ||
              !email ||
              !password
            }
          >
            {isLoading ? "Creating..." : "Create Administrator"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
