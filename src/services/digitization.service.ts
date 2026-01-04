import apiClient from "./api";
import type { DigitizationFormData } from "../Types/types";
import { mockDigitizationService } from "./mock.service"; // ✅ Import correct mock

const USE_MOCK = true; // API integration enabled

class DigitizationService {
  async submitDigitization(
    data: DigitizationFormData & { certificateFile?: File }
  ) {
    if (USE_MOCK) {
      return mockDigitizationService.submitDigitization(data); // ✅ Use correct mock
    }

    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      const typedKey = key as keyof typeof data;
      const value = data[typedKey];

      if (typedKey === "profilePhoto" && value) {
        formData.append("profile_photo", value as File);
      } else if (typedKey === "ninSlip" && value) {
        formData.append("nin_slip", value as File);
      } else if (typedKey === "certificateFile" && value) {
        formData.append("certificate_file", value as File);
      } else if (
        value !== null &&
        !["profilePhoto", "ninSlip", "certificateFile"].includes(typedKey)
      ) {
        formData.append(typedKey, value as string);
      }
    });

    const response = await apiClient.post("/digitization/requests/", formData);
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
