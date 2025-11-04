import { useState } from "react";
import { LGAdminDashboardDesign } from "./lgAdminDashboardDesign";
import { toast } from "sonner";
import type { NavigationProps, Application, DigitizationRequest, DynamicField } from "../../Types/types";

export function LGAdminDashboard({ onNavigate }: NavigationProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'applications' | 'digitization' | 'reports' | 'settings'>('dashboard');
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock data - replace with API calls
  const applications: Application[] = [
    {
      id: "APP-2025-001",
      name: "John Oluwaseun Doe",
      nin: "12345678901",
      status: "pending",
      payment: "Paid",
      dateProcessed: "2025-10-18",
      dateApplied: "2025-10-10",
      village: "Agege",
      lga: "Ikeja",
      state: "Lagos"
    },
    {
      id: "APP-2025-002",
      name: "Amina Bello Mohammed",
      nin: "98765432109",
      status: "under-review",
      payment: "Paid",
      dateProcessed: "2025-10-17",
      dateApplied: "2025-10-10",
      village: "Ikeja",
      lga: "Ikeja",
      state: "Lagos"
    },
    {
      id: "APP-2025-003",
      name: "Chukwu Emeka Okafor",
      nin: "55566677788",
      status: "approved",
      payment: "Paid",
      dateProcessed: "2025-10-15",
      dateApplied: "2025-10-10",
      village: "Oshodi",
      lga: "Ikeja",
      state: "Lagos"
    },
    {
      id: "APP-2025-004",
      name: "Fatima Ibrahim Hassan",
      nin: "11122233344",
      status: "rejected",
      payment: "Paid",
      dateProcessed: "2025-10-14",
      dateApplied: "2025-10-10",
      village: "Mushin",
      lga: "Ikeja",
      state: "Lagos"
    }
  ];

  const digitizationRequests: DigitizationRequest[] = [
    {
      id: "DIGI-2025-001",
      name: "Taiwo Adebayo Ogunleye",
      nin: "33344455566",
      status: "pending",
      payment: "Paid",
      date: "2025-10-20",
      certificateRef: "CERT-IKJ-2018-123",
      uploadPreview: "certificate_scan.pdf"
    },
    {
      id: "DIGI-2025-002",
      name: "Grace Onyinye Nwankwo",
      nin: "77788899900",
      status: "under-review",
      payment: "Paid",
      date: "2025-10-19",
      certificateRef: "",
      uploadPreview: "old_cert.jpg"
    },
    {
      id: "DIGI-2025-003",
      name: "Ibrahim Musa Yusuf",
      nin: "44455566677",
      status: "approved",
      payment: "Paid",
      date: "2025-10-16",
      certificateRef: "CERT-IKJ-2015-078",
      uploadPreview: "certificate.pdf"
    }
  ];

  const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([
    { id: "1", field_label: "Letter from Traditional Ruler", field_type: "file", is_required: true },
    { id: "2", field_label: "Proof of Residence", field_type: "file", is_required: true },
    { id: "3", field_label: "Community Leader Endorsement", field_type: "text", is_required: false }
  ]);

  const weeklyData = [
    { name: 'Mon', value: 12 },
    { name: 'Tue', value: 19 },
    { name: 'Wed', value: 15 },
    { name: 'Thu', value: 22 },
    { name: 'Fri', value: 18 },
    { name: 'Sat', value: 8 },
    { name: 'Sun', value: 5 }
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

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      onNavigate('landing');
    }
  };

  const handleAddDynamicField = (field: Omit<DynamicField, 'id'>) => {
    const newField: DynamicField = {
      ...field,
      id: (dynamicFields.length + 1).toString()
    };
    setDynamicFields([...dynamicFields, newField]);
    toast.success("Field added successfully");
  };

  const handleDeleteDynamicField = (fieldId: string, fieldLabel: string) => {
    if (window.confirm(`Are you sure you want to delete "${fieldLabel}"?`)) {
      setDynamicFields(dynamicFields.filter(field => field.id !== fieldId));
      toast.success(`Field "${fieldLabel}" deleted successfully`);
    }
  };

  return (
    <LGAdminDashboardDesign
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      statusFilter={statusFilter}
      setStatusFilter={setStatusFilter}
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
      onNavigate={onNavigate}
    />
  );
}