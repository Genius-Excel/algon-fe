import { useState } from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Shield, FileText, CheckCircle, XCircle, DollarSign, LogOut, Search, Filter, Download, Eye, Menu } from "lucide-react";
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
            <div className="space-y-6">
              <h2>Settings</h2>
              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle>Application Requirements</CardTitle>
                  <CardDescription>Configure local requirements for certificate applications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm">Required Documents</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Letter from Traditional Ruler</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Proof of Residence</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Birth Certificate</span>
                      </label>
                    </div>
                  </div>
                  <Button>Save Settings</Button>
                </CardContent>
              </Card>
            </div>
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
