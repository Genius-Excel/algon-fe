import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Shield, Building2, DollarSign, FileCheck, LogOut, Search, Menu, UserPlus, Edit, Power } from "lucide-react";
import { StatsCard } from "../../components/StatsCard";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";

interface SuperAdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function SuperAdminDashboard({ onNavigate }: SuperAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock data
  const monthlyData = [
    { month: 'Jan', applications: 1240, revenue: 6820000 },
    { month: 'Feb', applications: 1580, revenue: 8690000 },
    { month: 'Mar', applications: 1320, revenue: 7260000 },
    { month: 'Apr', applications: 1690, revenue: 9295000 },
    { month: 'May', applications: 1950, revenue: 10725000 },
    { month: 'Jun', applications: 2100, revenue: 11550000 },
  ];

  const lgas = [
    { id: 1, name: "Ikeja", state: "Lagos", admin: "Adeola Johnson", status: "active", certificates: 145, revenue: "₦797,500" },
    { id: 2, name: "Lagos Island", state: "Lagos", admin: "Chioma Nwankwo", status: "active", certificates: 198, revenue: "₦1,089,000" },
    { id: 3, name: "Surulere", state: "Lagos", admin: "Ibrahim Musa", status: "active", certificates: 132, revenue: "₦726,000" },
    { id: 4, name: "Kano Municipal", state: "Kano", admin: "Fatima Hassan", status: "active", certificates: 256, revenue: "₦1,408,000" },
    { id: 5, name: "Port Harcourt", state: "Rivers", admin: "Emmanuel Okon", status: "active", certificates: 189, revenue: "₦1,039,500" },
    { id: 6, name: "Kaduna North", state: "Kaduna", admin: "Aisha Bello", status: "inactive", certificates: 0, revenue: "₦0" },
  ];

  const auditLog = [
    { id: 1, action: "LG Admin approved 12 certificates", user: "Adeola Johnson (Ikeja)", timestamp: "2025-10-20 14:30" },
    { id: 2, action: "New LGA added to system", user: "System Admin", timestamp: "2025-10-20 12:15" },
    { id: 3, action: "Payment configuration updated", user: "Super Admin", timestamp: "2025-10-19 16:45" },
    { id: 4, action: "LG Admin rejected 3 applications", user: "Chioma Nwankwo (Lagos Island)", timestamp: "2025-10-19 10:20" },
  ];

  const filteredLGAs = lgas.filter(lga => 
    lga.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lga.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lga.admin.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <div className="text-xs text-muted-foreground">Super Admin</div>
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
              onClick={() => setActiveTab('lgas')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'lgas' ? 'bg-primary text-white' : 'hover:bg-secondary/20'}`}
            >
              Local Governments
            </button>
            <button
              onClick={() => setActiveTab('system')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'system' ? 'bg-primary text-white' : 'hover:bg-secondary/20'}`}
            >
              System Settings
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'audit' ? 'bg-primary text-white' : 'hover:bg-secondary/20'}`}
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
                <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
                  <Menu className="w-5 h-5" />
                </Button>
                <div>
                  <div className="text-foreground">LGCIVS National Portal</div>
                  <div className="text-xs text-muted-foreground">Federal Republic of Nigeria</div>
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
                <h2>National Overview</h2>
                <p className="text-muted-foreground">Monitor certificate issuance across Nigeria</p>
              </div>

              {/* Stats Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard 
                  title="Total Applications"
                  value="9,834"
                  icon={FileCheck}
                  trend="+12.5% from last month"
                  trendUp={true}
                />
                <StatsCard 
                  title="Total Revenue"
                  value="₦54.1M"
                  icon={DollarSign}
                  trend="+8.3% this month"
                  trendUp={true}
                />
                <StatsCard 
                  title="Active LGAs"
                  value="742"
                  icon={Building2}
                  trend="96% coverage"
                  trendUp={true}
                />
                <StatsCard 
                  title="Certificates Issued"
                  value="8,234"
                  icon={Shield}
                  trend="+15.2% this month"
                  trendUp={true}
                />
              </div>

              {/* Charts */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="rounded-xl">
                  <CardHeader>
                    <CardTitle>Monthly Applications</CardTitle>
                    <CardDescription>Application trends over the past 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="applications" stroke="#00796B" strokeWidth={2} dot={{ r: 4 }} />
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
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip 
                          formatter={(value: number) => `₦${(value / 1000000).toFixed(2)}M`}
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
                  <CardDescription>Geographic distribution of active LGAs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gradient-to-br from-secondary/20 to-white rounded-lg h-96 flex items-center justify-center border-2 border-dashed border-border">
                    <div className="text-center">
                      <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Interactive Nigeria Map</p>
                      <p className="text-sm text-muted-foreground mt-2">Showing 742 active LGAs across 36 states</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Top Performing LGAs */}
              <Card className="rounded-xl">
                <CardHeader>
                  <CardTitle>Top Performing LGAs</CardTitle>
                  <CardDescription>Highest certificate issuance this month</CardDescription>
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
          )}

          {activeTab === 'lgas' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <h2>Local Government Management</h2>
                  <p className="text-muted-foreground">Manage all 774 LGAs across Nigeria</p>
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
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
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
                            <Badge className={lga.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
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
                              <Button size="sm" variant="outline" className={lga.status === 'active' ? 'text-red-600' : 'text-green-600'}>
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
          )}

          {activeTab === 'system' && (
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
          )}

          {activeTab === 'audit' && (
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
                      <div key={log.id} className="flex gap-4 pb-4 border-b border-border last:border-0">
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
          )}
        </div>
      </div>
    </div>
  );
}

function AddLGADialog() {
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
          <DialogDescription>Assign an administrator to a Local Government</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>State</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lagos">Lagos</SelectItem>
                <SelectItem value="kano">Kano</SelectItem>
                <SelectItem value="rivers">Rivers</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Local Government</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select LGA" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ikeja">Ikeja</SelectItem>
                <SelectItem value="surulere">Surulere</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Admin Name</Label>
            <Input placeholder="Enter full name" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" placeholder="admin@example.com" />
          </div>
          <Button className="w-full">Create Administrator</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}