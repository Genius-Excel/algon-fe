import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Shield, FileText, CheckCircle, XCircle, DollarSign, LogOut, Search, Filter, Download, Eye, Menu, Plus, Edit, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { StatsCard } from "../components/StatsCard";
import { StatusBadge } from "../components/StatusBadge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

interface LGAdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function LGAdminDashboard({ onNavigate }: LGAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock data
  const applications = [
    {
      id: "APP-2025-001",
      name: "John Oluwaseun Doe",
      nin: "12345678901",
      status: "pending" as const,
      payment: "Paid",
      date: "2025-10-18",
      village: "Agege"
    },
    {
      id: "APP-2025-002",
      name: "Amina Bello Mohammed",
      nin: "98765432109",
      status: "under-review" as const,
      payment: "Paid",
      date: "2025-10-17",
      village: "Ikeja"
    },
    {
      id: "APP-2025-003",
      name: "Chukwu Emeka Okafor",
      nin: "55566677788",
      status: "approved" as const,
      payment: "Paid",
      date: "2025-10-15",
      village: "Oshodi"
    },
    {
      id: "APP-2025-004",
      name: "Fatima Ibrahim Hassan",
      nin: "11122233344",
      status: "rejected" as const,
      payment: "Paid",
      date: "2025-10-14",
      village: "Mushin"
    }
  ];

  // Mock digitization requests
  const digitizationRequests = [
    {
      id: "DIGI-2025-001",
      name: "Taiwo Adebayo Ogunleye",
      nin: "33344455566",
      status: "pending" as const,
      payment: "Paid",
      date: "2025-10-20",
      certificateRef: "CERT-IKJ-2018-123",
      uploadPreview: "certificate_scan.pdf"
    },
    {
      id: "DIGI-2025-002",
      name: "Grace Onyinye Nwankwo",
      nin: "77788899900",
      status: "under-review" as const,
      payment: "Paid",
      date: "2025-10-19",
      certificateRef: "",
      uploadPreview: "old_cert.jpg"
    },
    {
      id: "DIGI-2025-003",
      name: "Ibrahim Musa Yusuf",
      nin: "44455566677",
      status: "approved" as const,
      payment: "Paid",
      date: "2025-10-16",
      certificateRef: "CERT-IKJ-2015-078",
      uploadPreview: "certificate.pdf"
    }
  ];

  const weeklyData = [
    { day: 'Mon', applications: 12 },
    { day: 'Tue', applications: 19 },
    { day: 'Wed', applications: 15 },
    { day: 'Thu', applications: 22 },
    { day: 'Fri', applications: 18 },
    { day: 'Sat', applications: 8 },
    { day: 'Sun', applications: 5 }
  ];

  const approvalData = [
    { name: 'Approved', value: 145, color: '#10b981' },
    { name: 'Pending', value: 23, color: '#f59e0b' },
    { name: 'Rejected', value: 12, color: '#ef4444' }
  ];

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         app.nin.includes(searchTerm) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/10 to-white flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-border transition-all duration-300 overflow-hidden flex-shrink-0`}>
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
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-primary text-white' : 'hover:bg-secondary/20'}`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'applications' ? 'bg-primary text-white' : 'hover:bg-secondary/20'}`}
            >
              Applications
            </button>
            <button
              onClick={() => setActiveTab('digitization')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'digitization' ? 'bg-primary text-white' : 'hover:bg-secondary/20'}`}
            >
              Digitization Requests
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'reports' ? 'bg-primary text-white' : 'hover:bg-secondary/20'}`}
            >
              Reports
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-primary text-white' : 'hover:bg-secondary/20'}`}
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
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
                  <Menu className="w-5 h-5" />
                </Button>
                <div>
                  <div className="text-foreground">Ikeja Local Government</div>
                  <div className="text-xs text-muted-foreground">Administrator Portal</div>
                </div>
              </div>
              <Button variant="outline" onClick={() => onNavigate('landing')}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2>Overview</h2>
                <p className="text-muted-foreground">Manage certificate applications for Ikeja LGA</p>
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
                    <CardDescription>Number of applications received this week</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={weeklyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="day" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip />
                        <Bar dataKey="applications" fill="#00796B" radius={[8, 8, 0, 0]} />
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
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
                          <TableCell><StatusBadge status={app.status} /></TableCell>
                          <TableCell>{app.date}</TableCell>
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
          )}

          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h2>Applications Management</h2>
                  <p className="text-muted-foreground">Review and process certificate applications</p>
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
                          <TableCell><StatusBadge status={app.status} /></TableCell>
                          <TableCell>
                            <span className="text-green-600 text-sm">{app.payment}</span>
                          </TableCell>
                          <TableCell>{app.date}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <ApplicationDialog application={app} />
                              {app.status === 'pending' || app.status === 'under-review' ? (
                                <>
                                  <Button size="sm" variant="outline" className="text-green-600">
                                    <CheckCircle className="w-3 h-3" />
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-red-600">
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
          )}

          {activeTab === 'digitization' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h2>Digitization Requests</h2>
                  <p className="text-muted-foreground">Review and approve certificate digitization requests</p>
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
                        <p className="text-sm text-muted-foreground mb-2">Pending Digitization</p>
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
                        <p className="text-sm text-muted-foreground mb-2">Approved This Month</p>
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
                        <p className="text-sm text-muted-foreground mb-2">Revenue Generated</p>
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
                  <CardDescription>Review uploaded certificates and approve digitization</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Request ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>NIN</TableHead>
                        <TableHead>Certificate Ref</TableHead>
                        <TableHead>Upload Preview</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {digitizationRequests.map((req) => (
                        <TableRow key={req.id}>
                          <TableCell>{req.id}</TableCell>
                          <TableCell>{req.name}</TableCell>
                          <TableCell>{req.nin}</TableCell>
                          <TableCell>
                            {req.certificateRef ? (
                              <span className="text-sm">{req.certificateRef}</span>
                            ) : (
                              <span className="text-sm text-muted-foreground">Not provided</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="ghost" className="text-primary">
                              <Eye className="w-3 h-3 mr-1" />
                              {req.uploadPreview}
                            </Button>
                          </TableCell>
                          <TableCell>
                            <span className="text-green-600 text-sm">{req.payment}</span>
                          </TableCell>
                          <TableCell><StatusBadge status={req.status} /></TableCell>
                          <TableCell>{req.date}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <DigitizationDialog request={req} />
                              {req.status === 'pending' || req.status === 'under-review' ? (
                                <>
                                  <Button size="sm" variant="outline" className="text-green-600">
                                    <CheckCircle className="w-3 h-3" />
                                  </Button>
                                  <Button size="sm" variant="outline" className="text-red-600">
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
          )}

          {activeTab === 'reports' && (
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
          )}

          {activeTab === 'settings' && (
            <SettingsTab />
          )}
        </div>
      </div>
    </div>
  );
}

function ApplicationDialog({ application }: { application: any }) {
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
          <div>
            <p className="text-sm text-muted-foreground mb-2">Uploaded Documents</p>
            <div className="border border-border rounded-lg p-4">
              <p className="text-sm">Letter from Traditional Ruler.pdf</p>
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

function DigitizationDialog({ request }: { request: any }) {
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
              <p className="text-sm text-muted-foreground">Certificate Reference</p>
              <p>{request.certificateRef || "Not provided"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <StatusBadge status={request.status} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <span className="text-green-600 text-sm">{request.payment}</span>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Request Date</p>
              <p>{request.date}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Uploaded Certificate</p>
            <div className="border border-border rounded-lg p-6 bg-secondary/10">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-white border border-border flex items-center justify-center">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">{request.uploadPreview}</p>
                  <p className="text-xs text-muted-foreground">Uploaded on {request.date}</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <span>💡 Action Required:</span> Review the uploaded certificate to ensure it is legitimate and matches the applicant's details. 
              Once approved, a digital certificate with QR code will be automatically generated and marked as "Digitized".
            </p>
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

// Settings Tab Component with Dynamic Field Management
function SettingsTab() {
  const [dynamicFields, setDynamicFields] = useState([
    { id: "1", field_label: "Letter from Traditional Ruler", field_type: "file", is_required: true },
    { id: "2", field_label: "Proof of Residence", field_type: "file", is_required: true },
    { id: "3", field_label: "Community Leader Endorsement", field_type: "text", is_required: false }
  ]);
  
  const [isAddFieldModalOpen, setIsAddFieldModalOpen] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [newField, setNewField] = useState({
    field_label: "",
    field_type: "text",
    is_required: false,
    dropdown_options: ["Option 1", "Option 2"] // For dropdown fields
  });

  // Mock API functions - replace with actual endpoints
  const fetchDynamicFields = async () => {
    setIsLoading(true);
    try {
      // const response = await fetch('/api/lg/requirements/');
      // const data = await response.json();
      // setDynamicFields(data);
      // Mock delay
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error fetching fields:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveDynamicField = async (fieldData: any) => {
    setIsLoading(true);
    try {
      // const response = await fetch('/api/lg/requirements/', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(fieldData)
      // });
      
      // Mock success
      const newId = (dynamicFields.length + 1).toString();
      const newFieldWithId = { ...fieldData, id: newId };
      setDynamicFields([...dynamicFields, newFieldWithId]);
      
      toast.success("Field added successfully");
      setIsAddFieldModalOpen(false);
      setNewField({ field_label: "", field_type: "text", is_required: false });
    } catch (error) {
      console.error('Error saving field:', error);
      toast.error("Failed to add field");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDynamicField = async (fieldId: string, fieldLabel: string) => {
    // Show confirmation dialog
    if (!window.confirm(`Are you sure you want to delete the field "${fieldLabel}"? This action cannot be undone and may affect existing applications.`)) {
      return;
    }

    setIsLoading(true);
    try {
      // await fetch(`/api/lg/requirements/${fieldId}`, { method: 'DELETE' });
      
      setDynamicFields(dynamicFields.filter((field: any) => field.id !== fieldId));
      toast.success(`Field "${fieldLabel}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting field:', error);
      toast.error("Failed to delete field");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitNewField = () => {
    // Validation
    if (!newField.field_label.trim()) {
      toast.error("Field label is required");
      return;
    }
    
    if (newField.field_label.trim().length < 3) {
      toast.error("Field label must be at least 3 characters long");
      return;
    }

    // Check for duplicate field labels
    const isDuplicate = dynamicFields.some((field: any) => 
      field.field_label.toLowerCase() === newField.field_label.trim().toLowerCase() && 
      field.id !== editingField?.id
    );
    
    if (isDuplicate) {
      toast.error("A field with this label already exists");
      return;
    }

    // Validate dropdown options
    if (newField.field_type === 'dropdown') {
      const validOptions = newField.dropdown_options.filter((option: string) => option.trim() !== '');
      if (validOptions.length < 2) {
        toast.error("Dropdown fields must have at least 2 options");
        return;
      }
      
      // Check for duplicate options
      const uniqueOptions = new Set(validOptions.map((opt: string) => opt.trim().toLowerCase()));
      if (uniqueOptions.size !== validOptions.length) {
        toast.error("Dropdown options must be unique");
        return;
      }
    }
    
    const fieldToSave = {
      ...newField,
      field_label: newField.field_label.trim(),
      // Only include dropdown_options for dropdown fields
      ...(newField.field_type === 'dropdown' && {
        dropdown_options: newField.dropdown_options.filter((opt: string) => opt.trim() !== '')
      })
    };
    
    saveDynamicField(fieldToSave);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Settings</h2>
        <p className="text-muted-foreground">Configure application requirements and system settings</p>
      </div>

      {/* Applicant Requirement Fields Section */}
      <Card className="rounded-xl border shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Custom Application Fields
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Configure additional fields that applicants must complete during the application process
              </CardDescription>
            </div>
            <Button 
              onClick={() => {
                console.log("Add New Field button clicked"); // Debug log
                setIsAddFieldModalOpen(true);
              }} 
              className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg transition-all duration-200 hover:shadow-xl border-0 font-medium px-6 py-2 text-sm"
              size="default"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Field
            </Button>
          </div>
          
          {/* Additional prominent button for extra visibility */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center">
              <Button 
                onClick={() => {
                  console.log("Create Custom Field button clicked"); // Debug log
                  setIsAddFieldModalOpen(true);
                }} 
                className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl border-0 font-semibold px-8 py-3"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Custom Field
              </Button>
            </div>
            <p className="text-center text-xs text-gray-500 mt-2">
              Click to add a new custom field for applicants to complete
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
                <p className="text-sm text-gray-500">Loading fields...</p>
              </div>
            </div>
          ) : dynamicFields.length > 0 ? (
            <div className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-100">
                    <TableHead className="font-medium text-gray-700 py-4">Field Label</TableHead>
                    <TableHead className="font-medium text-gray-700">Input Type</TableHead>
                    <TableHead className="font-medium text-gray-700">Required</TableHead>
                    <TableHead className="font-medium text-gray-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dynamicFields.map((field, index) => (
                    <TableRow 
                      key={field.id} 
                      className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${
                        index === dynamicFields.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                            {field.field_type === 'file' && <Upload className="w-4 h-4 text-teal-600" />}
                            {field.field_type === 'text' && <FileText className="w-4 h-4 text-teal-600" />}
                            {field.field_type === 'number' && <span className="text-xs font-bold text-teal-600">#</span>}
                            {field.field_type === 'date' && <span className="text-xs font-bold text-teal-600">📅</span>}
                            {field.field_type === 'dropdown' && <span className="text-xs font-bold text-teal-600">▼</span>}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{field.field_label}</p>
                            <p className="text-xs text-gray-500 capitalize">
                              {field.field_type === 'dropdown' ? 'Select options' : field.field_type + ' input'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                          {field.field_type}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        {field.is_required ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></span>
                            Required
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1.5"></span>
                            Optional
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="py-4 text-right">
                        <div className="flex gap-1 justify-end">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setEditingField(field);
                              setNewField({
                                ...field,
                                dropdown_options: field.dropdown_options || ["Option 1", "Option 2"]
                              });
                              setIsAddFieldModalOpen(true);
                            }}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-teal-600 hover:bg-teal-50"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteDynamicField(field.id, field.field_label)}
                            className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No custom fields yet</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
                Create custom fields to collect specific information from applicants based on your local government requirements.
              </p>
              <Button 
                onClick={() => {
                  console.log("Add Your First Field button clicked"); // Debug log
                  setIsAddFieldModalOpen(true);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg hover:shadow-xl font-medium"
                size="default"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Field
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Field Modal */}
      <Dialog open={isAddFieldModalOpen} onOpenChange={setIsAddFieldModalOpen}>
        <DialogContent className="sm:max-w-lg max-w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center">
                {editingField ? (
                  <Edit className="w-5 h-5 text-teal-600" />
                ) : (
                  <Plus className="w-5 h-5 text-teal-600" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  {editingField ? "Edit Custom Field" : "Add New Custom Field"}
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 mt-1">
                  {editingField 
                    ? "Modify the field configuration below" 
                    : "Create a custom field that applicants will need to complete"
                  }
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Field Label */}
            <div className="space-y-2">
              <Label htmlFor="fieldLabel" className="text-sm font-medium text-gray-700">
                Field Label *
              </Label>
              <Input
                id="fieldLabel"
                placeholder="e.g., Letter from Community Head"
                value={newField.field_label}
                onChange={(e) => setNewField({...newField, field_label: e.target.value})}
                className="rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500"
              />
              <p className="text-xs text-gray-500">
                This label will be displayed to applicants in the form
              </p>
            </div>
            
            {/* Field Type */}
            <div className="space-y-2">
              <Label htmlFor="fieldType" className="text-sm font-medium text-gray-700">
                Input Type *
              </Label>
              <Select 
                value={newField.field_type} 
                onValueChange={(value) => setNewField({...newField, field_type: value})}
              >
                <SelectTrigger className="rounded-lg border-gray-200 focus:border-teal-500 focus:ring-teal-500">
                  <SelectValue placeholder="Choose the type of input field" />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem value="text" className="flex items-center">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="font-medium">Text Input</div>
                        <div className="text-xs text-gray-500">Short text responses</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="number">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 text-center text-xs font-bold text-gray-500">#</span>
                      <div>
                        <div className="font-medium">Number Input</div>
                        <div className="text-xs text-gray-500">Numeric values only</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="date">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 text-center text-xs text-gray-500">📅</span>
                      <div>
                        <div className="font-medium">Date Picker</div>
                        <div className="text-xs text-gray-500">Calendar date selection</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="file">
                    <div className="flex items-center gap-2">
                      <Upload className="w-4 h-4 text-gray-500" />
                      <div>
                        <div className="font-medium">File Upload</div>
                        <div className="text-xs text-gray-500">Document or image upload</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="dropdown">
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 text-center text-xs font-bold text-gray-500">▼</span>
                      <div>
                        <div className="font-medium">Dropdown Menu</div>
                        <div className="text-xs text-gray-500">Predefined options</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Choose the most appropriate input type for the information you need
              </p>
            </div>
            
            {/* Dropdown Options Configuration */}
            {newField.field_type === 'dropdown' && (
              <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-blue-900">Configure Dropdown Options</span>
                  <span className="text-xs text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">Required for dropdown fields</span>
                </div>
                <div className="space-y-2">
                  {newField.dropdown_options.map((option: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e: any) => {
                          const newOptions = [...newField.dropdown_options];
                          newOptions[index] = e.target.value;
                          setNewField({...newField, dropdown_options: newOptions});
                        }}
                        className="flex-1 rounded-lg border-blue-200 focus:border-blue-500"
                      />
                      {newField.dropdown_options.length > 2 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            const newOptions = newField.dropdown_options.filter((_: any, i: number) => i !== index);
                            setNewField({...newField, dropdown_options: newOptions});
                          }}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setNewField({
                        ...newField, 
                        dropdown_options: [...newField.dropdown_options, `Option ${newField.dropdown_options.length + 1}`]
                      });
                    }}
                    className="w-full rounded-lg border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Another Option
                  </Button>
                </div>
                <p className="text-xs text-blue-700">
                  Minimum 2 options required. Users will select one of these options from a dropdown menu.
                </p>
              </div>
            )}
            
            {/* Required Field Toggle */}
            <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Checkbox
                id="isRequired"
                checked={newField.is_required}
                onCheckedChange={(checked) => setNewField({...newField, is_required: checked as boolean})}
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label htmlFor="isRequired" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Make this field required
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Required fields must be completed before applicants can submit their application
                </p>
              </div>
            </div>

            {/* Preview Section */}
            {newField.field_label && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Preview</Label>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="space-y-2">
                    <Label className="text-sm">
                      {newField.field_label} 
                      {newField.is_required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {newField.field_type === 'text' && (
                      <Input placeholder={`Enter ${newField.field_label.toLowerCase()}`} disabled />
                    )}
                    {newField.field_type === 'number' && (
                      <Input type="number" placeholder="0" disabled />
                    )}
                    {newField.field_type === 'date' && (
                      <Input type="date" disabled />
                    )}
                    {newField.field_type === 'file' && (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center text-gray-500 text-sm">
                        Click to upload file
                      </div>
                    )}
                    {newField.field_type === 'dropdown' && (
                      <Select disabled>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {newField.dropdown_options.map((option: string, index: number) => (
                            <SelectItem key={index} value={option.toLowerCase().replace(/\s+/g, '-')}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  This is how the field will appear to applicants
                </p>
              </div>
            )}
          </div>
          
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsAddFieldModalOpen(false);
                setEditingField(null);
                setNewField({ field_label: "", field_type: "text", is_required: false, dropdown_options: ["Option 1", "Option 2"] });
              }}
              className="flex-1 rounded-lg"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitNewField}
              disabled={
                isLoading || 
                !newField.field_label.trim() || 
                (newField.field_type === 'dropdown' && newField.dropdown_options.filter((opt: string) => opt.trim() !== '').length < 2)
              }
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white rounded-lg shadow-sm disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </div>
              ) : (
                editingField ? "Update Field" : "Add Field"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Additional Settings Cards */}
      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
          <CardDescription>General configuration for certificate applications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Processing Time (Days)</Label>
            <Input 
              type="number" 
              defaultValue="7" 
              className="rounded-lg w-24"
            />
            <p className="text-xs text-muted-foreground">
              Expected processing time for new applications
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Application Fee (₦)</Label>
            <Input 
              type="number" 
              defaultValue="5000" 
              className="rounded-lg w-32"
            />
            <p className="text-xs text-muted-foreground">
              Standard fee for certificate issuance
            </p>
          </div>
          
          <Button className="bg-teal-600 hover:bg-teal-700">
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
