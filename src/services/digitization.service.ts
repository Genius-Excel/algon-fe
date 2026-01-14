import apiClient from "./api";
import type { DigitizationFormData } from "../Types/types";
import { mockDigitizationService } from "./mock.service"; // ✅ Import correct mock

const USE_MOCK = false; // API integration enabled

class DigitizationService {
  async submitDigitization(
    data: DigitizationFormData & {
      certificateFile?: File;
      full_name: string;
      state: string;
      local_government_id?: string;
    }
  ) {
    if (USE_MOCK) {
      return mockDigitizationService.submitDigitization(data); // ✅ Use correct mock
    }

    const formData = new FormData();

    // Required text fields per API spec
    formData.append("nin", data.nin);
    formData.append("email", data.email);
    formData.append("full_name", data.full_name);
    formData.append("state", data.state);
    formData.append("local_government", data.lga);
    formData.append("phone_number", data.phone);
    formData.append("certificate_reference_number", data.certificateRef);

    // Add local_government_id if provided (for fee lookup)
    if (data.local_government_id) {
      formData.append("local_government_id", data.local_government_id);
    }

    // Optional file fields
    if (data.profilePhoto) {
      formData.append("profile_photo", data.profilePhoto);
    }
    if (data.ninSlip) {
      formData.append("nin_slip", data.ninSlip);
    }
    if (data.certificateFile) {
      formData.append("uploaded_certificate", data.certificateFile);
    }

    const response = await apiClient.post(
      "/certificate/digitizations/apply",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  async getMyDigitizationRequests() {
    if (USE_MOCK) {
      return mockDigitizationService.getMyDigitizationRequests(); // ✅ Use correct mock
    }
    const response = await apiClient.get("/digitization/requests/my/");
    return response.data;
  }

  async getAllDigitizationRequests(filters?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    if (USE_MOCK) {
      return mockDigitizationService.getAllDigitizationRequests(filters); // ✅ Use correct mock
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
      `/digitization/requests/?${params.toString()}`
    );
    return response.data;
  }

  async updateDigitizationStatus(
    id: string,
    status: "approved" | "rejected",
    comment?: string
  ) {
    if (USE_MOCK) {
      return mockDigitizationService.updateDigitizationStatus(
        id,
        status,
        comment
      ); // ✅ Use correct mock
    }
    const response = await apiClient.patch(
      `/digitization/requests/${id}/status/`,
      { status, comment }
    );
    return response.data;
  }
}

export default new DigitizationService();
