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
                <TableHead>Status</TableHead>
                <TableHead>Certificates</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLGAs.map((lga) => (
                <TableRow key={lga.id}>
                  <TableCell>{lga.name}</TableCell>
                  <TableCell>{lga.state}</TableCell>
                  <TableCell>{lga.admin}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        lga.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {lga.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{lga.certificates}</TableCell>
                  <TableCell>{lga.revenue}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className={
                          lga.status === "active"
                            ? "text-red-600"
                            : "text-green-600"
                        }
                      >
                        <Power className="w-3 h-3" />
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
            {auditLog.map((log) => (
              <div
                key={log.id}
                className="flex gap-4 pb-4 border-b border-border last:border-0"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm">{log.action}</p>
                  <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
                    <span>{log.user}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AddLGADialog() {
  const [states, setStates] = useState<any[]>([]);
  const [availableLGAs, setAvailableLGAs] = useState<any[]>([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedLGA, setSelectedLGA] = useState("");
  const [fullName, setFullName] = useState("");
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
    if (!selectedState || !selectedLGA || !fullName || !email) {
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
        full_name: fullName,
        email: email,
      });

      const response = await adminService.createLGAdmin({
        state: selectedState,
        lga: selectedLGA,
        full_name: fullName,
        email: email,
      });

      console.log("LG Admin invite response:", response);
      toast.success("LG Admin invited successfully!");

      // Reset form
      setSelectedState("");
      setSelectedLGA("");
      setFullName("");
      setEmail("");
    } catch (error: any) {
      const { toast } = await import("sonner");
      console.error("Failed to create LG admin - Full error:", error);
      console.error("Error response data:", error.response?.data);
      console.error("Error response status:", error.response?.status);
      console.error("Error response headers:", error.response?.headers);
      console.error("Error config:", error.config);

      // Show detailed error message
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.message ||
        error.response?.data?.error ||
        (error.response?.status === 403
          ? "Access forbidden. Please ensure you are logged in as a super admin and your session hasn't expired."
          : "Failed to invite LG admin");

      toast.error(errorMessage);
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
          <div className="space-y-2">
            <Label>Admin Name</Label>
            <Input
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
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
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={
              isLoading || !selectedState || !selectedLGA || !fullName || !email
            }
          >
            {isLoading ? "Creating..." : "Create Administrator"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
