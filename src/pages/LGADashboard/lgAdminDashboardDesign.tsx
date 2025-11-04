// src/pages/LGAdminDashboard/lgAdminDashboardDesign.tsx
import React, { useState } from "react";
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
  FileText,
  CheckCircle,
  XCircle,
  DollarSign,
  LogOut,
  Search,
  Filter,
  Download,
  Eye,
  Menu,
  Plus,
  Edit,
  Trash2,
  Upload,
} from "lucide-react";
import { StatsCard } from "../../components/StatsCard";
import { StatusBadge } from "../../components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Checkbox } from "../../components/ui/checkbox";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type {
  Application,
  DigitizationRequest,
  DynamicField,
  ChartDataPoint,
  ApprovalData,
} from "../../Types/types";

// ============================================================================
// PROPS INTERFACES
// ============================================================================

interface LGAdminDashboardDesignProps {
  activeTab: 'dashboard' | 'applications' | 'digitization' | 'reports' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'applications' | 'digitization' | 'reports' | 'settings') => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  applications: Application[];
  filteredApplications: Application[];
  digitizationRequests: DigitizationRequest[];
  dynamicFields: DynamicField[];
  weeklyData: ChartDataPoint[];
  approvalData: ApprovalData[];
  handleLogout: () => void;
  handleAddDynamicField: (field: Omit<DynamicField, 'id'>) => void;
  handleDeleteDynamicField: (fieldId: string, fieldLabel: string) => void;
  onNavigate: (page: string) => void;
}

// ============================================================================
// MAIN DESIGN COMPONENT
// ============================================================================

