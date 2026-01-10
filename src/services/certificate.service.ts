import apiClient from "./api";
import { mockCertificateService } from "./mock.service"; // ✅ Import correct mock

const USE_MOCK = false; // API integration enabled

class CertificateService {
  async downloadCertificate(id: string): Promise<Blob> {
    if (USE_MOCK) {
      return mockCertificateService.downloadCertificate(id); // ✅ Use correct mock
    }

    const response = await apiClient.get(`/certificates/${id}/download/`, {
      responseType: "blob",
    });
    return response.data;
  }

  async verifyCertificate(certificateNumber: string) {
    if (USE_MOCK) {
      return mockCertificateService.verifyCertificate(certificateNumber); // ✅ Use correct mock
    }
    const response = await apiClient.post(
      `/certificate/verify`,
      { cert_id: certificateNumber },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  }

  async getCertificatePreview(applicationId: string) {
    if (USE_MOCK) {
      return mockCertificateService.getCertificatePreview(applicationId); // ✅ Use correct mock
    }
    const response = await apiClient.get(
      `/certificates/preview/${applicationId}/`
    );
    return response.data;
  }
}

export default new CertificateService();
