import apiClient from "./api";
import type { Application, ApplicationFormData } from "../Types/types";
import { mockApplicationService } from "./mock.service";

const USE_MOCK = true; // API integration enabled

// API Response types based on documentation
interface CertificateApplicationResponse {
  message: string;
  data: {
    user_data: {
      full_name: string;
      date_of_birth: string;
      phone_number: string;
      email: string;
      state: string;
      local_government: string;
      village: string;
      nin: string;
    };
    extra_fields: any[];
    application_id: string;
  };
}

interface ApplicationStep2Response {
  message: string;
  data: {
    fee: {
      application_fee: number | null;
      digitization_fee: number | null;
      regeneration_fee: number | null;
      currency: string;
      local_government: string | null;
      last_updated_by: string | null;
    };
    verification_fee: number | null;
    application_id: string;
  };
}

interface DigitizationApplicationResponse {
  message: string;
  data: {
    user_data: {
      id: string;
      email: string;
      phone_number: string;
      state: string;
      local_government: string;
      certificate_reference_number: string;
      nin: string;
      full_name: string;
      payment_status: string;
      verification_status: string;
      reviewed_at: string | null;
      remarks: string | null;
      created_at: string;
      updated_at: string;
      reviewed_by: string | null;
    };
    fee: {
      application_fee: number | null;
      digitization_fee: number | null;
      regeneration_fee: number | null;
      currency: string;
      local_government: string | null;
      last_updated_by: string | null;
    };
  };
}

interface MyApplicationsResponse {
  message: string;
  data: Array<{
    id: string;
    nin: string;
    full_name: string;
    date_of_birth: string;
    phone_number: string;
    email: string;
    village: string;
    residential_address: string | null;
    landmark: string | null;
    letter_from_traditional_ruler: string | null;
    profile_photo: string | null;
    nin_slip: string | null;
    application_status: string;
    payment_status: string;
    remarks: string | null;
    approved_at: string | null;
    created_at: string;
    updated_at: string;
    applicant: string;
    state: {
      id: string;
      name: string;
    };
    local_government: {
      id: string;
      name: string;
    };
    approved_by: string | null;
  }>;
}

interface NINVerificationResponse {
  message: string;
}

interface PaymentInitiationResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

