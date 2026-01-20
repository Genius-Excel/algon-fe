import apiClient from "./api";
import { mockCertificateService } from "./mock.service"; // ✅ Import correct mock
import type { CertificateVerificationResponse } from "../Types/types";

const USE_MOCK = false; // API integration enabled

class CertificateService {
  async downloadCertificate(
    certId: string,
    type: "certificate" | "digitization" = "certificate",
  ): Promise<Blob> {
    if (USE_MOCK) {
      return mockCertificateService.downloadCertificate(certId); // ✅ Use correct mock
    }

    try {
      const response = await apiClient.get(`/api/certificates/download/`, {
        params: {
          cert_id: certId,
          type: type,
        },
        responseType: "blob",
      });
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;

      // Try to parse error message from blob response
      let message = "Failed to download certificate";
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const errorData = JSON.parse(text);
          message = errorData.error || errorData.message || message;
        } catch (e) {
          // Keep default message if parsing fails
        }
      } else {
        message =
          error.response?.data?.error ||
          error.response?.data?.message ||
          message;
      }

      if (status === 400) {
        if (message.includes("missing")) {
          throw new Error("Certificate ID is required.");
        } else if (message.includes("Unsupported")) {
          throw new Error("Unsupported certificate type.");
        }
        throw new Error(message);
      } else if (status === 403) {
        if (message.includes("expired")) {
          throw new Error(
            "Certificate expired. Please make payment for certificate regeneration to download.",
          );
        } else if (message.includes("another user")) {
          throw new Error("You cannot access another user's certificate.");
        }
        throw new Error("Access denied. " + message);
      } else if (status === 404) {
        throw new Error("Certificate not found.");
      } else if (status === 401) {
        throw new Error(
          "Unauthorized. Please log in to download certificates.",
        );
      } else if (status >= 500) {
        throw new Error("Server error. Please try again later.");
      }

      throw new Error(message);
    }
  }

  async verifyCertificate(
    certificateNumber: string,
  ): Promise<CertificateVerificationResponse> {
    if (USE_MOCK) {
      return mockCertificateService.verifyCertificate(certificateNumber); // ✅ Use correct mock
    }

    try {
      const response = await apiClient.post(
        `/certificate/verify`,
        { cert_id: certificateNumber },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error: any) {
      const status = error.response?.status;
      const message =
        error.response?.data?.message || "Certificate verification failed";

      if (status === 400) {
        throw new Error(
          "Invalid or missing certificate ID. Please check the certificate number.",
        );
      } else if (status === 401 || status === 403) {
        throw new Error("Unauthorized. Please log in to verify certificates.");
      } else if (status === 404) {
        throw new Error(
          "Certificate not found. Please verify the certificate number.",
        );
      } else if (status >= 500) {
        throw new Error("Server error. Please try again later.");
      }

      throw new Error(message);
    }
  }

  async getCertificatePreview(applicationId: string) {
    if (USE_MOCK) {
      return mockCertificateService.getCertificatePreview(applicationId); // ✅ Use correct mock
    }
    const response = await apiClient.get(
      `/certificates/preview/${applicationId}/`,
    );
    return response.data;
  }
}

export default new CertificateService();