export function LGAdminDashboardDesign({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sidebarOpen,
  setSidebarOpen,
  applications,
  filteredApplications,
  digitizationRequests,
  dynamicFields,
  weeklyData,
  approvalData,
  handleLogout,
  handleAddDynamicField,
  handleDeleteDynamicField,
  onNavigate,
}: LGAdminDashboardDesignProps) {
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
              <div className="text-xs text-muted-foreground">LG Admin</div>
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
              onClick={() => setActiveTab("applications")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "applications"
                  ? "bg-primary text-white"
                  : "hover:bg-secondary/20"
              }`}
            >
              Applications
            </button>
            <button
              onClick={() => setActiveTab("digitization")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "digitization"
                  ? "bg-primary text-white"
                  : "hover:bg-secondary/20"
              }`}
            >
              Digitization Requests
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "reports"
                  ? "bg-primary text-white"
                  : "hover:bg-secondary/20"
              }`}
            >
              Reports
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                activeTab === "settings"
                  ? "bg-primary text-white"
                  : "hover:bg-secondary/20"
              }`}
            >
              Settings
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
                  <div className="text-foreground">
                    Ikeja Local Government
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Administrator Portal
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
              applications={applications}
              weeklyData={weeklyData}
              approvalData={approvalData}
            />
          )}

          {activeTab === "applications" && (
            <ApplicationsTab
              filteredApplications={filteredApplications}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          )}

          {activeTab === "digitization" && (
            <DigitizationTab requests={digitizationRequests} />
          )}

          {activeTab === "reports" && <ReportsTab />}

          {activeTab === "settings" && (
            <SettingsTab
              dynamicFields={dynamicFields}
              handleAddDynamicField={handleAddDynamicField}
              handleDeleteDynamicField={handleDeleteDynamicField}
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

// Dashboard Tab
interface DashboardTabProps {
  applications: Application[];
  weeklyData: ChartDataPoint[];
  approvalData: ApprovalData[];
}

function DashboardTab({ applications, weeklyData, approvalData }: DashboardTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2>Overview</h2>
        <p className="text-muted-foreground">
          Manage certificate applications for Ikeja LGA
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Pending Applications"
          value="23"
          icon={FileText}
          trend="+5 from yesterday"
          trendUp={true}
        />
        <StatsCard
          title="Approved Certificates"
          value="145"
          icon={CheckCircle}
          trend="+12 this week"
          trendUp={true}
        />
        <StatsCard
          title="Rejected"
          value="12"
          icon={XCircle}
          trend="-2 from last week"
          trendUp={false}
        />
        <StatsCard
          title="Total Revenue"
          value="₦990K"
          icon={DollarSign}
          trend="+8.2% this month"
          trendUp={true}
        />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Weekly Applications</CardTitle>
            <CardDescription>
              Number of applications received this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Bar
                  dataKey="value"
                  fill="#00796B"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Approval Statistics</CardTitle>
            <CardDescription>Overall approval ratio</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={approvalData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) =>
                    `${name}: ${value}`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {approvalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>Latest certificate applications</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.slice(0, 5).map((app) => (
                <TableRow key={app.id}>
                  <TableCell>{app.id}</TableCell>
                  <TableCell>{app.name}</TableCell>
                  <TableCell>
                    <StatusBadge status={app.status} />
                  </TableCell>
                  <TableCell>{app.dateProcessed}</TableCell>
                  <TableCell>{app.dateApplied}</TableCell>
                  <TableCell>
                    <ApplicationDialog application={app} />
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

// Applications Tab
interface ApplicationsTabProps {
  filteredApplications: Application[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
}

function ApplicationsTab({
  filteredApplications,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
}: ApplicationsTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2>Applications Management</h2>
          <p className="text-muted-foreground">
            Review and process certificate applications
          </p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="rounded-xl">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, NIN, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under-review">Under Review</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications Table */}
      <Card className="rounded-xl">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>NIN</TableHead>
                <TableHead>Village</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>{app.id}</TableCell>
                  <TableCell>{app.name}</TableCell>
                  <TableCell>{app.nin}</TableCell>
                  <TableCell>{app.village}</TableCell>
                  <TableCell>
                    <StatusBadge status={app.status} />
                  </TableCell>
                  <TableCell>
                    <span className="text-green-600 text-sm">
                      {app.payment}
                    </span>
                  </TableCell>
                  <TableCell>{app.dateProcessed}</TableCell>
                  <TableCell>{app.dateApplied}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <ApplicationDialog application={app} />
                      {app.status === "pending" ||
                      app.status === "under-review" ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600"
                          >
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                          >
                            <XCircle className="w-3 h-3" />
                          </Button>
                        </>
                      ) : null}
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

// Digitization Tab
interface DigitizationTabProps {
  requests: DigitizationRequest[];
}

function DigitizationTab({ requests }: DigitizationTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2>Digitization Requests</h2>
          <p className="text-muted-foreground">
            Review and approve certificate digitization requests
          </p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats for Digitization */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Pending Digitization
                </p>
                <p className="text-3xl">1</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Approved This Month
                </p>
                <p className="text-3xl">12</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Revenue Generated
                </p>
                <p className="text-3xl">₦27.6K</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Digitization Requests Table */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Digitization Requests</CardTitle>
          <CardDescription>
            Review uploaded certificates and approve digitization
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>NIN</TableHead>
                <TableHead>Certificate Ref</TableHead>
                <TableHead>Upload</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.id}>
                  <TableCell>{req.id}</TableCell>
                  <TableCell>{req.name}</TableCell>
                  <TableCell>{req.nin}</TableCell>
                  <TableCell>
                    {req.certificateRef ? (
                      <span className="text-sm">{req.certificateRef}</span>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        Not provided
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" className="text-primary">
                      <Eye className="w-3 h-3 mr-1" />
                      {req.uploadPreview}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <span className="text-green-600 text-sm">
                      {req.payment}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={req.status} />
                  </TableCell>
                  <TableCell>{req.date}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <DigitizationDialog request={req} />
                      {req.status === "pending" ||
                      req.status === "under-review" ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600"
                          >
                            <CheckCircle className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600"
                          >
                            <XCircle className="w-3 h-3" />
                          </Button>
                        </>
                      ) : null}
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

// Reports Tab
function ReportsTab() {
  return (
    <div className="space-y-6">
      <h2>Reports & Analytics</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Generate Report</CardTitle>
            <CardDescription>Export application data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly Summary</SelectItem>
                <SelectItem value="quarterly">Quarterly Report</SelectItem>
                <SelectItem value="annual">Annual Report</SelectItem>
              </SelectContent>
            </Select>
            <Button className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Settings Tab
interface SettingsTabProps {
  dynamicFields: DynamicField[];
  handleAddDynamicField: (field: Omit<DynamicField, 'id'>) => void;
  handleDeleteDynamicField: (fieldId: string, fieldLabel: string) => void;
}

function SettingsTab({
  dynamicFields,
  handleAddDynamicField,
  handleDeleteDynamicField,
}: SettingsTabProps) {
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [newField, setNewField] = useState({
    field_label: "",
    field_type: "text" as "text" | "number" | "date" | "file" | "dropdown",
    is_required: false,
    dropdown_options: ["Option 1", "Option 2"],
  });

  const handleSubmitNewField = () => {
    if (!newField.field_label.trim()) {
      return;
    }

    handleAddDynamicField(newField);
    setIsAddFieldModalOpen(false);
    setNewField({
      field_label: "",
      field_type: "text",
      is_required: false,
      dropdown_options: ["Option 1", "Option 2"],
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Settings</h2>
        <p className="text-muted-foreground">
          Configure application requirements and system settings
        </p>
      </div>

      {/* Custom Application Fields */}
      <Card className="rounded-xl border shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Custom Application Fields
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Configure additional fields for the application process
              </CardDescription>
            </div>
            <Button
              onClick={() => setIsAddFieldModalOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Field
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {dynamicFields.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field Label</TableHead>
                  <TableHead>Input Type</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dynamicFields.map((field) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                          {field.field_type === "file" && (
                            <Upload className="w-4 h-4 text-teal-600" />
                          )}
                          {field.field_type === "text" && (
                            <FileText className="w-4 h-4 text-teal-600" />
                          )}
                        </div>
                        <p className="font-medium">{field.field_label}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                        {field.field_type}
                      </span>
                    </TableCell>
                    <TableCell>
                      {field.is_required ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                          Required
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                          Optional
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-1 justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            handleDeleteDynamicField(field.id, field.field_label)
                          }
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No custom fields yet
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Create custom fields to collect specific information
              </p>
              <Button onClick={() => setIsAddFieldModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Field
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Field Modal */}
      <Dialog open={isAddFieldModalOpen} onOpenChange={setIsAddFieldModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add New Custom Field</DialogTitle>
            <DialogDescription>
              Create a custom field for applicants to complete
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fieldLabel">Field Label *</Label>
              <Input
                id="fieldLabel"
                placeholder="e.g., Letter from Community Head"
                value={newField.field_label}
                onChange={(e) =>
                  setNewField({ ...newField, field_label: e.target.value })
                }
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fieldType">Input Type *</Label>
              <Select
                value={newField.field_type}
                onValueChange={(value: "text" | "number" | "date" | "file" | "dropdown") =>
                  setNewField({ ...newField, field_type: value })
                }
              >
                <SelectTrigger className="rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text Input</SelectItem>
                  <SelectItem value="number">Number Input</SelectItem>
                  <SelectItem value="date">Date Picker</SelectItem>
                  <SelectItem value="file">File Upload</SelectItem>
                  <SelectItem value="dropdown">Dropdown Menu</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="isRequired"
                checked={newField.is_required}
                onCheckedChange={(checked) =>
                  setNewField({ ...newField, is_required: checked as boolean })
                }
              />
              <Label htmlFor="isRequired" className="cursor-pointer">
                Make this field required
              </Label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsAddFieldModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitNewField}
              className="flex-1 bg-teal-600 hover:bg-teal-700"
              disabled={!newField.field_label.trim()}
            >
              Add Field
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Application Settings */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>
            General configuration for certificate applications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Processing Time (Days)</Label>
            <Input
              type="number"
              defaultValue="7"
              className="rounded-lg w-24"
            />
          </div>

          <div className="space-y-2">
            <Label>Application Fee (₦)</Label>
            <Input
              type="number"
              defaultValue="5000"
              className="rounded-lg w-32"
            />
          </div>

          <Button className="bg-teal-600 hover:bg-teal-700">
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// DIALOG COMPONENTS
// ============================================================================

// Application Dialog
function ApplicationDialog({ application }: { application: Application }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Eye className="w-3 h-3 mr-1" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Application Details</DialogTitle>
          <DialogDescription>{application.id}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p>{application.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">NIN</p>
              <p>{application.nin}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Village</p>
              <p>{application.village}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <StatusBadge status={application.status} />
            </div>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1" variant="outline">
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button className="flex-1">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Digitization Dialog
function DigitizationDialog({ request }: { request: DigitizationRequest }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Eye className="w-3 h-3 mr-1" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Digitization Request Details</DialogTitle>
          <DialogDescription>{request.id}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Full Name</p>
              <p>{request.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">NIN</p>
              <p>{request.nin}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Certificate Reference
              </p>
              <p>{request.certificateRef || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <StatusBadge status={request.status} />
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Uploaded Certificate
            </p>
            <div className="border border-border rounded-lg p-6 bg-secondary/10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-white border border-border flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{request.uploadPreview}</p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded on {request.date}
                  </p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" variant="outline">
              <XCircle className="w-4 h-4 mr-2" />
              Reject Request
            </Button>
            <Button className="flex-1">
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve & Digitize
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}