class ApplicationService {
  // Submit certificate application (Step 1)
  async submitCertificateApplication(data: {
    date_of_birth: string;
    email: string;
    full_name: string;
    landmark: string;
    local_government: string;
    phone_number: string;
    state: string;
    village: string;
    nin: string;
    nin_slip?: File;
    profile_photo?: File;
  }): Promise<CertificateApplicationResponse> {
    if (USE_MOCK) {
      return mockApplicationService.submitApplication(data);
    }

    const formData = new FormData();

    // Add text fields
    formData.append("date_of_birth", data.date_of_birth);
    formData.append("email", data.email);
    formData.append("full_name", data.full_name);
    formData.append("landmark", data.landmark);
    formData.append("local_government", data.local_government);
    formData.append("phone_number", data.phone_number);
    formData.append("state", data.state);
    formData.append("village", data.village);
    formData.append("nin", data.nin);

    // Add file fields if present
    if (data.nin_slip) {
      formData.append("nin_slip", data.nin_slip);
    }
    if (data.profile_photo) {
      formData.append("profile_photo", data.profile_photo);
    }

    const response = await apiClient.post<CertificateApplicationResponse>(
      "/certificates/applications/apply",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  // Update certificate application (Step 2)
  async updateApplicationStep2(
    applicationId: string,
    data: {
      residential_address: string;
      landmark: string;
      extra_fields?: Array<{
        field_name: string;
        field_value: string;
        field_id: string;
      }>;
      [key: string]: any; // For dynamic file fields
    }
  ): Promise<ApplicationStep2Response> {
    if (USE_MOCK) {
      return {
        message: "Application updated successfully",
        data: {
          fee: {
            application_fee: 5000,
            digitization_fee: 3000,
            regeneration_fee: 2000,
            currency: "NGN",
            local_government: null,
            last_updated_by: null,
          },
          verification_fee: 1000,
          application_id: applicationId,
        },
      };
    }

    const formData = new FormData();

    formData.append("residential_address", data.residential_address);
    formData.append("landmark", data.landmark);

    if (data.extra_fields && data.extra_fields.length > 0) {
      formData.append("extra_fields", JSON.stringify(data.extra_fields));
    }

    // Add any file fields
    Object.keys(data).forEach((key) => {
      if (
        key !== "residential_address" &&
        key !== "landmark" &&
        key !== "extra_fields" &&
        data[key] instanceof File
      ) {
        formData.append(key, data[key]);
      }
    });

    const response = await apiClient.patch<ApplicationStep2Response>(
      `/certificates/applications/apply/${applicationId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }

  // Submit digitization application
  async submitDigitizationApplication(data: {
    nin: string;
    email: string;
    full_name: string;
    state: string;
    local_government: string;
    phone_number: string;
    certificate_reference_number: string;
    profile_photo?: File;
    nin_slip?: File;
    uploaded_certificate?: File;
  }): Promise<DigitizationApplicationResponse> {
    if (USE_MOCK) {
      return {
        message: "Digitization application submitted successfully",
        data: {
          user_data: {
            id: "dig-" + Date.now(),
            email: data.email,
            phone_number: data.phone_number,
            state: data.state,
            local_government: data.local_government,
            certificate_reference_number: data.certificate_reference_number,
            nin: data.nin,
            full_name: data.full_name,
            payment_status: "pending",
            verification_status: "pending",
            reviewed_at: null,
            remarks: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            reviewed_by: null,
          },
          fee: {
            application_fee: null,
            digitization_fee: 3000,
            regeneration_fee: null,
            currency: "NGN",
            local_government: null,
            last_updated_by: null,
          },
        },
      };
    }

    const formData = new FormData();

    formData.append("nin", data.nin);
    formData.append("email", data.email);
    formData.append("full_name", data.full_name);
    formData.append("state", data.state);
    formData.append("local_government", data.local_government);
    formData.append("phone_number", data.phone_number);
    formData.append(
      "certificate_reference_number",
      data.certificate_reference_number
    );

    if (data.profile_photo) {
      formData.append("profile_photo", data.profile_photo);
    }
    if (data.nin_slip) {
      formData.append("nin_slip", data.nin_slip);
    }
    if (data.uploaded_certificate) {
      formData.append("uploaded_certificate", data.uploaded_certificate);
    }

    const response = await apiClient.post<DigitizationApplicationResponse>(
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

  // Get my applications
  async getMyApplications(params?: {
    application_type?: "certificate" | "digitization";
    limit?: number;
    offset?: number;
  }): Promise<MyApplicationsResponse> {
    if (USE_MOCK) {
      const mockData = await mockApplicationService.getMyApplications();
      return {
        message: "Applications retrieved successfully",
        data: mockData,
      };
    }

    const queryParams = new URLSearchParams();
    if (params?.application_type) {
      queryParams.append("application_type", params.application_type);
    }
    if (params?.limit) {
      queryParams.append("limit", params.limit.toString());
    }
    if (params?.offset) {
      queryParams.append("offset", params.offset.toString());
    }

    const queryString = queryParams.toString();
    const url = queryString
      ? `/certificates/my-applications?${queryString}`
      : "/certificates/my-applications";

    const response = await apiClient.get<MyApplicationsResponse>(url);
    return response.data;
  }

  // Verify NIN information
  async verifyNIN(
    applicationId: string,
    type: "certificate" | "digitization"
  ): Promise<NINVerificationResponse> {
    if (USE_MOCK) {
      return {
        message: "NIN verification successful",
      };
    }

    const response = await apiClient.get<NINVerificationResponse>(
      `/verify-nin/${applicationId}?type=${type}`
    );
    return response.data;
  }

  // Initiate payment
  async initiatePayment(data: {
    payment_type: "certificate" | "digitization";
    application_id: string;
    amount?: number;
  }): Promise<PaymentInitiationResponse> {
    if (USE_MOCK) {
      return {
        status: true,
        message: "Payment initiated successfully",
        data: {
          authorization_url:
            "https://mock-payment-gateway.com/pay/" + data.application_id,
          access_code: "mock_access_" + Date.now(),
          reference: "mock_ref_" + Date.now(),
        },
      };
    }

    const response = await apiClient.post<PaymentInitiationResponse>(
      "/certificate/initiate-payment",
      data,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }

  // Legacy methods for backward compatibility
  async submitApplication(data: ApplicationFormData): Promise<Application> {
    if (USE_MOCK) {
      return mockApplicationService.submitApplication(data);
    }

    const formData = new FormData();

    // Add text fields
    Object.keys(data).forEach((key) => {
      const typedKey = key as keyof ApplicationFormData;
      const value = data[typedKey];

      if (typedKey === "profilePhoto" && value) {
        formData.append("profile_photo", value as File);
      } else if (typedKey === "ninSlip" && value) {
        formData.append("nin_slip", value as File);
      } else if (
        value !== null &&
        typedKey !== "profilePhoto" &&
        typedKey !== "ninSlip"
      ) {
        formData.append(typedKey, value as string);
      }
    });

    const response = await apiClient.post<Application>(
      "/applications/",
      formData
    );
    return response.data;
  }

  async getApplicationById(id: string): Promise<Application> {
    if (USE_MOCK) {
      return mockApplicationService.getApplicationById(id);
    }

    const response = await apiClient.get<Application>(`/applications/${id}/`);
    return response.data;
  }

  async getAllApplications(filters?: {
    status?: string;
    lg?: string;
    page?: number;
    limit?: number;
  }): Promise<{ results: Application[]; count: number }> {
    if (USE_MOCK) {
      return mockApplicationService.getAllApplications(filters);
    }
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await apiClient.get(`/applications/?${params.toString()}`);
    return response.data;
  }

  async updateApplicationStatus(
    id: string,
    status: "approved" | "rejected",
    comment?: string
  ): Promise<Application> {
    if (USE_MOCK) {
      return mockApplicationService.updateApplicationStatus(
        id,
        status,
        comment
      );
    }
    const response = await apiClient.patch<Application>(
      `/applications/${id}/status/`,
      { status, comment }
    );
    return response.data;
  }
}

export default new ApplicationService();
