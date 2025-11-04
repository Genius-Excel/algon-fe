import { useState } from "react";
import { ApplicantDashboardDesign } from "./applicantDashboardDesign";
import type { NavigationProps, Application } from "../../Types/types";

export function ApplicantDashboard({ onNavigate }: NavigationProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'certificates'>('overview');

  // Mock data - replace with API calls
  const applications: Application[] = [
    {
      id: "APP-2025-001",
      name: "John Doe",
      nin: "12345678901",
      lga: "Ikeja",
      state: "Lagos",
      status: "approved",
      dateApplied: "2025-10-01",
      dateProcessed: "2025-10-15",
      payment: "Paid"
    },
    {
      id: "APP-2025-002",
      name: "John Doe",
      nin: "12345678901",
      lga: "Lagos Island",
      state: "Lagos",
      status: "under-review",
      dateApplied: "2025-10-18",
      dateProcessed: "-",
      payment: "Paid"
    }
  ];

  const currentApplication = applications[1];

  const stats = {
    total: applications.length,
    approved: applications.filter(app => app.status === 'approved').length,
    pending: applications.filter(app => app.status === 'under-review' || app.status === 'pending').length
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      onNavigate('landing');
    }
  };

  return (
    <ApplicantDashboardDesign
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      applications={applications}
      currentApplication={currentApplication}
      stats={stats}
      onNavigate={onNavigate}
      handleLogout={handleLogout}
    />
  );
}