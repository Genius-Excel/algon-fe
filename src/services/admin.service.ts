import apiClient from "./api";
import type { DynamicField, OnboardingFormData } from "../Types/types";
import { mockAdminService } from "./mock.service";

const USE_MOCK = false;

class AdminService {
  // Admin Onboarding
  async completeOnboarding(data: OnboardingFormData) {
    if (USE_MOCK) {
      return mockAdminService.completeOnboarding(data);
    }
    const response = await apiClient.post("/admin/onboarding/", data);
    return response.data;
  }

  // Dynamic Fields Management
  async getDynamicFields(lgId?: string) {
    if (USE_MOCK) {
      return mockAdminService.getDynamicFields(lgId);
    }
    const endpoint = lgId
      ? `/lg/requirements/?lg=${lgId}`
      : "/lg/requirements/";
    const response = await apiClient.get(endpoint);
    return response.data;
  }

  async createDynamicField(fieldData: Omit<DynamicField, "id">) {
    if (USE_MOCK) {
      return mockAdminService.createDynamicField(fieldData);
    }
    const response = await apiClient.post("/lg/requirements/", fieldData);
    return response.data;
  }

  async updateDynamicField(
    fieldId: string,
    fieldData: Omit<DynamicField, "id">
  ) {
    if (USE_MOCK) {
      return mockAdminService.updateDynamicField(fieldId, fieldData);
    }
    const response = await apiClient.put(
      `/lg/requirements/${fieldId}/`,
      fieldData
    );
    return response.data;
  }

  async deleteDynamicField(fieldId: string) {
    if (USE_MOCK) {
      return mockAdminService.deleteDynamicField(fieldId);
    }
    const response = await apiClient.delete(`/lg/requirements/${fieldId}/`);
    return response.data;
  }

  // Dashboard Analytics
  async getDashboardStats(lgId?: string) {
    if (USE_MOCK) {
      return mockAdminService.getDashboardStats(lgId);
    }
    const endpoint = lgId
      ? `/analytics/dashboard/?lg=${lgId}`
      : "/analytics/dashboard/";
    const response = await apiClient.get(endpoint);
    return response.data;
  }

  async getApplicationTrends(period: "week" | "month" | "year", lgId?: string) {
    if (USE_MOCK) {
      return mockAdminService.getApplicationTrends(period, lgId);
    }
    const params = new URLSearchParams({ period });
    if (lgId) params.append("lg", lgId);

    const response = await apiClient.get(
      `/analytics/trends/?${params.toString()}`
    );
    return response.data;
  }

  // Settings
  async getSettings(lgId?: string) {
    const endpoint = lgId ? `/settings/?lg=${lgId}` : "/settings/";
    const response = await apiClient.get(endpoint);
    return response.data;
  }

  async updateSettings(settings: {
    processingTimeDays?: number;
    applicationFee?: number;
    processingFee?: number;
    autoApproval?: boolean;
  }) {
    const response = await apiClient.patch("/settings/", settings);
    return response.data;
  }

  // Super Admin - LGA Management
  async getAllLGAs(filters?: { status?: string; state?: string }) {
    if (USE_MOCK) {
      return mockAdminService.getAllLGAs(filters);
    }
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(
      `/admin/super/lgas?${params.toString()}`
    );
    return response.data;
  }

  async createLGAdmin(data: {
    state: string;
    lga: string;
    full_name: string;
    email: string;
  }) {
    if (USE_MOCK) {
      return mockAdminService.createLGAdmin(data);
    }
    const response = await apiClient.post("/admin/super/invite-lg", data);
    return response.data;
  }

  async updateLGAStatus(lgaId: string, status: "active" | "inactive") {
    if (USE_MOCK) {
      return mockAdminService.updateLGAStatus(lgaId, status);
    }
    const response = await apiClient.patch(`/lgas/${lgaId}/`, { status });
    return response.data;
  }

  // Audit Log
  async getAuditLog(filters?: { page?: number; limit?: number }) {
    if (USE_MOCK) {
      return mockAdminService.getAuditLog(filters);
    }
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(`/audit-log/?${params.toString()}`);
    return response.data;
  }

  // Super Admin - Audit Logs
  async getAuditLogs(params?: {
    page?: number;
    page_size?: number;
    action_type?: string;
    table_name?: string;
    user?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `/admin/super/audit-logs?${queryString}`
      : "/admin/super/audit-logs";

    const response = await apiClient.get(url);
    return response.data;
  }

  async getAuditLogById(id: string) {
    const response = await apiClient.get(`/admin/super/audit-log/${id}`);
    return response.data;
  }

  // Super Admin - Invite LG Admin
  async inviteLGAdmin(data: {
    state: string;
    lga: string;
    full_name: string;
    email: string;
  }) {
    const response = await apiClient.post("/admin/super/invite-lg", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

  // Super Admin - Dashboard
  async getSuperAdminDashboard() {
    const response = await apiClient.get("/admin/super/dashboard");
    return response.data;
  }

  // LGA Fee Management
  async getLGAFee() {
    const response = await apiClient.get("/application-fees/local-government");
    return response.data;
  }

  async createLGAFee(data: {
    application_fee: number;
    digitization_fee: number;
    regeneration_fee: number;
  }) {
    const response = await apiClient.post(
      "/application-fees/local-government",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }

  async updateLGAFee(data: {
    application_fee: number;
    digitization_fee: number;
    regeneration_fee: number;
  }) {
    const response = await apiClient.patch(
      "/application-fees/local-government",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }

  // Admin - Application Management
  async getApplicationsReport(params?: {
    application_type?: "certificate" | "digitization";
    [key: string]: any;
  }) {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `/certificates/applications?${queryString}`
      : "/certificates/applications";

    const response = await apiClient.get(url);
    return response.data;
  }

  async exportCSV(type: "applications" | "digitizations") {
    const response = await apiClient.post(
      `/admin/export-csv?type=${type}`,
      null,
      {
        responseType: "blob",
      }
    );
    return response.data;
  }

  async viewSingleApplication(
    applicationId: string,
    applicationType: "certificate" | "digitization"
  ) {
    const response = await apiClient.get(
      `/admin/applications/${applicationId}?application_type=${applicationType}`
    );
    return response.data;
  }

  async getDigitizationOverview() {
    const response = await apiClient.get("/digitization/overview");
    return response.data;
  }

  // Admin - Dynamic Fields
  async createDynamicResponseField(data: {
    local_government: string;
    field_label: string;
    field_name: string;
    is_required: boolean;
    field_type: "file" | "text" | "number" | "date" | "dropdown";
  }) {
    const response = await apiClient.post(
      "/admin/create-response-field",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }

  // Admin - Application Actions
  async manageApplication(
    applicationId: string,
    data: {
      application_type: "certificate" | "digitization";
      action: "approved" | "rejected";
      remarks?: string;
    }
  ) {
    const response = await apiClient.patch(
      `/admin/applications/${applicationId}?application_type=${data.application_type}`,
      {
        application_type: data.application_type,
        action: data.action,
        remarks: data.remarks,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }

  // LG Admin Dashboard
  async getLGAdminDashboard() {
    const response = await apiClient.get("/admin/dashboard");
    return response.data;
  }

  // Utility - Get All States and LGs
  async getAllStatesAndLGs() {
    // Fetch all states at once with a high limit (Nigeria has 37 states)
    const response = await apiClient.get("/all-states?limit=100");
    return response.data;
  }
}

export default new AdminService();
